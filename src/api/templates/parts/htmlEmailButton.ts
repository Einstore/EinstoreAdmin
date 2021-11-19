export default function htmlEmailButton(blocks: { label: string; href: string; center?: boolean }, params: any) {
	const { label, href } = blocks
	const center = blocks.center
	const styles = {
		btnBgColor: params.settings.style_primary_action_background_color || '#236aea',
		btnTextColor: params.settings.style_primary_action_color || '#fff',
	}
	return /*html*/ `
<table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
	<tbody>
		<tr>
			<td align="left" style="font-family: sans-serif; font-size: 13px; vertical-align: top; padding-bottom: 15px;">
				<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto; margin: ${
					center ? '0 auto' : '0'
				}">
					<tbody>
						<tr>
							<td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: ${
								styles.btnBgColor
							}; border-radius: 4px; text-align: center;"> <a href="${href}" target="_blank" style="display: inline-block; color: ${
		styles.btnTextColor
	}; background-color: ${styles.btnBgColor}; border: solid 1px ${
		styles.btnBgColor
	}; border-radius: 4px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 13px; font-weight: bold; margin: 0; padding: 10px 15px; border-color: ${
		styles.btnBgColor
	};">${label}</a> </td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
	</tbody>
</table>
`
}
