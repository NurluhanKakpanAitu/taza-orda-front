import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [formValues, setFormValues] = useState({ phone: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(
    (values = formValues) => {
      const errors = {};
      const phoneValue = values.phone?.trim();

      if (!phoneValue) {
        errors.phone = 'Поле обязательно для заполнения';
      } else if (phoneValue.length < 10) {
        errors.phone = 'Номер телефона некорректный';
      }

      if (!values.password) {
        errors.password = 'Поле обязательно для заполнения';
      } else if (values.password.length < 6) {
        errors.password = 'Минимум 6 символов';
      }

      return errors;
    },
    [formValues],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    const errors = validate();
    setFormErrors((prev) => ({ ...prev, [name]: errors[name] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGeneralError('');
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    setIsSubmitting(true);
    try {
      const userData = await login({
        phoneNumber: formValues.phone,
        password: formValues.password,
      });
      const targetRoute =
        userData?.role === 'Operator' || userData?.role === 'Admin' ? '/operator/dashboard' : '/dashboard';
      navigate(targetRoute, { replace: true });
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400 || status === 401) {
        setGeneralError('Неверный номер телефона или пароль');
      } else {
        setGeneralError('Проверьте подключение');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = useMemo(() => Object.keys(validate()).length > 0, [validate]);

  useEffect(() => {
    if (isAuthenticated) {
      const targetRoute = ['Operator', 'Admin'].includes(user?.role) ? '/operator/dashboard' : '/dashboard';
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1>Вход</h1>
        <p className="auth-subtitle">Введите номер телефона и пароль, чтобы продолжить</p>
        <form onSubmit={handleSubmit} noValidate>
          <InputField
            label="Номер телефона"
            name="phone"
            type="tel"
            inputMode="numeric"
            value={formValues.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Например, 7012345678"
            error={formErrors.phone}
          />
          <InputField
            label="Пароль"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Введите пароль"
            error={formErrors.password}
          />
          {generalError && <ErrorMessage message={generalError} />}
          <Button type="submit" loading={isSubmitting} disabled={isSubmitDisabled}>
            Войти
          </Button>
        </form>
        <p className="auth-switch">
          У меня нет аккаунта&nbsp;
          <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
