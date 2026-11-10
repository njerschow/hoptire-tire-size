const {test} = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname,'..');
const python = process.env.PYTHON || 'python3';
test('CLI output matches between languages', () => {
  const commands = [[process.execPath,[path.join(root,'cli.cjs')]],[python,['-m','hoptire_tire_size']]];
  for (const args of [['215/60R16 95H'],['215/60R16','225/60R16'],['bad'],[]]) {
    const results = commands.map(([cmd,prefix])=>spawnSync(cmd,[...prefix,...args],{encoding:'utf8',env:{...process.env,PYTHONPATH:path.join(root,'src')}}));
    assert.equal(results[0].status,results[1].status,results[1].stderr);
    if (args[0] && args[0] !== 'bad') {
      assert.equal(results[0].status,0,results[0].stderr);
      assert.deepEqual(JSON.parse(results[0].stdout),JSON.parse(results[1].stdout));
    } else assert.equal(results[0].status,2);
  }
});
