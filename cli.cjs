#!/usr/bin/env node
'use strict';
const {parseTireSize, compareTireSizes} = require('./index.cjs');
const args = process.argv.slice(2);
if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
  console.log('Usage: hoptire-tire-size "215/60R16 95H" ["225/60R16 98H"]\nOutputs JSON. Dimensions only; not a vehicle-fitment check.');
} else {
  try {
    if (args.length < 1 || args.length > 2) throw new Error('Pass one tire marking, or two to compare. Use --help.');
    console.log(JSON.stringify(args.length === 2 ? compareTireSizes(...args) : parseTireSize(args[0]), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
