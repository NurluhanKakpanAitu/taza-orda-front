import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(
    (values = formValues) => {
      const errors = {};
      const phoneValue = values.phone?.trim();

      if (!values.firstName.trim()) {
        errors.firstName = 'Поле обязательно для заполнения';
      }

      if (!values.lastName.trim()) {
        errors.lastName = 'Поле обязательно для заполнения';
      }

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
      await register({
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        phoneNumber: formValues.phone,
        password: formValues.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409) {
        setGeneralError('Такой номер уже существует');
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
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1>Регистрация</h1>
        <p className="auth-subtitle">Создайте аккаунт, чтобы следить за чистотой города</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="double-field">
            <InputField
              label="Имя"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Имя"
              error={formErrors.firstName}
            />
            <InputField
              label="Фамилия"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Фамилия"
              error={formErrors.lastName}
            />
          </div>
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
            placeholder="Минимум 6 символов"
            error={formErrors.password}
          />
          {generalError && <ErrorMessage message={generalError} />}
          <Button type="submit" loading={isSubmitting} disabled={isSubmitDisabled}>
            Зарегистрироваться
          </Button>
        </form>
        <p className="auth-switch">
          У меня уже есть аккаунт&nbsp;
          <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
