"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trie = exports.TrieNode = void 0;
class TrieNode {
    children;
    isEndOfWord;
    data;
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.data = [];
    }
}
exports.TrieNode = TrieNode;
class Trie {
    root;
    constructor() {
        this.root = new TrieNode();
    }
    insert(word, dataItem) {
        let current = this.root;
        const lowerWord = word.toLowerCase();
        for (const char of lowerWord) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
        }
        current.isEndOfWord = true;
        current.data.push(dataItem);
    }
    searchPrefix(prefix) {
        let current = this.root;
        const lowerPrefix = prefix.toLowerCase();
        for (const char of lowerPrefix) {
            if (!current.children.has(char)) {
                return [];
            }
            current = current.children.get(char);
        }
        const results = [];
        this.collectAllWords(current, results);
        return results;
    }
    collectAllWords(node, results) {
        if (node.isEndOfWord) {
            results.push(...node.data);
        }
        for (const child of node.children.values()) {
            this.collectAllWords(child, results);
        }
    }
    clear() {
        this.root = new TrieNode();
    }
}
exports.Trie = Trie;
//# sourceMappingURL=trie.js.map