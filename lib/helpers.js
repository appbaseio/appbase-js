"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.validate = validate;
exports.btoa = btoa;
exports.isAppbase = isAppbase;
exports.uuidv4 = uuidv4;
function validate(object, fields) {
	var invalid = [];
	var empty_for = {
		object: null,
		string: ""
	};

	var keys = Object.keys(fields);

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var key = _step.value;

			var type = fields[key];
			if (_typeof(object[key]) !== type || object[key] === empty_for[type]) {
				invalid.push(key);
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var missing = "";
	for (var i = 0; i < invalid.length; i++) {
		missing += invalid[i] + ", ";
	}
	if (invalid.length > 0) {
		return new Error("fields missing: " + missing);
	}

	return true;
}

function btoa() {
	var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var str = input;
	var output = "";

	for (var block = 0, charCode, i = 0, map = chars; str.charAt(i | 0) || (map = "=", i % 1); output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

		charCode = str.charCodeAt(i += 3 / 4);

		if (charCode > 0xFF) {
			throw new Error("\"btoa\" failed: The string to be encoded contains characters outside of the Latin1 range.");
		}

		block = block << 8 | charCode;
	}

	return output;
}

function isAppbase(client) {
	return contains(client.url, "scalr.api.appbase.io");
}

function contains(string, substring) {
	return string.indexOf(substring) !== -1;
}

function uuidv4() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
		    v = c == "x" ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}