process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'fakeshield_test_secret_key_12345';
process.env.DATABASE_PATH = '../database/fakeshield_test.db';

import { run } from 'node:test';
import { spec } from 'node:test/reporters';
import path from 'path';
import fs from 'fs';

const testFiles = [
  path.resolve(__dirname, 'urlAnalyzer.test.ts'),
  path.resolve(__dirname, 'api.test.ts')
];

run({ files: testFiles })
  .on('test:fail', () => {
    process.exitCode = 1;
  })
  .compose(new spec())
  .pipe(process.stdout);
