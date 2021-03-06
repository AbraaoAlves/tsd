/*jshint -W098 */

module.exports = function (grunt) {
	'use strict';

	var path = require('path');
	var util = require('util');

	var isTravis = (process.env.TRAVIS === 'true');
	var isVagrant = (process.env.PWD === '/vagrant');
	if (isVagrant) {
		grunt.log.writeln('-> ' + 'vagrant detected'.cyan);
	}
	var cpuCores = require('os').cpus().length;
	//grunt.log.writeln(util.inspect(process.env));

	var gtx = require('gruntfile-gtx').wrap(grunt);
	gtx.loadAuto();
	gtx.loadNpm([
		'mocha-unfunk-reporter'
	]);

	//defaults and one-off tasks
	gtx.config({
		pkg: gtx.readJSON('package.json'),
		jshint: {
			options: gtx.readJSON('.jshintrc', {
				reporter: './node_modules/jshint-path-reporter'
			}),
			support: ['Gruntfile.js', 'test/*.js', 'lib/**/*.js'],
			fixtures: ['test/**/fixtures/**/*.js']
		},
		tslint: {
			options: {
				configuration: gtx.readJSON('tslint.json'),
				formatter: 'tslint-path-formatter'
			},
			source: ['src/**/*.ts', '!src/test', '!src/spec'],
			helper: ['test/*.ts'],
			testing: [
				'src/test/**/*.ts',
				'src/spec/**/*.ts'
			]
		},
		todos: {
			options: {
				reporter: 'path',
				verbose: false,
				priorities: {
					low: /(NOTE|TODO)/,
					med: /(FIXME)/,
					high: /(BROKEN)/
				}
			},
			all: {
				options: {},
				src: ['src/**/*.ts', 'test/**/src/**/*.ts']
			}
		},
		clean: {
			tmp: ['tmp/**/*', 'test/tmp/**/*'],
			dump: ['test/modules/**/dump'],
			test: ['test/*/spec/build/**/*'],
			build: ['build/**', 'build/**/*.js', 'build/**/*.d.ts', 'build/**/*.js.map']
		},
		copy: {
			cli: {
				files: [
				// includes files within path
					{expand: true, cwd: 'src', src: ['cli.js', '.gitattributes'], dest: 'build', filter: 'isFile'}
				]
			}
		},
		'regex-replace': {
			cli: {
				src: ['build/cli.js'],
				actions: [
					{
						name: 'eol',
						search: '\\r\\n',
						replace: '\n',
						flags: 'g'
					}
				]
			},
			build: {
				src: ['build/**/*.js'],
				actions: [
					{
						name: 'map',
						search: '\r?\n?\\\/\\\/# sourceMappingURL=.*',
						replace: '',
						flags: 'g'
					}
				]
			}
		},
		tv4: {
			packjson: {
				options: {
					root: function() {
						return require('package.json-schema').get();
					}
				},
				src: ['package.json']
			},
			tsd: {
				options: {
					multi: true,
					root: 'schema/tsd-v4.json'
				},
				src: ['tsd.json']
			},
			schemas: {
				options: {
					multi: true,
					root: 'http://json-schema.org/draft-04/schema#'
				},
				src: ['schema/*.json']
			}
		},
		mochaTest: {
			options: {
				reporter: 'mocha-unfunk-reporter',
				timeout: 3000
			},
			integrity: ['test/integrity.js'],
			// some extra js tests
			spec: ['test/spec/*.js']
		},
		typson: {
			options: {

			},
			http: {
				src: [
					'./src/http/types.ts'
				]
			}
		},
		mocha_unfunk: {
			dev: {
				options: {
					reportPending: true,
					stackFilter: true
				}
			}
		},
		ts_clean: {
			build: {
				src: ['build/**/*'],
				dot: true
			}
		},
		ts: {
			options: {
				module: 'commonjs',
				fast: 'never',
				target: 'es5',
				declaration: true,
				sourcemap: true,
				noImplicitAny: false
			},
			api: {
				src: ['src/**/*.ts', '!src/test/**/*.ts', '!src/spec/**/*.ts', '!src/**/_ref.d.ts'],
				outDir: 'build/'
			},
			test: {
				src: ['src/test.ts'],
				outDir: 'build/'
			},
			/*blobSha: {
				src: ['src/util/blobSha.ts'],
				out: 'util/blobSha.js'
			},*/
			/*capture_task: {
				src: ['tasks/capture_cli.ts'],
				out: 'tasks/capture_cli.js'
			},*/
			//use this non-checked-in file to test small snippets of dev code
			dev: {
				src: ['src/dev.ts'],
				out: 'tmp/dev.js'
			},
			scratch: {
				options: {
					baseDir: './src'
				},
				src: ['src/dt/dt.ts'],
				outDir: 'tmp/'
			}
		},
		shell: {
			options: {
				failOnError: true,
				stdout: true
			},
			demo_help: {
				command: [
					'node', './build/cli.js',
					'-h',
					'--capture',
					'--style', 'ansi'
				].join(' '),
				options: {
				}
			},
			demo_html: {
				command: [
					'node', './build/cli.js',
					'-h',
					'--style', 'html'
				].join(' '),
				options: {
				}
			},
			scratch: {
				command: [
					'node', './tmp/dt/dt',
					'--stack'
				].join(' '),
				options: {
				}
			}
		}
	});

	// module tester macro
	gtx.define('moduleTest', function (macro, id) {
		var srcPath = 'src/spec/' + id + '/';

		var basePath = 'test/spec/' + id + '/';
		var tmpPath = basePath + 'tmp/';
		var outPath = basePath + 'build/';

		macro.add('clean', [tmpPath, outPath]);
		macro.add('ts', {
			options: {
				module: 'commonjs',
				target: 'es5',
				declaration: false,
				sourcemap: true,
				noImplicitAny: false
			},
			src: [srcPath + '**/*.ts'],
			outDir: outPath
		});
		macro.add('tslint', {
			src: [srcPath + '** /*.ts']
		});
		if (macro.getParam('http', 0) > 0) {
			macro.add('connect', {
				options: {
					port: macro.getParam('http'),
					base: basePath + 'www/'
				}
			});
		}
		macro.run('mocha_unfunk:dev');
		macro.add('mochaTest', {
			options: {
				timeout: macro.getParam('timeout', 3000)
			},
			src: [outPath + 'spec/**/*.js']
		});
		macro.tag('module');

		//TODO implement new gruntfile-gtx once() feature (run-once dependencies, like tslint:source or tslint:helper)
	}, {
		concurrent: 1 //cpuCores
	});

	var longTimer = (isVagrant ? 250000 : 10000);

	// modules
	gtx.create('xm', 'moduleTest', null, 'lib');
	gtx.create('git', 'moduleTest', {timeout: longTimer}, 'lib');
	gtx.create('tsd', 'moduleTest', {timeout: longTimer}, 'lib,core');
	gtx.create('core,api,cli', 'moduleTest', {timeout: longTimer}, 'core');
	gtx.create('http', 'moduleTest', {
		timeout: longTimer,
		http: 9090
	}, 'lib');

	gtx.alias('pre_publish', [
		/*'tv4:schemas',*/
		'tv4:tsd',
		'tv4:packjson',
		'rebuild',
		'regex-replace:build',
		'regex-replace:cli',
		'ts_clean:build',
		// 'gtx:cli',
		// 'gtx:api',
		'mochaTest:integrity',
		'demo:help'
	]);

	// assemble!
	gtx.alias('prep', [
		'clean:tmp',
		'clean:test',
		'jshint:support',
		'jshint:fixtures',
		'mocha_unfunk:dev'
	]);
	gtx.alias('rebuild', [
		'clean:build',
		'prep',
		'ts:api',
		'copy:cli',
		'regex-replace:cli',
		'tslint:source',
		// 'export_declaration:api'
	]);
	gtx.alias('build', [
		'rebuild'
	]);
	gtx.alias('test', [
		'build',
		'tslint:testing',
		'gtx-type:moduleTest',
		'mochaTest:spec'
	]);
	gtx.alias('default', [
		'test'
	]);
	gtx.alias('demo:help', [
		'shell:demo_help'
	]);

	gtx.alias('dev', [
		'clean:build',
		'prep',
		'typson:http',
		//'ts:scratch',
		//'shell:scratch'
	]);

	gtx.alias('specjs', ['mochaTest:spec']);
	gtx.alias('scratch', ['clean:tmp', 'ts:scratch']);

	gtx.alias('debugger', ['gtx:api']);

	// additional editor toolbar mappings
	gtx.alias('edit_01', 'gtx:tsd');
	gtx.alias('edit_02', 'gtx:api');
	gtx.alias('edit_03', 'build', 'gtx:cli');
	gtx.alias('edit_04', 'gtx:core');
	gtx.alias('edit_05', 'gtx:git');
	gtx.alias('edit_06', 'gtx:xm');
	gtx.alias('edit_07', 'gtx:http');
	gtx.alias('edit_08', 'scratch');

	// build and send to grunt.initConfig();
	gtx.finalise();
};
