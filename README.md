# HopTire Tire Size

Read a marking such as `215/60R16 95H` into fields. Compare nominal tire dimensions without an API call. Available for JavaScript and Python. No runtime dependencies, telemetry, or network requests.

Built by [HopTire](https://hoptire.com/), a mobile tire service. See the [tire-size guide](https://hoptire.com/guides/find-your-tire-size) for help reading a sidewall.

## JavaScript

Registry publication is pending. Until npm and PyPI are live, download the package from [GitHub Releases](https://github.com/njerschow/hoptire-tire-size/releases/latest). Install the `.tgz` with `npm install ./hoptire-tire-size-0.1.0.tgz` or the `.whl` with `pip install ./hoptire_tire_size-0.1.0-py3-none-any.whl`. The registry commands below apply after publication.

```sh
npm install hoptire-tire-size
```

```js
const {parseTireSize, compareTireSizes} = require('hoptire-tire-size');
parseTireSize('215/60R16 95H');
// widthMm: 215, aspectRatio: 60, rimInches: 16, diameterMm: 664.4
compareTireSizes('215/60R16', '225/60R16');
// widthDifferenceMm: 10, diameterDifferenceMm: 12
```

TypeScript definitions are included. The package also works with ESM via a default import.

## Python

```sh
pip install hoptire-tire-size
```

```python
from hoptire_tire_size import parse_tire_size, compare_tire_sizes
parse_tire_size("215/60R16 95H")
compare_tire_sizes("215/60R16", "225/60R16")
```

Both versions return the same JSON keys. Optional markings are `null` in JavaScript and `None` in Python.

## Command line

```sh
hoptire-tire-size "215/60R16 95H"
hoptire-tire-size "215/60R16" "225/60R16"
```

The command prints JSON. Invalid or unsupported input exits with code 2.

## Supported markings

- Metric sizes with a three-digit width and two-digit aspect ratio.
- Optional `P`, `LT`, `ST`, or `T` prefix; `R` or `ZR` construction.
- Whole-inch or half-inch rim diameter.
- Optional load index, dual load index, speed symbol, and `XL` or `REINF`.
- Lowercase input and surrounding spaces.

This reads symbols. It does not validate their ratings or confirm that a size exists. Flotation sizes such as `35x12.50R17`, bias-ply markings, and arbitrary sidewall text are not supported.

## What the numbers mean

Nominal sidewall height is width times aspect ratio divided by 100. Nominal diameter is rim diameter times 25.4 plus twice the sidewall height. Actual dimensions vary by tire model and measurement conditions. The [Michelin markings guide](https://www.michelinman.com/auto/auto-tips-and-advice/tires-101/tire-markings-explained) explains the markings.

**A similar diameter does not establish fitment or make two tires interchangeable.** This tool does not check the vehicle, load capacity, speed rating, wheel width, clearance, tread, or manufacturer requirements. Use the vehicle placard and a qualified tire professional to select a replacement.

## Development

```sh
npm test
PYTHONPATH=src python3 -m unittest discover -s test -p 'test_*.py'
```

JavaScript and Python share `test/cases.json`. Add cases there when changing the supported grammar. MIT license.
