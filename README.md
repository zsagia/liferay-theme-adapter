# liferay-theme-adapter

Adapter for programmatically implementing generator-liferay-theme

```
npm install --save liferay-theme-adapter
```

```js
var generator = require('liferay-theme-adapter');

generator(
	{
		cb: function() {
			// when the generator is done, and bower and npm are done installing dependencies
		},
		directory: '/where/theme/is/created',
		generator: 'liferay-theme', // or 'liferay-theme:import'
		promptData: {
			themeId: 'my-theme',
			themeName: 'My Theme',
			supportCompass: false
		}
	}
);
```