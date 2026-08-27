export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TrendDirection = 'rising' | 'falling' | 'stable';
export type PipelineStatus = 'running' | 'completed' | 'warning' | 'pending';

export interface ExplanationNode {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface RecommendationAction {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'outline';
  actionType: 'apply' | 'view_details' | 'simulate';
}

export interface AiRecommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  expectedProfitIncrease: string;
  affectedFarm: string;
  affectedCrop: string;
  riskLevel: RiskLevel;
  explanations: ExplanationNode[];
  actions: RecommendationAction[];
}

export interface DecisionTimelineEvent {
  id: string;
  date: string;
  title: string;
  status: 'applied' | 'rejected' | 'accepted' | 'upcoming' | 'pending';
  description?: string;
}

export interface ScenarioSimulation {
  id: string;
  name: string;
  expectedProfit: number;
  expectedYieldKg: number;
  marketPrice: number;
  riskLevel: RiskLevel;
  recommendation: string;
}

// ─── Explainable Pipeline (SHAP Ready) ──────────────────────────────────────

export interface FeatureImportance {
  feature: string;
  weight: number; // 0 to 100
}

export interface ShapValue {
  feature: string;
  impact: 'positive' | 'negative';
  value: number; // absolute contribution value
}

export interface PipelineNodeData {
  id: string;
  engine: string; // e.g. 'weather', 'harvest', 'decision'
  label: string;
  iconType: string;
  status: PipelineStatus;
  executionTimeMs: number;
  confidence: number;
  
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  businessRules: string[];
  
  // Future SHAP ML fields
  featureImportance: FeatureImportance[];
  shapValues: ShapValue[];
  
  recommendation?: string;
  metadata?: Record<string, any>;
}

export interface ExplainableDecisionData {
  recommendation: AiRecommendation;
  pipeline: PipelineNodeData[];
  scenarios: ScenarioSimulation[];
  timeline: DecisionTimelineEvent[];
}
