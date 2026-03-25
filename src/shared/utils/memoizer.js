export default class Memoizer {
    constructor() {
        this.cache = new WeakMap();
    }

    memoize(fn) {
        return (...args) => {
            const key = JSON.stringify(args);
            let cache = this.cache.get(fn);

            if (!cache) {
                cache = new Map();
                this.cache.set(fn, cache);
            }

            if (cache.has(key)) {
                return cache.get(key).data;
            }

            const result = fn(...args);
            cache.set(key, { data: result });
            return result;
        };
    }
}