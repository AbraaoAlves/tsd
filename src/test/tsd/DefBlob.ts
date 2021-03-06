/// <reference path="../_ref.d.ts" />

'use strict';

import chai = require('chai');
import assert = chai.assert;

import assertVar = require('../../xm/assertVar');
import DefBlob = require('../../tsd/data/DefBlob');

import helper = require('../helper');

export function serialise(blob: DefBlob, recursive: number = 0): any {
	assertVar(blob, DefBlob, 'blob');
	recursive -= 1;

	var json: any = {};
	json.sha = blob.sha;
	if (blob.content && recursive >= 0) {
		json.content = blob.content.toString('base64');
	}
	return json;
}

export function assertion(blob: DefBlob, values: any, message: string) {
	assert.ok(blob, message + ': blob');
	assert.ok(values, message + ': values');
	assert.instanceOf(blob, DefBlob, message + ': author');

	helper.propStrictEqual(blob, values, 'sha', message);

	if (values.lines) {
		assert.strictEqual(blob.content.toString('base64'), values.lines, message + ': content');
	}
}
