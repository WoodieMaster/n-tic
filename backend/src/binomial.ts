const binomials = [
    [1],
    [1,1],
    [1,2,1],
    [1,3,3,1],
    [1,4,6,4,1],
    [1,5,10,10,5,1],
    [1,6,15,20,15,6,1],
    [1,7,21,35,35,21,7,1],
    [1,8,28,56,70,56,28,8,1],
];

export function binomial(n: number,k: number): number {
    console.assert(k < n, "binomial: k greater n");
    while(n >= binomials.length) {
        let s = binomials.length;
        let nextRow = [];
        nextRow[0] = 1;
        for(let i=1, prev=s-1; i<s; i++) {
            nextRow[i] = binomials[prev]![i-1]! + binomials[prev]![i]!;
        }
        nextRow[s] = 1;
        binomials.push(nextRow);
    }
    return binomials[n]![k]!;
}