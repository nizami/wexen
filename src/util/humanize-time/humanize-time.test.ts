import {humanizeTime} from '#wexen';
import {expect, test} from 'vitest';

test('humanize time', async () => {
  expect(humanizeTime(1000)).toBe('1s');
  expect(humanizeTime(1000 * 60)).toBe('1m');
  expect(humanizeTime(1000 * 60 * 60 + 1000 * 60)).toBe('1h 1m');
});
