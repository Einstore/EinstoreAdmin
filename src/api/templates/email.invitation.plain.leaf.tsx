export default function emailInvitationPlainLeaf(params: any) {
	return `
Hi #(user.firstname) #(user.lastname)

You have been invited to one of our teams by #(sender.firstname) #(sender.lastname) (#(sender.email)).
You can confirm your registration now by clicking on this link #(link)

Verification code is: |#(verification)|

#(system.info.name)
<!-- email.invitation.plain.leaf -->

`
}
