export class Entry {
    productId: number;
    quantity: number;

    constructor(productId: number, quantity: number) {
        this.productId = productId;
        this.quantity = quantity;
    }

    toJSObject():any {
        return { productId: this.productId, quantity: this.quantity };
    }
}

export class Cart {
    entries: Array<Entry>;
    
    constructor(entries: Array<Entry>) {
        this.entries = entries;
    }

    getEntryById(productId:number):Entry|null {
        let result:Entry|null = null;

        for(let entry of this.entries) {
            if (entry.productId === productId) {
                result = entry;
                break;
            }
        }

        return result;
    }

    addEntryById(productId:number) {
        let entryNotInCart = true;

        for(const idx in this.entries) {
            let oldEntry = this.entries[idx];

            if (oldEntry.productId === productId) {
                let updatedEntry = new Entry(productId, oldEntry.quantity + 1);
                
                this.entries = Object.assign([], this.entries);
                this.entries[idx] = updatedEntry;
                entryNotInCart = false;
            }
        }

        if (entryNotInCart) {
            let newEntry = new Entry(productId, 1);
            this.appendEntry(newEntry);
        }
    }

    updateEntry(updated:Entry) {
        let entryNotInCart = true;

        for(const idx in this.entries) {
            let oldEntry = this.entries[idx];

            if (oldEntry.productId === updated.productId) {
                this.entries = Object.assign([], this.entries);
                this.entries[idx] = updated;
                entryNotInCart = false;
            }
        }

        if (entryNotInCart) {
            this.appendEntry(updated);
        }
    }

    appendEntry(entry:Entry) {
        this.entries = Object.assign([], this.entries);
        this.entries.push(entry);
    }

    removeEntry(entry:Entry) {
        this.entries = Object.assign([], this.entries);

        let entryIdx = '-1';
        for (let idx in this.entries) {
            if (this.entries[idx].productId === entry.productId) {
                entryIdx = idx;
            }
        }
        if (entryIdx !== '-1') {
            this.entries.splice(parseInt(entryIdx), 1);
        }
    }

    toJSObject():any {
        let jsoEntries = this.entries.map((entry:Entry) => entry.toJSObject());

        return { entries: jsoEntries }
    }

    static fromJSObject(cart:any):Cart {
        let entries = (cart.entries === undefined)? []: cart.entries.map((entry:any) => new Entry(entry.productId, entry.quantity));
        let result:Cart = new Cart(entries);

        return result;        
    }

    static EMPTY:any = {entries: []};
}