import * as assert from "node:assert";
import {repeat_v} from "./util.js";
import type {Tuple} from "./types.js";

export type VecDirection = Vec<number, -1 | 0 | 1>;


export class Vec<Length extends number = number, Item extends number = number> {
    readonly arr: Tuple<Item, Length>;

    comparable(other: Vec){ return this.arr.length === other.arr.length; };

    static from<Item extends number, Length extends number>(value: Item, length: Length): Vec<Length, Item> {
        return new Vec(Array.from(repeat_v(value, length)) as Tuple<Item, Length>);
    }

    constructor(arr: Tuple<Item, Length>) {
        this.arr = arr;
    }

    add(this: Vec, vec: Vec<Length, Item>) {
        assert.ok(this.comparable(vec), "vecs not compatible");
        for(let i = 0; i < vec.arr.length; i++) {
            this.arr[i]! += vec.arr[i]!;
        }

        return this;
    }

    map<RItem extends number>(fn: (item: Item, idx: number) => RItem) {
        return new Vec<Length, RItem>(this.arr.map(fn) as Tuple<RItem, Length>)
    }

    add_scalar(this: Vec, n: Item) {
        for(let i = 0; i < this.arr.length; i++) {
            this.arr[i]! += n;
        }

        return this;
    }

    flip_values(this: Vec) {
        for(let i = 0; i < this.arr.length; i++) {
            this.arr[i]! = -this.arr[i]!;
        }

        return this;
    }

    scale(this: Vec,m: number) {
        for(let i = 0; i < this.arr.length; i++) {
            this.arr[i]! = -this.arr[i]!;
        }

        return this;
    }

    multiply(this: Vec,vec: Vec<Length>) {
        assert.ok(this.comparable(vec), "vecs not compatible");
        for(let i = 0; i < this.arr.length; i++) {
            this.arr[i]! *= vec.arr[i]!;
        }

        return this;
    }

    toKeyString() {
        return this.arr.map(n => n.toString(36)).join(",")
    }

    static zero<Length extends number>(length: Length) { return Vec.from(0, length); }


    clone() {
        return new Vec<Length, Item>(Array.from(this.arr) as Tuple<Item, Length>);
    }
}