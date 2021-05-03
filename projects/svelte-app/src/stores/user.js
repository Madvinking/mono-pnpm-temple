import { writable, get } from 'svelte/store';

import { getFromStorage, setToStorage, clearStorage } from '../services/localStorage';

import { alertStore, ALERT_TYPES } from './alerts';

export const userStore = writable({
  status: 'loading',
  id: null,
  name: null,
  email: null,
  createdAt: null,
  company: null,
});

export const isAuthnticated = () => getUserData().status === 'logedIn';

const setUserDataStorage = data => {
  const { name, email, createdAt, company, id } = data;
  userStore.set({ status: 'logedIn', email, company, createdAt, name, id });
  setToStorage('userData', { name, email, createdAt, company });
};

export const clearUserDataStorage = () => {
  userStore.set({ status: 'logedOut', email: '', company: '', createdAt: '', name: '', id: '' });
  clearStorage();
};

export const logOut = async () => {
  await fetch('/user/logout', { method: 'POST' });
  clearUserDataStorage();
  history.pushState({}, null, '/login');
};

export const getUserData = () => get(userStore);

export const logIn = async ({ password = null, email = null } = {}) => {
  try {
    if (!email || !password) return;
    let data = await fetch('/user/login', {
      body: JSON.stringify({ password, email }),
      method: 'POST',
    });
    setUserDataStorage(data);
    history.pushState({}, null, '/main');
  } catch (err) {

    clearUserDataStorage();
    alertStore.show({ type: ALERT_TYPES.ERROR, message: `faild to login: ${err.statusText}` });
  }
};

export const signUp = async ({ name = null, password = null, email = null, company = null, phone = null } = {}) => {
  try {
    if (!name || !password || !company || !phone) return;
    let data = await fetch('/user/signup', {
      body: { name, password, email, company, phone },
      method: 'POST',
    });
    setUserDataStorage(data);
    history.pushState({}, null, '/main');
  } catch {
    clearUserDataStorage();
  }
};

export const validateLoggedIn = async () => {

  try {
    await fetch('/user/isLoggedIn');

    const { id = null, name = null, email = null, createdAt = null, company = null } = getFromStorage('userData');
    if (!id || !name || !email || !createdAt || !company) {
      const data = await fetch('/user/getUserData');
      setUserDataStorage(data);
    } else {
      setUserDataStorage({ id, name, email, company, createdAt });
    }


    const pathname = ['/login', '/singup', '/'].includes(window.location.pathname) ? '/main' : window.location.pathname;
    history.pushState({}, null, pathname);

  } catch {
    clearUserDataStorage();
    if (window.location.pathname === '/signup')
      history.pushState({}, null, '/signup');
    else history.pushState({}, null, '/login');

  }
};
