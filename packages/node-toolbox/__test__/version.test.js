const currentVersion = require('../src/version.json');

describe.skip('version.json', () => {
  test('version should not be one on non local env', () => {
    expect(currentVersion.sha).toBeDefined();

    if (process.env.ENV !== 'LOCAL') {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(currentVersion.sha).not.toEqual('1');
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(currentVersion.sha).toEqual('1');
    }
  });
});
