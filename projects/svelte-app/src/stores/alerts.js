import { writable } from 'svelte/store';

export const ALERT_TYPES = {
  SUCCESS: 'success-color',
  PRIMARY: 'primary-color',
  ERROR: 'error-color',
  WARN: 'lighten-1',
};

const defaults = { type: ALERT_TYPES.PRIMARY, message: '', icon: null, dismissible: false, duration: 3000, enable: false };

function createAlert() {
  const { subscribe, set } = writable(defaults);
  let currentTimeout;

  return {
    subscribe,
    show: data => {
      const params = {
        ...defaults,
        ...data,
        enable: true,
      };
      clearTimeout(currentTimeout);
      set(params);
      currentTimeout = setTimeout(() => set(defaults), params.duration);
    },
    hide: () => set(defaults),
  };
}

export const alertStore = createAlert();
