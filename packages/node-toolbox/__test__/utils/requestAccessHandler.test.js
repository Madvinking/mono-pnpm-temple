const { generateRequestLogObject } = require('../../src/utils');

const MOCK_REQUEST_ID = 'mock-request-id';

describe('create an access log object', () => {
  test('should create an object', () => {
    const requestMock = {
      method: 'GET',
      url: '/test?a=1&b=2&c=3',
      route: { path: '/test-path' },
      headers: {
        'x-request-id': MOCK_REQUEST_ID,
      },
    };

    const responseMock = { statusCode: 200 };
    const processingTimeMs = Math.random();

    const generatedAccessLogObject = generateRequestLogObject({ req: requestMock, res: responseMock, processingTimeMs });

    const duration = Math.round(processingTimeMs);

    const expected = {
      url: '/test',
      query: 'a=1&b=2&c=3',
      method: 'GET',
      duration,
      message: `request-id:[${MOCK_REQUEST_ID}], url:[/test], query:[a=1&b=2&c=3], method:[GET], statusCode:[200], duration:[${duration}]`,
      requestId: MOCK_REQUEST_ID,
      statusCode: 200,
      logIdentifier: 'ACCESS_LOG',
      pathTemplate: '/test-path',
    };

    expect(generatedAccessLogObject).toEqual(expected);
  });
});
