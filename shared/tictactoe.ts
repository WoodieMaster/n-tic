import type {Board, BoardCell, BoardVector, BoardDirection, FilledBoardCell} from "./types.d.ts";
import * as assert from "node:assert";

export const BoardCellEmpty = undefined satisfies BoardCell;
export const BoardCellPlayer1 = 1 satisfies BoardCell;
export const BoardCellPlayer2 = 2 satisfies BoardCell;

export class BoardHandler {
    board: Board;
    readonly dimensions: number;
    readonly sideLength: number;
    readonly emptyPos: BoardDirection;

    constructor(dimensions: number, sideLength: number, board: Board = {}) {
        this.dimensions = dimensions;
        this.sideLength = sideLength;
        this.board = board;
        this.emptyPos = new Array(dimensions).fill(0);
    }

    #assertPos(pos: BoardVector) {
        assert.equal(pos.length, this.dimensions, "Invalid dimension count in position");
    }

    #posToIdx(pos: number[]) {
        this.#assertPos(pos);

        return pos.map(n => n.toString(36)).join(",");
    }

    inBound(pos: BoardVector) {
        this.#assertPos(pos);

        return pos.every(d => d < this.sideLength);
    }

    setCell(pos: BoardVector, value: FilledBoardCell) {
        assert.ok(this.inBound(pos), "Position out of bounds");
        this.board[this.#posToIdx(pos)] = value;
    }

    clearCell(pos: BoardVector) {
        assert.ok(this.inBound(pos), "Position out of bounds");
        delete this.board[this.#posToIdx(pos)];
    }

    getCell(pos: BoardVector) {
        assert.ok(this.inBound(pos), "Position out of bounds");
        return this.board[this.#posToIdx(pos)] as BoardCell;
    }

    checkWinForChangedPosition(changedPosition: BoardVector): BoardCell {
        let checkVec: BoardDirection = [...this.emptyPos];
        let expectedCell = this.getCell(changedPosition);

        assert.notEqual(expectedCell, BoardCellEmpty, "Changed cell is empty");

        outer: while (true) {
            // go through all possible directions
            let newCheckVec = getNextCheckVector(checkVec);

            if (newCheckVec === null) break; // all vecs checked

            if (!checkVectorIsOnFullDiagonal(newCheckVec, changedPosition, this.sideLength)) continue;
            checkVec = newCheckVec;

            // Direction valid for win


            let checkStartPosition = changedPosition
                .map((v, i) => {
                    if (checkVec[i] === 1) return 0;
                    if (checkVec[i] === -1) return this.sideLength - 1;
                    return v
                });

            for (let i = 0; i < this.sideLength; i++) {
                if (this.getCell(addVector(checkStartPosition, checkVec)) !== expectedCell) {
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
function checkVectorIsOnFullDiagonal(vec: BoardDirection, position: BoardVector, sidelength: number): boolean {
    assert.equal(vec.length, position.length, "vector and position do not have the same length");
    let expectedEdgeDistance = null;

    for (let i = 1; i < vec.length; i++) {
        if (vec[i] === 0) continue;
        const edgeDistance = calculateEdgeDistance(sidelength, position[i]!);
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

function addVector(pos: BoardVector, vec: BoardDirection): BoardVector {
    assert.equal(vec.length === pos.length, "vector and position do not have the same length");
    for (let i = 0; i < vec.length; i++) {
        pos[i]! += vec[i]!;
    }

    return pos;
}

function getNextCheckVector(vec: BoardDirection): BoardDirection | null {
    // FIXME :) Generates twice the required vectors, just dont care to fix it right now :/
    let dimCount = 0;
    // Go through every combination of -1 and 1
    for (let i = 0; i < vec.length; i++) {
        if (vec[i] === -1) {
            vec[i] = 1;
            return vec;
        }
        if (vec[i] === 1) {
            vec[i] = -1;
            dimCount++;
        }
    }
    // -1 and 1 combinations completed

    // find all end aligned dimensions
    let resetIdx;
    for (resetIdx = vec.length - 1; resetIdx >= 0; resetIdx--) {
        if (vec[resetIdx] === 0) break;
        vec[resetIdx] = 0;
    }

    // find next used dimension
    let shiftedIdx;
    for (shiftedIdx = resetIdx - 1; shiftedIdx >= 0; shiftedIdx--) {
        if (vec[shiftedIdx] != 0) {
            vec[shiftedIdx] = 0;
            break;
        }
    }


    if (shiftedIdx >= 0) {
        // insert part of dimension shifting
        vec.fill(-1, shiftedIdx + 1, shiftedIdx + 1 + vec.length - resetIdx);
        return vec;
    }
    // all dimensions shifted to end

    // increase used dimension count++
    dimCount++;
    if (dimCount <= vec.length) return vec.map((_, i) => i < dimCount ? -1 : 0);

    // all dimensions counts completed

    // every check combination explored

    return null;
}