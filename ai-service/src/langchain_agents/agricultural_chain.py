"""
AgriSense AI Service — LangChain Agricultural RAG Agent (Stage 13)
==================================================================
Wires LangChain with ChromaDB vector store, semantic embeddings,
and local deterministic agronomic NLP engine / Gemini LLM.
"""

import logging
from typing import Any, Dict, List, Optional
from pathlib import Path

from langchain_core.prompts import PromptTemplate
from langchain_core.documents import Document

from src.rag.agricultural_kb import AgriculturalRAG
from src.llm.provider import get_llm_provider, DeterministicAgronomicEngine

logger = logging.getLogger(__name__)


AGRONOMIC_SYSTEM_PROMPT = """You are AgriSense, an expert agricultural intelligence assistant.
Your answers are scientifically grounded in verified ICAR (Indian Council of Agricultural Research),
State Agricultural Universities (UAS Bengaluru, IIHR, CPRI), and AGMARKNET APMC observations.

Context from Verified Agricultural Knowledge Base:
{context}

Previous Conversation History:
{history}

Farmer Question:
{question}

Provide an actionable, scientifically accurate, and farmer-friendly response.
Structure your reply with:
1. Direct answer with key diagnosis, prices, or recommendations
2. Integrated Pest / Nutrient / Mandi Management Steps
3. Safety considerations, Pre-Harvest Intervals (PHI), and official citations
"""


class AgriculturalLangChainAgent:
    """
    LangChain-integrated Agricultural RAG Engine.
    Handles semantic context retrieval from ChromaDB and response generation.
    """

    def __init__(self, rag_instance: Optional[AgriculturalRAG] = None):
        self.rag = rag_instance or AgriculturalRAG()
        self.prompt_template = PromptTemplate(
            input_variables=["context", "history", "question"],
            template=AGRONOMIC_SYSTEM_PROMPT,
        )
        self.fallback_engine = DeterministicAgronomicEngine()

    def run(
        self,
        question: str,
        history: Optional[List[Dict[str, Any]]] = None,
        crop_filter: Optional[str] = None,
        prefer_gemini: bool = True,
    ) -> Dict[str, Any]:
        """
        Executes the LangChain RAG workflow:
        1. Query ChromaDB for top relevant agronomic documents
        2. Format conversation history
        3. Synthesize response using LLM or local deterministic agronomic engine
        4. Return formatted response with citations and metadata
        """
        # Step 1: ChromaDB semantic retrieval
        docs = self.rag.query_knowledge(
            query_text=question,
            n_results=2,
            crop_filter=crop_filter,
        )

        context_str = ""
        if docs:
            context_str = "\n".join(
                [f"[{d['publisher']}] ({d['crop']} - {d['title']}): {d['content']}" for d in docs]
            )
        else:
            context_str = "No specific research bulletin matched; use standard ICAR Package of Practices."

        # Step 2: Format conversation history
        history_str = "None"
        if history and isinstance(history, list):
            formatted_turns = []
            for msg in history[-4:]:  # Keep last 2-4 turns for context
                role = msg.get("role", "user")
                content = msg.get("content", "")
                if content:
                    formatted_turns.append(f"{role.capitalize()}: {content}")
            if formatted_turns:
                history_str = "\n".join(formatted_turns)

        # Step 3: Build the filled prompt
        filled_prompt = self.prompt_template.format(
            context=context_str,
            history=history_str,
            question=question,
        )

        # Step 4: Generate response with fallback
        reply_text = ""
        model_name = "AgriSense-Agronomic-Engine"

        try:
            llm = get_llm_provider(prefer_gemini=prefer_gemini)
            reply_text = llm.generate_response(
                question,
                system_instruction=filled_prompt,
            )
            model_name = type(llm).__name__
        except Exception as e:
            logger.warning(f"LLM generation failed: {e}. Using deterministic engine.")
            reply_text = self.fallback_engine.generate_response(
                question,
                system_instruction=context_str,
            )

        citations = [
            {
                "id": d["id"],
                "title": d["title"],
                "publisher": d["publisher"],
                "source_url": d["source_url"],
                "crop": d["crop"],
            }
            for d in docs
        ]

        return {
            "text": reply_text,
            "reply": reply_text,
            "model": model_name,
            "intent": "agricultural_intelligence",
            "citations": citations,
            "matched_documents_count": len(docs),
        }

