'use strict';

const MARKING = /^(P|LT|ST|T)?([1-9][0-9]{2})\/([1-9][0-9])\s*(ZR|R)([1-9][0-9]?(?:\.5)?)(?:\s+([1-9][0-9]{1,2})(?:\/([1-9][0-9]{1,2}))?([A-Z]|\(Y\)))?(?:\s+(XL|REINF))?$/;

function parseTireSize(value) {
  if (typeof value !== 'string' || value.length > 80 || /[\r\n]/.test(value)) {
    throw new TypeError('Use one metric tire marking, such as 215/60R16 95H.');
  }
  const match = MARKING.exec(value.trim().toUpperCase());
  if (!match) throw new RangeError('Unsupported tire marking. Example: 215/60R16 95H.');
  const [, prefix = '', width, aspect, construction, rim, load, dualLoad, speed, extraLoad] = match;
  const widthMm = Number(width);
  const aspectRatio = Number(aspect);
  const rimInches = Number(rim);
  const sidewallMm = widthMm * aspectRatio / 100;
  const diameterMm = rimInches * 25.4 + 2 * sidewallMm;
  const size = `${prefix}${width}/${aspect}${construction}${rim}`;
  const service = load ? ` ${load}${dualLoad ? '/' + dualLoad : ''}${speed}` : '';
  return {
    normalized: size + service + (extraLoad ? ` ${extraLoad}` : ''),
    size, prefix, widthMm, aspectRatio, construction, rimInches,
    loadIndex: load ? Number(load) : null,
    dualLoadIndex: dualLoad ? Number(dualLoad) : null,
    speedSymbol: speed || null,
    extraLoad: extraLoad || null,
    sidewallMm, diameterMm, circumferenceMm: Math.PI * diameterMm
  };
}

function compareTireSizes(original, candidate) {
  const a = parseTireSize(original);
  const b = parseTireSize(candidate);
  return {
    original: a.normalized, candidate: b.normalized,
    diameterDifferenceMm: b.diameterMm - a.diameterMm,
    diameterDifferencePercent: (b.diameterMm / a.diameterMm - 1) * 100,
    widthDifferenceMm: b.widthMm - a.widthMm,
    rimDifferenceInches: b.rimInches - a.rimInches
  };
}

module.exports = { parseTireSize, compareTireSizes };
