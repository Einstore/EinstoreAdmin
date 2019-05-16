function getStyleVars(settings: any) {
	console.log('getStyleVars', { settings })
	if (settings) {
		let rows = [
			'--style-primary-action-background-color: #236aea;',
			'--style-primary-action-color: #fff;',
		]
		const keys = Object.keys(settings)
		for (let key of keys) {
			if (settings[key] !== 'color') {
				rows.push(`--${key.split('_').join('-')}: ${settings[key]};`)
			}
		}
		return rows.join('\n')
	}
	return ''
}

export default function commonStyles(params?: any) {
	return /*html*/ `
<style>
	body {
		${getStyleVars(params.settings)}
		font-family: sans-serif;
	}
	* {
		box-sizing: border-box;
	}
	html {
		font-family: Helvetica, Arial, sans-serif;
	}
	html, body {
		margin: 0;
		background: #e0e0e8;
	}
	.container {
		max-width: 400px;
		margin: 0 auto;
		padding: 2em;
		text-align: center;
	}
	img {
		width: 98px;
		border-radius: 5px;
	}
	h1 {
		font-size: large;
		color: var(--style-primary-action-background-color);
	}
	h2 {
		font-size: medium;
		color: var(--style-primary-action-background-color);
	}
	label {
		margin: .5em .25em;
		font-size: .7em;
	}
	.input {
		margin: .5em 0;
		text-align: left;
	}
	input {
		text-align: left;
		display: block;
		width: 100%;
		background-color: #fff;
		border: 1px solid #b3b3b3;
		border-radius: 4px;
		padding: 10px;
		margin: 16px 0;
		color: #364041;
	}
	input[disabled] {
		background-color: #F6F6F6;
		opacity: .8;
	}
	.button {
		text-rendering: auto;
		letter-spacing: normal;
		word-spacing: normal;
		text-transform: none;
		text-indent: 0px;
		text-shadow: none;
		appearance: none;
		font-size: 13px;
		background-color: #236aea;
		background-color: var(--style-primary-action-background-color);
		color: #fff;
		color: var(--style-primary-action-color);
		border: 1px solid #ddddde;
		border-radius: 4px;
		padding: 10px 15px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		-webkit-transition: background .2s;
		transition: background .2s;
		white-space: nowrap;
		text-decoration: none;
		outline: none;
	}
</style>
	`
}
