import { join } from 'path';

export const screenshot = name => {
  const screenshotFullName = join(__dirname, '../../../__output__', `|${new Date().getTime()}|${name}`);

  return page.screenshot({ path: `${screenshotFullName}.png` });
};
