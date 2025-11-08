import { useCallback, useState } from 'react';
import { createReport, getCategories, uploadFile } from '../api/reportService';

const extractPhotoUrl = (response) =>
  response?.url || response?.photoUrl || response?.fileUrl || response?.data?.url || response?.data?.photoUrl;

const useReportCreation = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    if (categories.length || categoriesLoading) {
      return;
    }

    setCategoriesLoading(true);
    try {
      const response = await getCategories();
      setCategories(response?.categories ?? response ?? []);
    } catch (error) {
      console.error('Не удалось загрузить категории', error);
    } finally {
      setCategoriesLoading(false);
    }
  }, [categories, categoriesLoading]);

  const submitReport = useCallback(
    async ({ categoryId, description, file, location, street }) => {
      if (!categoryId) {
        setSubmitError('Выберите категорию обращения.');
        return null;
      }

      if (!file) {
        setSubmitError('Добавьте фото проблемы.');
        return null;
      }

      const { lat, lng, districtId } = location || {};

      if (!lat || !lng || !districtId) {
        setSubmitError('Выберите район на карте, чтобы привязать обращение.');
        return null;
      }

      setSubmitting(true);
      setSubmitError('');

      try {
        const uploadResponse = await uploadFile(file);
        const photoUrl = extractPhotoUrl(uploadResponse);

        if (!photoUrl) {
          throw new Error('PHOTO_URL_NOT_FOUND');
        }

        const payload = {
          category: categoryId,
          categoryId,
          description: description.trim(),
          lat,
          lng,
          districtId,
          street: street?.trim() || '',
          photoUrl,
        };

        const response = await createReport(payload);
        return response;
      } catch (error) {
        console.error('Ошибка создания обращения', error);
        setSubmitError('Не удалось отправить обращение. Повторите попытку.');
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return {
    categories,
    categoriesLoading,
    fetchCategories,
    submitReport,
    submitError,
    setSubmitError,
    submitting,
  };
};

export default useReportCreation;
