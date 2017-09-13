"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

exports.default = {
	validate: validate
};