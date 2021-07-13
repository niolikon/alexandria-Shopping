export class EntryView {
    productData: any;
    quantity: number;

    constructor(productData: any, quantity: number) {
        this.productData = productData;
        this.quantity = quantity;
    }

    toJSObject():any {
        return { productData: this.productData, quantity: this.quantity };
    }
}

export class CartView {
    entries: EntryView[];
    
    constructor(entries: EntryView[]) {
        this.entries = entries;
    }

    append(entry: EntryView) {
        this.entries = Object.assign([], this.entries);
        this.entries.push(entry);
    }

    toJSObject():any {
        let jsoEntries = this.entries.map( (entry) => entry.toJSObject());

        return { entries: jsoEntries}
    }

    static EMPTY = {entries: []};
}