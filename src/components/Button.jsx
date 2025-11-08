const Button = ({ children, loading, disabled, className = 'primary-btn', ...rest }) => (
  <button className={className} disabled={disabled || loading} {...rest}>
    {loading ? 'Загрузка...' : children}
  </button>
);

export default Button;
