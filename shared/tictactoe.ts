import type {Board} from "./types.d.ts";
import {Vec, type VecDirection} from "./vec.ts";

type GameResult = { type: "tie" }
    | { type: "win", playerIdx: number, start: Vec, direction: VecDirection }

export class BoardHandler {
    board: Board;
    readonly dimensions: number;
    readonly sideLength: number;
    readonly emptyPos: VecDirection;

    constructor(dimensions: number, sideLength: number, board: Board = {}) {
        this.dimensions = dimensions;
        this.sideLength = sideLength;
        this.board = board;
        this.emptyPos = Vec.from(0, dimensions);
    }

    #assertPos(pos: Vec) {
        if (pos.size() !== this.dimensions) {
            throw "Invalid dimension count in position";
        }
    }

    inBound(pos: Vec) {
        this.#assertPos(pos);
        return pos.iter().every(d => d < this.sideLength);
    }

    #assertBounds(pos: Vec) {
        if (!this.inBound(pos)) {
            throw "Position out of bounds"
        }
    }

    setCell(pos: Vec, value: number) {
        this.#assertBounds(pos);
        this.board[pos.toKeyString()] = value;
    }

    clearCell(pos: Vec) {
        this.#assertBounds(pos);
        delete this.board[pos.toKeyString()];
    }

    getCell(pos: Vec) {
        this.#assertBounds(pos);
        return this.board[pos.toKeyString()];
    }

    totalCellCount(): number {
        return this.sideLength * this.dimensions;
    }

    occupiedCellCount(): number {
        return Object.getOwnPropertyNames(this.board).length;
    }

    checkWinForChangedPosition(changedPosition: Vec): GameResult | null {
        let checkVec: VecDirection = this.emptyPos.clone();
        let expectedCell = this.getCell(changedPosition);

        if (expectedCell === undefined) return null;

        outer: while (true) {
            // go through all possible directions
            let newCheckVec = getNextCheckVector(checkVec);

            if (newCheckVec === null) break; // all vecs checked

            if (!checkVectorIsOnFullDiagonal(newCheckVec, changedPosition, this.sideLength)) continue;
            checkVec = newCheckVec;

            // Direction valid for win

            let checkStartPosition = changedPosition.map((v, i) => {
                if (checkVec.get(i) === 1) return 0;
                if (checkVec.get(i) === -1) return this.sideLength - 1;
                return v
            });

            for (let i = 0; i < this.sideLength; i++) {
                if (this.getCell(checkStartPosition.add(checkVec)) !== expectedCell) {
                    // Direction contains different cell
                    continue outer;
                }
            }

            // Direction has all equal cells -> win
            return {type: "win", playerIdx: expectedCell, start: checkStartPosition, direction: checkVec};
        }

        if (this.totalCellCount() <= this.occupiedCellCount()) return {type: "tie"}
        return null;
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
    if (!vec.comparable(position)) {
        throw `vector and position do not have the same length ${vec.size()}, ${position.size()}`;
    }
    let expectedEdgeDistance = null;

    for (let i = 1; i < vec.size(); i++) {
        if (vec.get(i) === 0) continue;
        const edgeDistance = calculateEdgeDistance(sidelength, position.get(i)!);
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
    for (let i = 0; i < vec.size(); i++) {
        if (vec.get(i) === -1) {
            vec = vec.with(i, 1);
            return vec;
        }
        if (vec.get(i) === 1) {
            vec = vec.with(i, -1);
            dimCount++;
        }
    }
    // -1 and 1 combinations completed

    // find all end aligned dimensions
    let resetIdx;
    for (resetIdx = vec.size() - 1; resetIdx >= 0; resetIdx--) {
        if (vec.get(resetIdx) === 0) break;
        vec = vec.with(resetIdx, 0);
    }

    // find next used dimension
    let shiftedIdx;
    for (shiftedIdx = resetIdx - 1; shiftedIdx >= 0; shiftedIdx--) {
        if (vec.get(shiftedIdx) != 0) {
            vec = vec.with(shiftedIdx, 0);
            break;
        }
    }


    if (shiftedIdx >= 0) {
        // insert part of dimension shifting
        vec = vec.filled(-1, shiftedIdx + 1, shiftedIdx + 1 + vec.size() - resetIdx);
        return vec;
    }
    // all dimensions shifted to end

    // increase used dimension count++
    dimCount++;
    if (dimCount <= vec.size()) return vec.map((_, i) => i < dimCount ? -1 : 0);

    // all dimensions counts completed

    // every check combination explored

    return null;
}