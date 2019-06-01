import React, { ReactNode, MouseEvent } from 'react'
import cn from 'classnames'
import { Formik, Form as FormikForm, Field, FieldProps, FormikProps, FormikActions } from 'formik'

import * as Yup from 'yup'

import './Form.sass'
import memoize from 'lodash-es/memoize'

export class FormError extends Error {
	toString() {
		return 'FormError: ' + this.message
	}
}

export interface FormFieldComponentProps extends FieldProps {
	className?: any
}

export interface FormControl {
	name: string
	className?: any
	label?: ReactNode
	note?: ReactNode
	tip?: ReactNode
	required?: boolean | ReactNode
	placeholder?: string
	rules?: Yup.MixedSchema
	type?: 'password' | 'text' | 'email' | 'color' | string
	component?: 'input' | 'select' | 'textarea' | React.ComponentType<FormFieldComponentProps>
	render?: (props: FieldProps) => React.ReactNode
}

export enum FormActionView {
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
	DANGER = 'danger',
	LINK = 'link',
}

export interface FormAction {
	name: string
	className?: any
	label?: ReactNode
	view?: FormActionView
	onClick?: (e: MouseEvent, form: Form) => void
}

export type ValuesObject = { [key: string]: any }

type ValidationSchema = Yup.ObjectSchema<Yup.Shape<object, { [key: string]: any }>>

export interface FormProps {
	debug?: boolean
	className?: any
	controls: FormControl[]
	submitLabel?: ReactNode
	isWorking?: boolean
	actions?: FormAction[]
	leftActions?: FormAction[]
	validationSchema?: ValidationSchema
	initialValues?: { [key: string]: any }
	onSubmit?: (values: ValuesObject, action: string, form: Form) => void
	renderControls?: (
		controls: FormControl[],
		formik: FormikProps<any>,
		form: Form
	) => React.ReactNode
	errors?: { message: ReactNode }[]
}

function createRequiredValueErrorMessage(control: FormControl) {
	let str = 'This field is required.'

	if (control.label && typeof control.label === 'string') {
		return `Please fill in a value for ${control.label}.`
	}

	return str
}

function reduceControlsToYup(shape: { [key: string]: any }, control: FormControl) {
	if (shape[control.name]) {
		throw new Error(`Duplicate control name for name ${control.name}`)
	}

	if (control.required || control.rules) {
		shape[control.name] = control.rules || Yup.mixed()
		if (control.required) {
			shape[control.name] = shape[control.name].required(
				React.isValidElement(control.required)
					? control.required
					: createRequiredValueErrorMessage(control)
			)
		}
	}

	return shape
}

export function exportValidationSchema(controls: FormControl[]): ValidationSchema {
	return Yup.object().shape(controls.reduce(reduceControlsToYup, {}))
}

export default class Form extends React.PureComponent<FormProps> {
	getDefaultPrimaryAction = () =>
		({
			name: 'send',
			label: this.props.submitLabel || 'Send',
			view: FormActionView.PRIMARY,
		} as FormAction)

	submitAction: string = 'send'

	renderFields = (formik: FormikProps<any>) => {
		const { className, isWorking, controls } = this.props
		const { isValid, isSubmitting, isValidating } = formik

		return (
			<FormikForm
				className={cn(
					'Form',
					className,
					`view-is${isWorking ? '' : 'Not'}Working`,
					`view-is${isValid ? '' : 'Not'}Valid`,
					`view-is${isSubmitting ? '' : 'Not'}Submitting`,
					`view-is${isValidating ? '' : 'Not'}Validating`
				)}
			>
				{this.props.errors && this.renderErrors(this.props.errors)}
				<fieldset className="Form-fieldset Form-container" disabled={isWorking}>
					<fieldset className="Form-fieldset">
						<div className="Form-controlGroup">
							{this.props.renderControls
								? this.props.renderControls(controls, formik, this)
								: controls.map(this.renderField(formik))}
						</div>
					</fieldset>

					<fieldset className="Form-fieldset">
						<div className="Form-actions">
							<div className="Form-actions-group view-left">{this.renderLeftActions()}</div>
							<div className="Form-actions-group view-right">{this.renderPrimaryActions()}</div>
						</div>
					</fieldset>
				</fieldset>
				{this.props.debug && <pre>{JSON.stringify(formik, null, 2)}</pre>}
			</FormikForm>
		)
	}

	renderLeftActions = () => {
		return this.renderActions(this.props.leftActions)
	}

	getPrimaryActions = () => {
		if (this.props.actions && this.props.actions.length) {
			return this.props.actions
		}
		return [this.getDefaultPrimaryAction()]
	}

	renderPrimaryActions = () => {
		return this.renderActions(this.getPrimaryActions())
	}

	createActionHandler = memoize((action) => {
		const { name, onClick } = action
		return (e: MouseEvent) => {
			this.submitAction = name
			if (onClick) {
				onClick(e, this)
			}
		}
	})

	renderAction = (action: FormAction) => {
		return (
			<button
				key={action.name}
				type="submit"
				name={action.name}
				className={cn(
					'Form-button',
					`view-${action.view || FormActionView.SECONDARY}`,
					this.submitAction === action.name && this.props.isWorking && `view-isWorking`,
					action.className
				)}
				onClick={this.createActionHandler(action)}
			>
				{action.label || action.name || 'Send'}
			</button>
		)
	}

	renderActions = (actions: FormAction[] | void) => {
		if (actions) {
			return actions.map(this.renderAction)
		}
		return null
	}

	renderErrors = (errors: { message: ReactNode }[]) => {
		return (
			<ul className="Form-errors">
				{errors.map((error) => (
					<li className="Form-errors-item">{this.renderFormError(error.message)}</li>
				))}
			</ul>
		)
	}

	renderFormError(message: ReactNode) {
		return <div className="Form-error">{message}</div>
	}

	renderField = (formik: FormikProps<any>) => (control: FormControl, i: number) => {
		const { name, className, label, required, type, tip, note, component, render } = control
		const error = formik.errors[name]
		const touched = formik.touched[name]
		const { submitCount } = formik
		const hasVisibleError = (touched || submitCount > 0) && error

		return (
			<div
				key={name}
				className={cn(
					'Form-control',
					required ? 'view-isRequired' : 'view-isNotRequired',
					hasVisibleError && 'view-isInvalid'
				)}
			>
				<label className="Form-control-label">
					<span className="Form-control-name">{label || name}</span>{' '}
					{tip && <span className="Form-control-tip">{tip}</span>}
				</label>
				<Field
					name={name}
					className={cn('Form-control-input', 'view-basic', className)}
					type={type || 'text'}
					component={component}
					render={render}
				/>

				{hasVisibleError && this.renderFormError(error)}

				{note && <div className="Form-control-note">{note}</div>}
			</div>
		)
	}

	handleSubmit = (values: any, actions: FormikActions<any>) => {
		if (this.props.onSubmit) {
			this.props.onSubmit(values, this.submitAction, this)
		}
	}

	render() {
		const { validationSchema } = this.props
		return (
			<Formik
				initialValues={this.props.initialValues || {}}
				validationSchema={validationSchema}
				onSubmit={this.handleSubmit}
				render={this.renderFields}
			/>
		)
	}
}
