/// <reference types="vitest/globals" />

import fs from 'node:fs/promises';
import path from 'node:path';

import asset from './asset.json';

it('should have publicPath', async () => {
  const expected = ['https://', 'example.com/', 'asset.json'].join('');
  expect(asset).toBe(expected);

  const content = await fs.readFile(
    path.resolve(__dirname, 'asset.json'),
    'utf-8',
  );
  expect(JSON.parse(content)).toStrictEqual({});
});

it('should have publicPath in both bundle', async () => {
  const expected = ['https://', 'example.com/'].join('');

  const content = await fs.readFile(
    __filename,
    'utf-8',
  );

  expect(content).toContain(expected);
});
