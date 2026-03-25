export default class Memoizer {
    constructor() {
        this.cache = new WeakMap();
    }

    memoize(fn, ttl = 30000, capacity = 5) {
        return (...args) => {
            const key = JSON.stringify(args);
            let cache = this.cache.get(fn);

            if (!cache) {
                cache = new Map();
                this.cache.set(fn, cache);
            }

            const accessTime = Date.now();

            if (cache.has(key)) {
                const entry = cache.get(key);
                const { data, timestamp } = entry;

                if (accessTime - timestamp <= ttl) {
                    return data;
                }
                cache.delete(key);
            }

            const result = fn(...args);
            if (cache.size >= capacity) {
                const oldestKey = cache.keys().next().value;
                cache.delete(oldestKey);
            }
            cache.set(key, { data: result, timestamp: accessTime });
            return result;
        };
    }
}