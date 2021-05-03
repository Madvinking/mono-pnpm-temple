import lhDesktopConfig from 'lighthouse/lighthouse-core/config/lr-desktop-config';

export const lhConfig = {
  extends: 'lighthouse:default',
  settings: {
    ...lhDesktopConfig.settings,
    onlyCategories: ['performance'],
  },
};

export const getLighthouseFlags = ({ disableStorageReset } = { disableStorageReset: false }) => ({
  port: new URL(browser.wsEndpoint()).port,
  disableStorageReset,
});
