import ErrorMessage from './ErrorMessage';

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  ...rest
}) => {
  const inputClassName = `field-input${error ? ' field-input--error' : ''}`;

  return (
    <div className="form-field">
      {label && (
        <label htmlFor={name} className="field-label">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClassName}
        {...rest}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default InputField;
