export default function emailInvitationPlainLeaf(params: any) {
	return `
Hi #(user.firstname) #(user.lastname)

Please confirm your email #(user.email) by clicking on this link #(link)

Recovery code is: |#(verification)|

#(system.info.name)
<!-- email.password-recovery.plain.leaf -->

`
}
