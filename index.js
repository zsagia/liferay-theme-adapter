var _ = require('lodash');
var chalk = require('chalk');
var Environment = require('yeoman-environment');
var path = require('path');
var TerminalAdapter = require('./node_modules/yeoman-environment/lib/adapter');

var generatorLiferayTheme = path.resolve('./node_modules/generator-liferay-theme');

var liferayThemeAdapter = function(data) {
	this.data = data;
};

liferayThemeAdapter.prototype = _.merge(
	TerminalAdapter.prototype,
	{
		prompt: function(prompts, callback) {
			callback(this.data);
		}
	}
);

var runGenerator = function(generator, path, data) {
	var env = Environment.createEnv(null, null, new liferayThemeAdapter(data));

	env.register(generatorLiferayTheme);

	try {
		process.chdir(path);

		env.run(generator);
	}
	catch (err) {
		console.log(chalk.red(path + ': does not exist! Please choose a valid directory.'));

		console.log(err.stack);
	}
};

module.exports = runGenerator;