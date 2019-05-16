import commonStyles from './commonStyles'

export default function webInvitationLeaf(params: any) {
	return /*html*/ `
<!DOCTYPE html>
<!-- web.invitation.leaf -->
<html>
	<head>
		<title>#(system.info.name) - Accept invitation</title>#// Translate all copy!!!!!
		${commonStyles(params)}
		<style>

		</style>
		<script type="text/javascript">
			window.onload = function () {
				var input = document.getElementById('username');
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
				<h2>Please finish your #(system.info.name) registration here:</h2>
				<div class="input">
					<label>Email:</label> <input id="email" name="email" type="email" value="#(user.email)" disabled />
				</div>
				<div class="input">
					<label>Username:</label> <input id="username" name="username" type="text" value="#(user.username)" />
				</div>
				<div class="input">
					<label>Firstname:</label> <input id="firstname" name="firstname" type="text" value="#(user.firstname)" />
				</div>
				<div class="input">
					<label>Lastname:</label> <input id="lastname" name="lastname" type="text" value="#(user.lastname)" />
				</div>
				<!-- TODO: Check password is valid against the validation endpoint + check the verification password matches it -->
				<div class="input">
					<label>Password:</label> <input id="password" name="password" type="password" value="" />
				</div>
				<div class="input">
					<label>Password again:</label> <input id="verification" name="verification" type="password" value="" />
				</div>
				<div><button type="submit" class="button">Save</button></div>
			</form>
		</div>
	</body>
</html>
	`
}
