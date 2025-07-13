import {humanizeTime} from '#wexen';
import {expect, test} from 'vitest';

test('humanize time', async () => {
  expect(humanizeTime(1_000n)).toBe('1000ns');
  expect(humanizeTime(1_000_000_000n)).toBe('1s');
  expect(humanizeTime(1_000_000_000n+111n)).toBe('1s 111ns');
  expect(humanizeTime(60n * 1_000_000_000n)).toBe('1m');
  expect(humanizeTime(1n * 60n * 60n * 1_000_000_000n + 60n * 1_000_000_000n)).toBe('1h 1m');
  expect(humanizeTime(1_234_567n)).toBe('1ms 234567ns');
});
