import commonStyles from './commonStyles'

export default function webInfoMessageLeaf(params: any) {
	return /*html*/ `
<!DOCTYPE html>
<!-- web.info-message.leaf -->
<html>
	<head>
		<title>#(system.info.name) - #(title)</title>#// Translate all copy!!!!!
		${commonStyles(params)}
		<style>
		</style>
		<script type="text/javascript">
			window.onload = function () {
				var input = document.getElementById('password');
				input.focus();
				input.select();
			}
		</script>
	</head>
	<body>
		<div class="container">
			<p><img src="#(system.info.url)/server/image/256" alt="#(system.info.name)" /></p>
			<h1>#(title)</h1>
			<p>#(text)</p>
			#if(action) {
			<p>
				<a href="#(action.link)" title="#(action.title)" class="button">#(action.text)</a>
			</p>
			}
		</div>
	</body>
</html>
	`
}
