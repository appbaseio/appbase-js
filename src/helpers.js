export default function validate(object,fields) {
	const invalid = [];
	const empty_for = {
		object: null,
		string: ""
	};

	const keys = Object.keys(fields);

	for(const key of keys) {
		const type = fields[key];
		if(typeof object[key] !== type || object[key] === empty_for[type]) {
			invalid.push(key);
		}
	}

	let missing = "";
	for(let i = 0; i < invalid.length; i++) {
		missing += `${invalid[i]}, `;
	}
	if(invalid.length > 0) {
		return new Error(`fields missing: ${missing}`);
	}

	return true;
}
