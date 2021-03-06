/// <reference path="../_ref.d.ts" />

'use strict';

import chai = require('chai');
import assert = chai.assert;

import assertVar = require('../../xm/assertVar');
import AuthorInfo = require('../../xm/data/AuthorInfo');
import helper = require('../../test/helper');

export function serialise(author: AuthorInfo, recursive: number = 0): any {
	assertVar(author, AuthorInfo, 'author');
	return author.toJSON();
}

export function assertion(author: AuthorInfo, values: any, message: string) {
	assert.ok(author, message + ': author');
	assert.ok(values, message + ': values');
	assert.instanceOf(author, AuthorInfo, message + ': author');

	helper.propStrictEqual(author, values, 'name', message);
	helper.propStrictEqual(author, values, 'url', message);
	helper.propStrictEqual(author, values, 'email', message);
}
