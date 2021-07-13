export class Search {
    key: string;
    results: any[];
    isNew: boolean;
    
    constructor(key: string, results: any[], isNew: boolean) {
        this.key = key;
        this.results = results;
        this.isNew = isNew;
    }

    static EMPTY: Search = {
        key: '',
        results: [],
        isNew: true
    }
}