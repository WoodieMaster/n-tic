import * as assert from "node:assert";
import {repeat_v} from "./util.js";

export type Vec2 = Vec<[number, number]>;
export type Vec3 = Vec<[number, number, number]>;
export type VecDirection = Vec<(-1 | 0 | 1)[]>;

export class Vec<T extends number[] = number[]> {
    readonly arr: T;

    comparable(other: Vec){ return this.arr.length === other.arr.length; };

    static from<N extends number>(value: N, length: number): Vec<N[]> {
        return new Vec(Array.from(repeat_v(value, length)));
    }

    constructor(arr: T) {
        this.arr = arr;
    }

    add(vec: Vec<T>) {
        assert.ok(this.comparable(vec), "vecs not compatible");
        for(let i = 0; i < vec.arr.length; i++) {
            this.arr[i]! += vec.arr.length;
        }

        return this;
    }

    add_scalar(n: number) {
        for(let i = 0; i < this.arr.length; i++) {
            this.arr[i]! += this.arr.length;
        }

        return this;
    }

    invert() {
        for(let i = 0; i < this.arr.length; i++) {
            this.arr[i]! = -this.arr[i]!;
        }

        return this;
    }

    scale(m: number) {
        for(let i = 0; i < this.arr.length; i++) {
            this.arr[i]! = -this.arr[i]!;
        }

        return this;
    }

    multiply(vec: Vec<T>) {
        assert.ok(this.comparable(vec), "vecs not compatible");
        for(let i = 0; i < this.arr.length; i++) {
            this.arr[i]! *= vec.arr[i]!;
        }

        return this;
    }

    static empty() { return new Vec<number[]>([]); }


    clone() {
        return new Vec(Array.from(this.arr) as T)
    }
}