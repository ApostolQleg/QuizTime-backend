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

            const accessTime = Date.now();
            const ttl = 60000;

            if (cache.has(key)) {
                const entry = cache.get(key);
                const { data, timestamp } = entry;

                if (accessTime - timestamp <= ttl) {
                    return data;
                }
                cache.delete(key);
            }

            const result = fn(...args);
            cache.set(key, { data: result, timestamp: accessTime });
            return result;
        };
    }
}