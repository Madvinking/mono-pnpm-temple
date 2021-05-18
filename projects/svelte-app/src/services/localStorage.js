export const getFromStorage = key => JSON.parse(localStorage.getItem(key) || '{}');

export const setToStorage = (key, value) => {
  if (typeof value === 'object') {
    localStorage.setItem(key, JSON.stringify(value));
  } else localStorage.setItem(key, value);
};

export const clearStorage = () => localStorage.clear();
