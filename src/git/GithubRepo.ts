/// <reference path="./_ref.d.ts" />

'use strict';

import path = require('path');

import assertVar = require('../xm/assertVar');
import objectUtils = require('../xm/objectUtils');
import JSONPointer = require('../xm/json/JSONPointer');

import GithubRepoConfig = require('./GithubRepoConfig');
import GithubURLs = require('./GithubURLs');
import GithubAPI = require('./loader/GithubAPI');
import GithubRaw = require('./loader/GithubRaw');

/*
 GithubRepo: basic github repo info
 */
class GithubRepo {

	config: GithubRepoConfig;
	storeDir: string;

	urls: GithubURLs;
	api: GithubAPI;
	raw: GithubRaw;

	constructor(config: GithubRepoConfig, storeDir: string, opts: JSONPointer) {
		assertVar(config, 'object', 'config');
		assertVar(storeDir, 'string', 'storeDir');
		assertVar(opts, JSONPointer, 'opts');

		this.config = config;
		this.urls = new GithubURLs(this);

		this.storeDir = path.join(storeDir.replace(/[\\\/]+$/, ''), this.getCacheKey());

		this.api = new GithubAPI(this.urls, opts.getChild('git/api'), this.storeDir);
		this.raw = new GithubRaw(this.urls, opts.getChild('git/raw'), this.storeDir);
	}

	getCacheKey(): string {
		return this.config.repoOwner + '-' + this.config.repoProject;
	}

	toString(): string {
		return this.config.repoOwner + '/' + this.config.repoProject;
	}

	set verbose(verbose: boolean) {
		this.api.verbose = verbose;
		this.raw.verbose = verbose;
	}
}

export  = GithubRepo;
