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

var runGenerator = function(generator, directory, data, done) {
	var env = Environment.createEnv(null, null, new liferayThemeAdapter(data));

	env.register(generatorLiferayTheme);

	try {
		process.chdir(directory);

		env.run(
			generator,
			{
				'skip-install': true
			},
			done
		);
	}
	catch (err) {
		console.log(chalk.red(directory + ': does not exist! Please choose a valid directory.'));

		console.log(err.stack);
	}
};

module.exports = runGenerator;