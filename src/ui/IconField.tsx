import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import Squircle from './Squircle'
import './IconField.sass'

export default function IconField({
	oldValue,
	newValue,
	placeholder,
	color,
	onClickOld,
	onClickNew,
	radius,
}: any) {
	const [memNewValue, setMemNewValue] = useState(newValue)

	useEffect(() => {
		if (newValue) {
			setMemNewValue(newValue)
		}
	}, [newValue])

	return (
		<div className={cn('IconField', newValue && 'view-hasNewValue')}>
			<div className="IconField-in">
				<div className="IconField-image view-old" onClick={onClickOld}>
					<Squircle radius={radius} src={oldValue} placeholder={placeholder} color={color} />
				</div>
				<div className="IconField-image view-new" onClick={onClickNew}>
					<Squircle
						radius={radius}
						src={newValue || memNewValue}
						placeholder={placeholder}
						color={color}
					/>
				</div>
			</div>
		</div>
	)
}
