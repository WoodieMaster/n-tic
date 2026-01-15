import * as assert from "node:assert";
import {repeat_v} from "./util.ts";
import type {Tuple} from "./types.ts";

export type VecDirection = Vec<number, -1 | 0 | 1>;


export class Vec<Length extends number = number, Item extends number = number> {
    readonly #arr: Tuple<Item, Length>;

    comparable(other: Vec){ return this.#arr.length === other.#arr.length; };

    static from<Item extends number, Length extends number>(value: Item, length: Length): Vec<Length, Item> {
        return new Vec(Array.from(repeat_v(value, length)) as Tuple<Item, Length>);
    }

    constructor(arr: Tuple<Item, Length>) {
        this.#arr = Array.from(arr) as Tuple<Item, Length>;
    }

    add(this: Vec, vec: Vec<Length, Item>) {
        assert.ok(this.comparable(vec), "vecs not compatible");
        for(let i = 0; i < vec.#arr.length; i++) {
            this.#arr[i]! += vec.#arr[i]!;
        }

        return this;
    }

    map<RItem extends number>(fn: (item: Item, idx: number) => RItem) {
        const new_vec = new Vec<Length, RItem | Item>(this.#arr);
        const arr = new_vec.#arr;
        for(let i = 0; i < arr.length; i++) {
            arr[i] = fn(arr[i] as Item, i);
        }
        return new_vec as Vec<Length, RItem>;
    }

    add_scalar(this: Vec, n: Item) {
        for(let i = 0; i < this.#arr.length; i++) {
            this.#arr[i]! += n;
        }

        return this;
    }

    flip_values(this: Vec) {
        for(let i = 0; i < this.#arr.length; i++) {
            this.#arr[i]! = -this.#arr[i]!;
        }

        return this;
    }

    scale(this: Vec, m: number) {
        for(let i = 0; i < this.#arr.length; i++) {
            this.#arr[i]! = -this.#arr[i]!;
        }

        return this;
    }

    get(idx: number) {
        return this.#arr[idx];
    }

    size() {
        return this.#arr.length;
    }

    iter() {
        return this.#arr[Symbol.iterator]();
    }

    filled(value: Item, start?: number, end?: number) {
        const new_vec = this.clone();
        new_vec.#arr.fill(value, start, end);

        return new_vec;
    }

    with(idx: number, value: Item) {
        const new_vec = this.clone();
        new_vec.#arr[idx] = value;
        return new_vec;
    }

    multiply(this: Vec,vec: Vec<Length>) {
        assert.ok(this.comparable(vec), "vecs not compatible");
        for(let i = 0; i < this.#arr.length; i++) {
            this.#arr[i]! *= vec.#arr[i]!;
        }

        return this;
    }

    toKeyString() {
        return this.#arr.map(n => n.toString(36)).join(",")
    }

    static zero<Length extends number>(length: Length) { return Vec.from(0, length); }


    clone(): this {
        return new Vec<Length, Item>(this.#arr) as this;
    }

    toTuple(): Tuple<Item, Length> {
        return [...this.#arr] as Tuple<Item, Length>;
    }
}