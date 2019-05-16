export default function emailInvitationHtmlLeaf(params: any) {
	return /*html*/ `
<!-- email.password-recovery.html.leaf -->
<style>
	* {
		font-family: sans-serif;
	}
</style>
<h1>Hi #(user.firstname) #(user.lastname)</h1>
<p>&nbsp;</p>
<p>Please confirm your email #(user.email) by clicking on this <a href="#(link)">link</a></p>
<p>&nbsp;</p>
<p>Recovery code is: <strong>#(verification)</strong></p>
<p>&nbsp;</p>
<p>#(system.info.name)</p>
`
}
