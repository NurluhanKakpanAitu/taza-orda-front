export const categoryLabels = {
  OverflowingBin: 'Переполненный мусорный бак',
  StreetLitter: 'Мусор на улице',
  IllegalDump: 'Несанкционированная свалка',
  SnowIce: 'Неубранный снег/лёд',
  DamagedContainer: 'Повреждённый контейнер',
  MissedCollection: 'Нарушение вывоза мусора',
  WaterPollution: 'Загрязнение водоёмов',
  Other: 'Другое',
};

const categoryCodeMap = {
  0: 'OverflowingBin',
  1: 'StreetLitter',
  2: 'IllegalDump',
  3: 'SnowIce',
  4: 'DamagedContainer',
  5: 'MissedCollection',
  6: 'WaterPollution',
  99: 'Other',
};

export const statusLabels = {
  New: 'Новое',
  InProgress: 'В работе',
  Completed: 'Выполнено',
  Rejected: 'Отклонено',
  UnderReview: 'На проверке',
  Closed: 'Закрыто',
};

const statusCodeMap = {
  0: 'New',
  1: 'InProgress',
  2: 'Completed',
  3: 'Rejected',
  4: 'UnderReview',
  5: 'Closed',
};

export const getCategoryLabel = (value) => {
  const key = typeof value === 'number' ? categoryCodeMap[value] : value;
  return categoryLabels[key] || value || 'Категория';
};

export const getStatusLabel = (value) => {
  const key = typeof value === 'number' ? statusCodeMap[value] : value;
  return statusLabels[key] || value || 'Статус';
};
