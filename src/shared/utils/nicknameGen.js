const adjectives = ["Swift", "Brave", "Clever", "Mighty", "Sly", "Noble", "Fierce", "Gentle"];
const nouns = ["Lion", "Eagle", "Shark", "Wolf", "Panther", "Falcon", "Tiger", "Bear"];
const easterNouns = ["Penis", "Dildo", "Cunt", "Mommy", "Daddy", "Boobs", "Apostol", "Dick"];

export function* generateNickname() {
	while (true) {
		const id = Math.floor(Math.random() * 9999);
		let noun;
		if (id <= 100 || id >= 9900) {
			noun = easterNouns[Math.floor(Math.random() * easterNouns.length)];
		} else {
			noun = nouns[Math.floor(Math.random() * nouns.length)];
		}
		const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
		const nickname = `${adjective}${noun}#${id}`;
		yield nickname;
	}
}
