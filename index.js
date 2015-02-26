var _ = require('lodash');
var chalk = require('chalk');
var Environment = require('yeoman-environment');
var path = require('path');
var spawn = require('child_process').spawn
var TerminalAdapter = require('./node_modules/yeoman-environment/lib/adapter');

var generatorLiferayTheme = path.resolve('./node_modules/generator-liferay-theme');

function installDependencies(done) {
	var bowerInstall = spawnInstallCommand('bower');
	var npmInstall = spawnInstallCommand('npm');

	onProcessClose([bowerInstall, npmInstall], done);
}

function onProcessClose(commands, done) {
	var closed = 0;

	_.forEach(
		commands,
		function(item, index) {
			item.on(
				'close',
				function (code) {
					closed++;

					if (closed >= commands.length) {
						console.log('child process exited with code ' + code);

						done();
					}
				}
			);
		}
	);
}

function spawnInstallCommand(command) {
	var command = spawn(command, ['install'], {});

	command.stdout.on(
		'data',
		function (data) {
			console.log(data + '');
		}
	);

	command.stderr.on(
		'data',
		function (data) {
			console.log(data + '');
		}
	);

	return command;
}

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
			function() {
				installDependencies(done);
			}
		);
	}
	catch (err) {
		console.log(chalk.red(directory + ': does not exist! Please choose a valid directory.'));

		console.log(err.stack);
	}
};

module.exports = runGenerator;