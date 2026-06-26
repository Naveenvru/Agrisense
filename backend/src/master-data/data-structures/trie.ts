export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  data: any[];

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.data = [];
  }
}

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string, dataItem: any): void {
    let current = this.root;
    const lowerWord = word.toLowerCase();
    
    for (const char of lowerWord) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    
    current.isEndOfWord = true;
    current.data.push(dataItem);
  }

  searchPrefix(prefix: string): any[] {
    let current = this.root;
    const lowerPrefix = prefix.toLowerCase();
    
    for (const char of lowerPrefix) {
      if (!current.children.has(char)) {
        return []; // Prefix not found
      }
      current = current.children.get(char)!;
    }
    
    // We are at the end of the prefix. Now collect all descendant words.
    const results: any[] = [];
    this.collectAllWords(current, results);
    return results;
  }

  private collectAllWords(node: TrieNode, results: any[]): void {
    if (node.isEndOfWord) {
      results.push(...node.data);
    }
    
    for (const child of node.children.values()) {
      this.collectAllWords(child, results);
    }
  }

  clear(): void {
    this.root = new TrieNode();
  }
}
