import type {Board, BoardCell, FilledBoardCell} from "./types.d.ts";
import * as assert from "node:assert";
import {Vec, type VecDirection} from "./vec.js";

export const BoardCellEmpty = undefined satisfies BoardCell;

export class BoardHandler {
    board: Board;
    readonly dimensions: number;
    readonly sideLength: number;
    readonly emptyPos: VecDirection;

    constructor(dimensions: number, sideLength: number, board: Board = {}) {
        this.dimensions = dimensions;
        this.sideLength = sideLength;
        this.board = board;
        this.emptyPos = Vec.from(0, sideLength);
    }

    #assertPos(pos: Vec) {
        assert.equal(pos.arr.length, this.dimensions, "Invalid dimension count in position");
    }

    #posToIdx(pos: Vec) {
        this.#assertPos(pos);

        return pos.arr.map(n => n.toString(36)).join(",");
    }

    inBound(pos: Vec) {
        this.#assertPos(pos);

        return pos.arr.every(d => d < this.sideLength);
    }

    setCell(pos: Vec, value: FilledBoardCell) {
        assert.ok(this.inBound(pos), "Position out of bounds");
        this.board[this.#posToIdx(pos)] = value;
    }

    clearCell(pos: Vec) {
        assert.ok(this.inBound(pos), "Position out of bounds");
        delete this.board[this.#posToIdx(pos)];
    }

    getCell(pos: Vec) {
        assert.ok(this.inBound(pos), "Position out of bounds");
        return this.board[this.#posToIdx(pos)] as BoardCell;
    }

    checkWinForChangedPosition(changedPosition: Vec): BoardCell {
        let checkVec: VecDirection = this.emptyPos.clone();
        let expectedCell = this.getCell(changedPosition);

        assert.notEqual(expectedCell, BoardCellEmpty, "Changed cell is empty");

        outer: while (true) {
            // go through all possible directions
            let newCheckVec = getNextCheckVector(checkVec);

            if (newCheckVec === null) break; // all vecs checked

            if (!checkVectorIsOnFullDiagonal(newCheckVec, changedPosition, this.sideLength)) continue;
            checkVec = newCheckVec;

            // Direction valid for win


            let checkStartPosition = new Vec(changedPosition.arr
                .map((v, i) => {
                    if (checkVec.arr[i] === 1) return 0;
                    if (checkVec.arr[i] === -1) return this.sideLength - 1;
                    return v
                }));

            for (let i = 0; i < this.sideLength; i++) {
                if (this.getCell(checkStartPosition.add(checkVec)) !== expectedCell) {
                    // Direction contains different cell
                    continue outer;
                }
            }

            // Direction has all equal cells -> win
            return expectedCell;
        }
        return;
    }
}

/**
 * Check if the diagonal the vector defines when going through position is a full diagonal.
 * A full diagonal is defined as a diagonal that has the same length as sidelength (= max possible length)
 * @param vec
 * @param position
 * @param sidelength
 */
function checkVectorIsOnFullDiagonal(vec: VecDirection, position: Vec, sidelength: number): boolean {
    assert.equal(vec.arr.length, position.arr.length, "vector and position do not have the same length");
    let expectedEdgeDistance = null;

    for (let i = 1; i < vec.arr.length; i++) {
        if (vec.arr[i] === 0) continue;
        const edgeDistance = calculateEdgeDistance(sidelength, position.arr[i]!);
        if (expectedEdgeDistance === null) expectedEdgeDistance = edgeDistance;
        else if (expectedEdgeDistance !== edgeDistance) {
            return false;
        }
    }
    return true;
}

function calculateEdgeDistance(sidelength: number, pos: number): number {
    return Math.min(pos, pos - sidelength - 1);
}

function getNextCheckVector(vec: VecDirection): VecDirection | null {
    // FIXME :) Generates twice the required vectors, just dont care to fix it right now :/
    let dimCount = 0;
    // Go through every combination of -1 and 1
    for (let i = 0; i < vec.arr.length; i++) {
        if (vec.arr[i] === -1) {
            vec.arr[i] = 1;
            return vec;
        }
        if (vec.arr[i] === 1) {
            vec.arr[i] = -1;
            dimCount++;
        }
    }
    // -1 and 1 combinations completed

    // find all end aligned dimensions
    let resetIdx;
    for (resetIdx = vec.arr.length - 1; resetIdx >= 0; resetIdx--) {
        if (vec.arr[resetIdx] === 0) break;
        vec.arr[resetIdx] = 0;
    }

    // find next used dimension
    let shiftedIdx;
    for (shiftedIdx = resetIdx - 1; shiftedIdx >= 0; shiftedIdx--) {
        if (vec.arr[shiftedIdx] != 0) {
            vec.arr[shiftedIdx] = 0;
            break;
        }
    }


    if (shiftedIdx >= 0) {
        // insert part of dimension shifting
        vec.arr.fill(-1, shiftedIdx + 1, shiftedIdx + 1 + vec.arr.length - resetIdx);
        return vec;
    }
    // all dimensions shifted to end

    // increase used dimension count++
    dimCount++;
    if (dimCount <= vec.arr.length) return new Vec(vec.arr.map((_, i) => i < dimCount ? -1 : 0));

    // all dimensions counts completed

    // every check combination explored

    return null;
}