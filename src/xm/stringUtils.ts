/// <reference path="./_ref.d.ts" />

'use strict';

export function padLeftZero(input: number, length = 2): string {
	var r = String(input);
	while (r.length < length) {
		r = '0' + r;
	}
	return r;
}
