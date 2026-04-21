export default class Memoizer {
	constructor() {
		this.cache = new WeakMap();
	}

	memoize(fn, ttl = 30000, capacity = 5) {
		const that = this;

		return function (...args) {
			const key = JSON.stringify(args);
			let cache = that.cache.get(fn);

			if (!cache) {
				cache = new Map();
				that.cache.set(fn, cache);
			}

			const accessTime = Date.now();

			if (cache.has(key)) {
				const entry = cache.get(key);
				const { data, timestamp } = entry;

				if (accessTime - timestamp <= ttl) {
					cache.delete(key);
					cache.set(key, entry);
					return data;
				}
				cache.delete(key);
			}

			const result = fn.apply(this, args);
			if (cache.size >= capacity) {
				const oldestKey = cache.keys().next().value;
				cache.delete(oldestKey);
			}
			cache.set(key, { data: result, timestamp: accessTime });
			return result;
		};
	}
	clear(fn, ...args) {
		const cache = this.cache.get(fn);
		if (!cache) {
			return;
		}

		if (args.length === 0) {
			cache.clear();
			return;
		}

		const key = JSON.stringify(args);
		cache.delete(key);
	}
}
