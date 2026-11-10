const {test} = require('node:test');
const assert = require('node:assert/strict');
const {parseTireSize, compareTireSizes} = require('../index.cjs');
const cases = require('./cases.json');
for (const c of cases.valid) test(`parse ${c.input}`, () => {
  const result = parseTireSize(c.input);
  assert.equal(result.normalized, c.normalized);
  assert.ok(Math.abs(result.diameterMm - c.diameterMm) < 1e-8);
  assert.ok(Math.abs(result.circumferenceMm - c.diameterMm * Math.PI) < 1e-8);
});
for (const input of cases.invalid) test(`reject ${JSON.stringify(input)}`, () => assert.throws(() => parseTireSize(input)));
test('preserves service markings', () => {
  const r = parseTireSize('LT245/75R16 120/116S XL');
  assert.deepEqual([r.loadIndex, r.dualLoadIndex, r.speedSymbol, r.extraLoad], [120,116,'S','XL']);
});
test('comparison is directional and identity is zero', () => {
  assert.equal(compareTireSizes('215/60R16', '215/60R16').diameterDifferencePercent, 0);
  const r = compareTireSizes('215/60R16', '225/60R16');
  assert.equal(r.widthDifferenceMm, 10);
  assert.ok(Math.abs(r.diameterDifferenceMm - 12) < 1e-8);
  assert.ok(Math.abs(r.diameterDifferencePercent - 12 / 664.4 * 100) < 1e-8);
});
test('bounds input length', () => assert.throws(() => parseTireSize(' '.repeat(81))));
