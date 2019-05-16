import htmlEmailLayout from './parts/htmlEmailLayout'
import htmlEmailButton from './parts/htmlEmailButton'

export default function emailInvitationHtmlLeaf(params: any) {
	const content = /*html*/ `
<p>Hi #(user.firstname) #(user.lastname)</p>
<p>Please confirm your email #(user.email) by clicking on this button./p>
${htmlEmailButton({ label: 'Confirm your email', href: '#(link)', center: true }, params)}
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
