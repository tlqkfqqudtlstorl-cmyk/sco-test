import test from 'node:test';
import assert from 'node:assert/strict';

import { assessSubmissionIntegrity } from '../src/lib/integrity';

test('assessSubmissionIntegrity flags suspicious AC submissions', () => {
  const result = assessSubmissionIntegrity({
    language: 'nodejs',
    code: 'eval("__DEMO_AC__")',
    status: 'AC',
  });

  assert.ok(result.score >= 25);
  assert.ok(result.flags.includes('DYNAMIC_EXECUTION'));
  assert.ok(result.flags.includes('SUSPICIOUS_MARKER'));
});

test('assessSubmissionIntegrity keeps ordinary code low risk', () => {
  const result = assessSubmissionIntegrity({
    language: 'nodejs',
    code: 'const fs=require("fs"); const input=fs.readFileSync(0,"utf8"); console.log(input.trim());',
    status: 'WA',
  });

  assert.equal(result.score, 0);
  assert.equal(result.level, 'LOW');
});
