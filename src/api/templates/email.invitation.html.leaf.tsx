import htmlEmailLayout from './parts/htmlEmailLayout'
import htmlEmailButton from './parts/htmlEmailButton'

export default function emailInvitationHtmlLeaf(params: any) {
	const content = /*html*/ `
<p style="font-size:1.25em;font-weight:bold">Hi #(user.firstname) #(user.lastname)</p>
<p>
	You have been invited to one of our teams by #(sender.firstname) #(sender.lastname) (#(sender.email)).<br />
	You can confirm your registration now by clicking on this button.
</p>
${htmlEmailButton({ label: 'Confirm your registration', href: '#(link)', center: true }, params)}
`

	return htmlEmailLayout(
		{
			content,
			footer: '#(system.info.name)',
			center: true,
		},
		params
	)
}
