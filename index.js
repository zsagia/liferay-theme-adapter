var _ = require('lodash');
var chalk = require('chalk');
var Environment = require('yeoman-environment');
var path = require('path');
var spawn = require('child_process').spawn
var TerminalAdapter = require('./node_modules/yeoman-environment/lib/adapter');

var generatorLiferayTheme = path.join(__dirname, 'node_modules/generator-liferay-theme');

function installDependencies(cb) {
	var bowerInstall = spawnInstallCommand('bower');
	var npmInstall = spawnInstallCommand('npm');

	onProcessClose([bowerInstall, npmInstall], cb);
}

function onProcessClose(commands, cb) {
	var closed = 0;

	_.forEach(
		commands,
		function(item, index) {
			item.on(
				'close',
				function (code) {
					closed++;

					if (closed >= commands.length) {
						if (cb) {
							cb();
						}
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

var runGenerator = function(config) {
	var directory = config.directory;

	var env = Environment.createEnv(null, null, new liferayThemeAdapter(config.promptData));

	env.register(generatorLiferayTheme);

	try {
		process.chdir(directory);

		env.run(
			config.generator,
			{
				'skip-install': true
			},
			function() {
				installDependencies(config.cb);
			}
		);
	}
	catch (err) {
		console.log(chalk.red(directory + ': does not exist! Please choose a valid directory.'));

		console.log(err.stack);
	}
};

module.exports = runGenerator;