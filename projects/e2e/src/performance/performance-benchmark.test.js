
import { measurePerformance } from './lighthouse';

describe('Performance benchmark', () => {


  beforeAll(async () => {

  });

  beforeEach(async () => {
    await page.fullyRefreshPage();
    await page.clearAllData();
  });

  test('login', async () => {
    const { avgScore } = await measurePerformance({ url, path, samplesAmount });

    expect(avgScore).toBeGreaterThanOrEqual(minScore.login || 0);
  });


});
