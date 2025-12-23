export function repeat<T>(fn: (idx: number) => T, end: number): Iterable<T>;
export function repeat<T>(fn: (idx: number) => T, start: number, end?: number, step?: number): Iterable<T>;
export function repeat<T>(fn: (idx: number) => T, start: number, end?: number, step?: number): Iterable<T> {
    return {
        [Symbol.iterator]: function* () {
            if(step === undefined) step = 1;

            if (end === undefined) {
                end = start;
                start = 0;
            }
            if (step > 0) {
                for (let i = start; i < end; i += step) {
                    yield fn(i);
                }
            } else if (step < 0) {
                for (let i = start; i > end; i += step) {
                    yield fn(i);
                }
            }
        }
    }
}

export function repeat_v<T>(value: T, count: number): Iterable<T> {
    return {
        [Symbol.iterator]: function* () {
            for(let i = 0; i < count; i++) {
                yield value;
            }
        }
    }
}

export function* map<Input, Result>(data: Iterable<Input>, fn: (item: Input) => Result) {
    for(const el of data) {
        yield fn(el);
    }
}