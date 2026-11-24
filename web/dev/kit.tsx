// Stand-ins for the host's web kit, for the local preview and the UI tests only. They follow the
// kit's props (web/types/oriso-web-kit.d.ts); in ORISO the host's real components are used.
import { useId, type CSSProperties, type ReactNode } from 'react';
import type {
	KitButtonProps,
	KitCardProps,
	KitCheckboxProps,
	KitDatePickerProps,
	KitHeadlineProps,
	KitNoticeProps,
	KitNumberFieldProps,
	KitProviderProps,
	KitRadioGroupProps,
	KitSelectProps,
	KitTextareaProps,
	KitTextFieldProps
} from '@oriso/web-kit';

const color = (token: string, fallback: string) => `var(${token}, ${fallback})`;
const field: CSSProperties = {
	width: '100%',
	boxSizing: 'border-box',
	padding: '10px 12px',
	borderRadius: 8,
	border: `1px solid ${color('--m3-outline', '#8a939c')}`,
	font: 'inherit',
	background: color('--m3-surface-container-lowest', '#fff'),
	color: 'inherit'
};
const label: CSSProperties = { display: 'block', fontWeight: 600, marginBottom: 6 };
const helper = (error?: boolean): CSSProperties => ({
	fontSize: 13,
	marginTop: 4,
	color: error ? color('--m3-error', '#b3261e') : color('--m3-on-surface-variant', '#545f63')
});

const Labelled = ({
	id,
	text,
	children,
	helperText,
	error
}: {
	id: string;
	text: string;
	children: ReactNode;
	helperText?: ReactNode;
	error?: boolean;
}) => (
	<div style={{ marginBottom: 4 }}>
		<label htmlFor={id} style={label}>
			{text}
		</label>
		{children}
		{helperText && <div style={helper(error)}>{helperText}</div>}
	</div>
);

export const version = 'preview';

export const Provider = ({ children }: KitProviderProps) => <>{children}</>;

export const Button = ({
	children,
	onClick,
	variant = 'primary',
	disabled,
	id,
	title,
	type = 'button'
}: KitButtonProps) => {
	const primary = color('--m3-primary', '#225e65');
	const styles: Record<string, CSSProperties> = {
		primary: { background: primary, color: color('--m3-on-primary', '#fff'), border: `1px solid ${primary}` },
		secondary: { background: 'transparent', color: primary, border: `1px solid ${primary}` },
		tertiary: { background: 'transparent', color: primary, border: '1px solid transparent' },
		link: { background: 'transparent', color: primary, border: 0, padding: 0, textDecoration: 'underline' }
	};
	return (
		<button
			id={id}
			type={type}
			title={title}
			disabled={disabled}
			onClick={onClick}
			style={{
				font: 'inherit',
				fontWeight: 600,
				fontSize: 14,
				padding: '8px 18px',
				borderRadius: 8,
				cursor: disabled ? 'default' : 'pointer',
				opacity: disabled ? 0.5 : 1,
				...styles[variant]
			}}
		>
			{children}
		</button>
	);
};

export const TextField = ({
	label: text,
	value,
	onChange,
	helperText,
	error,
	disabled,
	required,
	maxLength,
	placeholder,
	id,
	type = 'text'
}: KitTextFieldProps) => {
	const fallback = useId();
	const inputId = id ?? fallback;
	return (
		<Labelled id={inputId} text={text} helperText={helperText} error={error}>
			<input
				id={inputId}
				type={type}
				className="MuiInputBase-input"
				style={field}
				value={value}
				disabled={disabled}
				required={required}
				maxLength={maxLength}
				placeholder={placeholder}
				onChange={(event) => onChange(event.target.value)}
			/>
		</Labelled>
	);
};

export const Textarea = ({
	label: text,
	value,
	onChange,
	helperText,
	error,
	disabled,
	maxLength,
	placeholder,
	id,
	minRows = 3
}: KitTextareaProps) => {
	const fallback = useId();
	const inputId = id ?? fallback;
	return (
		<Labelled id={inputId} text={text} helperText={helperText} error={error}>
			<textarea
				id={inputId}
				rows={minRows}
				className="MuiInputBase-input"
				style={{ ...field, resize: 'vertical' }}
				value={value}
				disabled={disabled}
				maxLength={maxLength}
				placeholder={placeholder}
				onChange={(event) => onChange(event.target.value)}
			/>
		</Labelled>
	);
};

