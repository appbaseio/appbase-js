export function validate(object,fields) {
	const invalid = [];
	const empty_for = {
		object: null,
		string: ""
	};

	const keys = Object.keys(fields);

	for (const key of keys) {
		const type = fields[key];
		if (typeof object[key] !== type || object[key] === empty_for[type]) {
			invalid.push(key);
		}
	}

	let missing = "";
	for (let i = 0; i < invalid.length; i++) {
		missing += `${invalid[i]}, `;
	}
	if (invalid.length > 0) {
		return new Error(`fields missing: ${missing}`);
	}

	return true;
}

export function btoa(input = "") {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	let str = input;
	let output = "";

	for (let block = 0, charCode, i = 0, map = chars;
		str.charAt(i | 0) || (map = "=", i % 1);
		output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

		charCode = str.charCodeAt(i += 3/4);

		if (charCode > 0xFF) {
			throw new Error("\"btoa\" failed: The string to be encoded contains characters outside of the Latin1 range.");
		}

		block = block << 8 | charCode;
	}

	return output;
}

export function isAppbase(client) {
	return contains(client.url, "scalr.api.appbase.io");
}

function contains(string, substring) {
	return string.indexOf(substring) !== -1;
}
