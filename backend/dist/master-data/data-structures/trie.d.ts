export declare class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;
    data: any[];
    constructor();
}
export declare class Trie {
    root: TrieNode;
    constructor();
    insert(word: string, dataItem: any): void;
    searchPrefix(prefix: string): any[];
    private collectAllWords;
    clear(): void;
}
