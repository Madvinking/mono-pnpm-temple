import lighthouse from 'lighthouse';
import { meanBy } from 'lodash';
import { lhConfig, getLighthouseFlags } from './lighthouse-config';
const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i += 1) {
    await callback(array[i], i, array);
  }
};

const calcStandardDeviation = (array, avg) =>
  Math.sqrt(array.reduce((sq, value) => sq + Math.pow(value - avg, 2), 0) / array.length);

const extractAudits = audits => ({
  firstMeaningfulPaint: audits['first-meaningful-paint'].numericValue,
  firstContentfulPaint: audits['first-contentful-paint'].numericValue,
  largestContentfulPaint: audits['largest-contentful-paint'].numericValue,
  speedIndex: audits['speed-index'].numericValue,
  totalBlockingTime: audits['total-blocking-time'].numericValue,
  timeToInteractive: audits.interactive.numericValue,
});

const calcAvgMeasures = lhResults => {
  const scores = lhResults.map(({ categories }) => categories.performance.score * 100);
  const avgScore = meanBy(scores);
  const stdScore = calcStandardDeviation(scores, avgScore);

  return {
    avgScore,
    stdScore,
    avgFirstMeaningfulPaint: meanBy(lhResults, ({ audits }) => audits['first-meaningful-paint'].numericValue),
    avgFirstContentfulPaint: meanBy(lhResults, ({ audits }) => audits['first-contentful-paint'].numericValue),
    avgLargestContentfulPaint: meanBy(lhResults, ({ audits }) => audits['largest-contentful-paint'].numericValue),
    avgSpeedIndex: meanBy(lhResults, ({ audits }) => audits['speed-index'].numericValue),
    totalBlockingTime: meanBy(lhResults, ({ audits }) => audits['total-blocking-time'].numericValue),
    avgTimeToInteractive: meanBy(lhResults, ({ audits }) => audits.interactive.numericValue),
  };
};

export const measurePerformance = async ({ url, path, samplesAmount = 2, cacheEnabled = false, dims = {} }) => {
  const lhResults = [];
  const lighthouseReporter = createLighthouseReporter();
  const lhFlags = getLighthouseFlags({ disableStorageReset: cacheEnabled });

  await asyncForEach(Array(samplesAmount), async () => {
    const { lhr } = await lighthouse(url, lhFlags, lhConfig);

    lhResults.push(lhr);
    lighthouseReporter.reportResults(
      {
        score: lhr.categories.performance.score * 100,
        ...extractAudits(lhr.audits),
      },
      {
        path,
        url,
        cacheEnabled,
        ...dims,
      },
    );
  });

  const avgMeasures = calcAvgMeasures(lhResults);

  lighthouseReporter.reportResults(avgMeasures, {
    path,
    url,
    cacheEnabled,
    ...dims,
  });

  return avgMeasures;
};
