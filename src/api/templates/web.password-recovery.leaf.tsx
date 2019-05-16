import commonStyles from './commonStyles'

export default function webInvitationLeaf(params: any) {
	return /*html*/ `
<!DOCTYPE html>
<!-- web.password-recovery.leaf -->
<html>
	<head>
		<title>#(system.info.name) - Password recovery</title>#// Translate all copy!!!!!
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
			<form method="post" action="#(finish)">
				<p><img src="#(system.info.url)/server/image/256" alt="#(system.info.name)" /></p>
				<h1>Hi #(user.firstname) #(user.lastname)</h1>
				#/*
					#(finish) contains an API link to which you need to send the form data either as JSON data or as a standard webform.
					You can also append a target URL to redirect the user to when done by appending '&target=http://example.com/all_is_dandy'.
					Target is an optional value and if not set a JSON (API) result will be returned.
				*/
				<h2>Please set your new #(system.info.name) password here:</h2>
				<div class="input">
					<label>Password:</label> <input id="password" name="password" type="password" value="" />
				</div>
				<div class="input">
					<label>Password again:</label>
					<input id="verification" name="verification" type="password" value="" />
				</div>
				<div><button type="submit" class="button">Reset password</button></div>
			</form>
		</div>
	</body>
</html>
	`
}