export const Checkbox = ({ label: text, checked, onChange, disabled, describedBy }: KitCheckboxProps) => (
	<label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', margin: '4px 0' }}>
		<input
			type="checkbox"
			checked={checked}
			disabled={disabled}
			aria-describedby={describedBy}
			onChange={(event) => onChange(event.target.checked)}
		/>
		{text}
	</label>
);

export const Select = ({
	label: text,
	options,
	value,
	onChange,
	helperText,
	error,
	disabled,
	id
}: KitSelectProps) => {
	const fallback = useId();
	const inputId = id ?? fallback;
	return (
		<Labelled id={inputId} text={text} helperText={helperText} error={error}>
			<select
				id={inputId}
				className="MuiInputBase-input"
				style={field}
				value={value}
				disabled={disabled}
				onChange={(event) => onChange(event.target.value)}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value} disabled={option.disabled}>
						{option.label}
					</option>
				))}
			</select>
		</Labelled>
	);
};

export const RadioGroup = ({
	label: text,
	options,
	value,
	onChange,
	disabled,
	helperText,
	error,
	id
}: KitRadioGroupProps) => {
	const fallback = useId();
	const name = id ?? fallback;
	return (
		<fieldset style={{ border: 0, padding: 0, margin: 0 }}>
			<legend style={{ ...label, padding: 0 }}>{text}</legend>
			{options.map((option) => (
				<label
					key={option.value}
					style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '4px 0', cursor: 'pointer' }}
				>
					<input
						type="radio"
						name={name}
						value={option.value}
						checked={value === option.value}
						disabled={disabled || option.disabled}
						onChange={() => onChange(option.value)}
					/>
					{option.label}
				</label>
			))}
			{helperText && <div style={helper(error)}>{helperText}</div>}
		</fieldset>
	);
};

export const DatePicker = ({
	label: text,
	value,
	onChange,
	min,
	max,
	disabled,
	helperText,
	error,
	id
}: KitDatePickerProps) => {
	const fallback = useId();
	const inputId = id ?? fallback;
	return (
		<Labelled id={inputId} text={text} helperText={helperText} error={error}>
			<input
				id={inputId}
				type="date"
				className="MuiInputBase-input"
				style={field}
				value={value}
				min={min}
				max={max}
				disabled={disabled}
				onChange={(event) => onChange(event.target.value)}
			/>
		</Labelled>
	);
};

export const NumberField = ({
	label: text,
	value,
	onChange,
	min,
	max,
	step,
	disabled,
	helperText,
	error,
	required,
	id
}: KitNumberFieldProps) => {
	const fallback = useId();
	const inputId = id ?? fallback;
	return (
		<Labelled id={inputId} text={text} helperText={helperText} error={error}>
			<input
				id={inputId}
				type="number"
				className="MuiInputBase-input"
				style={field}
				value={value ?? ''}
				min={min}
				max={max}
				step={step}
				disabled={disabled}
				required={required}
				onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
			/>
		</Labelled>
	);
};

const NOTICE_COLORS: Record<string, string> = {
	info: '#e5f1f8',
	success: '#e3f3e6',
	warning: '#fff3d6',
	error: '#fde7e7'
};

export const Notice = ({ title, children, type = 'info' }: KitNoticeProps) => (
	<div
		role={type === 'error' ? 'alert' : 'status'}
		style={{ background: NOTICE_COLORS[type], borderRadius: 8, padding: '12px 16px' }}
	>
		<strong>{title}</strong>
		{children && <div style={{ marginTop: 4 }}>{children}</div>}
	</div>
);

export const Card = ({ children }: KitCardProps) => (
	<div
		style={{
			background: color('--m3-surface-container-lowest', '#fff'),
			border: `1px solid ${color('--m3-outline-variant', '#d6dcde')}`,
			borderRadius: 12,
			padding: '16px 20px'
		}}
	>
		{children}
	</div>
);

export const Headline = ({ children, level = 2, styleLevel }: KitHeadlineProps) => {
	const Tag = `h${level}` as 'h2';
	const size = { 1: 28, 2: 22, 3: 18, 4: 16, 5: 14 }[styleLevel ?? level];
	return <Tag style={{ fontSize: size, margin: '0 0 8px', lineHeight: 1.3 }}>{children}</Tag>;
};

export const Spinner = () => (
	<div role="progressbar" aria-label="Wird geladen" style={{ padding: 12 }}>
		Wird geladen …
	</div>
);
