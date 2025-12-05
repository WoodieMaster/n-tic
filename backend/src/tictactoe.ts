import type {BoardCell, BoardPosition, BoardVec} from "../../shared/types.d.ts";
import {BoardCellEmpty} from "../../shared/board.ts";

export class Board {
    board: Uint8Array;
    readonly dimensions: number;
    readonly sideLength: number;
    readonly emptyPos: BoardVec;

    constructor(dimensions: number, sideLength: number) {
        this.dimensions = dimensions;
        this.sideLength = sideLength;
        this.board = new Uint8Array(dimensions * sideLength);
        this.emptyPos = new Array(dimensions).fill(0);
    }

    #assertPos(pos: BoardPosition) {
        console.assert(pos.length === this.dimensions, "Invalid dimension count in position")
    }

    #posToIdx(pos: number[]) {
        this.#assertPos(pos);
        let result = 0;
        let multiplier = 1;

        for(const dimPos of pos) {
            result += dimPos * multiplier;
            multiplier *= this.sideLength;
        }

        return result;
    }

    inBound(pos: BoardPosition) {
        this.#assertPos(pos);

        return pos.every(d => d < this.sideLength);
    }

    setCell(pos: BoardPosition, value: BoardCell) {
        console.assert(this.inBound(pos), "Position out of bounds");
        this.board[this.#posToIdx(pos)] = value;
    }

    getCell(pos: BoardPosition) {
        console.assert(this.inBound(pos), "Position out of bounds");
        return this.board[this.#posToIdx(pos)] as BoardCell;
    }

    checkWinForChangedPosition(changedPosition: BoardPosition): BoardCell {
        let checkVec: BoardVec = [...this.emptyPos];
        let expectedCell = this.getCell(changedPosition);

        console.assert(expectedCell !== BoardCellEmpty, "Changed cell is empty");

        outer: while(true) {
            // go through all possible directions
            let newCheckVec = getNextCheckVector(checkVec);

            if(newCheckVec === null) break; // all vecs checked

            if(!checkVectorIsOnFullDiagonal(newCheckVec, changedPosition, this.sideLength)) continue;
            checkVec = newCheckVec;

            // Direction valid for win


            let checkStartPosition = changedPosition
                .map((v, i) => {
                    if(checkVec[i] === 1) return 0;
                    if(checkVec[i] === -1) return this.sideLength - 1;
                    return v
                });

            for(let i = 0; i < this.sideLength; i++) {
                if(this.getCell(addVector(checkStartPosition, checkVec)) !== expectedCell) {
                    // Direction contains different cell
                    continue outer;
                }
            }

            // Direction has all equal cells -> win
            return expectedCell;
        }
        return 0;
    }
}

/**
 * Check if the diagonal the vector defines when going through position is a full diagonal.
 * A full diagonal is defined as a diagonal that has the same length as sidelength (= max possible length)
 * @param vec
 * @param position
 * @param sidelength
 */
function checkVectorIsOnFullDiagonal(vec: BoardVec, position: BoardPosition, sidelength: number): boolean {
    console.assert(vec.length === position.length, "vector and position do not have the same length");
    let expectedEdgeDistance = null;

    for(let i = 1; i < vec.length; i++) {
        if(vec[i] === 0) continue;
        const edgeDistance = calculateEdgeDistance(sidelength, position[i]!);
        if(expectedEdgeDistance === null) expectedEdgeDistance = edgeDistance;
        else if(expectedEdgeDistance !== edgeDistance) {
            return false;
        }
    }
    return true;
}

function calculateEdgeDistance(sidelength: number, pos: number): number {
    return Math.min(pos, pos - sidelength -1);
}

function addVector(pos: BoardPosition, vec: BoardVec): BoardPosition {
    console.assert(vec.length === pos.length, "vector and position do not have the same length");
    for(let i = 0; i < vec.length; i++) {
        pos[i]! += vec[i]!;
    }

    return pos;
}

function getNextCheckVector(vec: BoardVec): BoardVec | null {
    // FIXME :) Generates twice the required vectors, just dont care to fix it right now :/
    let dimCount = 0;
    // Go through every combination of -1 and 1
    for(let i = 0; i < vec.length; i++) {
        if(vec[i] === -1) {
            vec[i] = 1;
            // console.log(`${i} to 1`);
            return vec;
        }
        if(vec[i] === 1) {
            vec[i] = -1;
            dimCount++;
        }
    }
    // -1 and 1 combinations completed

    // console.log(`shift required`);

    // find all end aligned dimensions
    let resetIdx;
    for(resetIdx = vec.length - 1; resetIdx >= 0; resetIdx--) {
        if(vec[resetIdx] === 0) break;
        vec[resetIdx] = 0;
    }

    // console.log(`resetIdx: ${resetIdx}`);

    // find next used dimension
    let shiftedIdx;
    for(shiftedIdx = resetIdx-1; shiftedIdx >= 0; shiftedIdx--) {
        if(vec[shiftedIdx] != 0) {
            vec[shiftedIdx] = 0;
            break;
        }
    }

    // console.log(`shiftIdx: ${shiftedIdx}`);


    if(shiftedIdx >= 0) {
        // insert part of dimension shifting
        // console.log(`shifting dimensions`);
        vec.fill(-1, shiftedIdx+1, shiftedIdx+1 + vec.length-resetIdx);
        return vec;
    }
    // all dimensions shifted to end
    // console.log(`already fully shifted, increasing used dimension count`);

    // increase used dimension count
    dimCount++;
    if(dimCount <= vec.length) return vec.map((_, i) => i < dimCount? -1: 0);

    // all dimensions counts completed

    // every check combination explored

    return null;
}