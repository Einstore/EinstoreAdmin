const availableTemplates = [
	{ name: 'email.invitation.html', render: require('./email.invitation.html.leaf.tsx').default },
	{ name: 'email.invitation.plain', render: require('./email.invitation.plain.leaf.tsx').default },
	{ name: 'web.invitation', render: require('./web.invitation.leaf.tsx').default },

	{
		name: 'email.password-recovery.html',
		render: require('./email.password-recovery.html.leaf.tsx').default,
	},
	{
		name: 'email.password-recovery.plain',
		render: require('./email.password-recovery.plain.leaf.tsx').default,
	},
	{ name: 'web.password-recovery', render: require('./web.password-recovery.leaf.tsx').default },

	{ name: 'web.info-message', render: require('./web.info-message.leaf.tsx').default },
]

export default availableTemplates
