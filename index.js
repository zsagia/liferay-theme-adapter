var _ = require('lodash');
var TerminalAdapter = require('./node_modules/yeoman-environment/lib/adapter');
var Environment = require('yeoman-environment');

var liferayThemeAdapter = function() {};

liferayThemeAdapter.prototype = _.merge(
	TerminalAdapter.prototype,
	{
		prompt: function(prompts, callback) {
			callback(
				{
					supportCompass: false,
					themeId: 'test',
					themeName: 'Test Theme'
				}
			);
		}
	}
);

var env = Environment.createEnv(null, null, new liferayThemeAdapter());

env.register('./node_modules/generator-liferay-theme');

env.run('liferay-theme');