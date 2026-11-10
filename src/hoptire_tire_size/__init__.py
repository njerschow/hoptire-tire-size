"""Read metric tire markings. Does not determine vehicle fitment."""

import math
import re

_MARKING = re.compile(
    r"(P|LT|ST|T)?([1-9][0-9]{2})/([1-9][0-9])\s*(ZR|R)"
    r"([1-9][0-9]?(?:\.5)?)(?:\s+([1-9][0-9]{1,2})"
    r"(?:/([1-9][0-9]{1,2}))?([A-Z]|\(Y\)))?(?:\s+(XL|REINF))?"
)


def parse_tire_size(value):
    """Return nominal dimensions and unvalidated service symbols as a dict."""
    if not isinstance(value, str) or len(value) > 80 or "\r" in value or "\n" in value:
        raise TypeError("Use one metric tire marking, such as 215/60R16 95H.")
    match = _MARKING.fullmatch(value.strip().upper())
    if not match:
        raise ValueError("Unsupported tire marking. Example: 215/60R16 95H.")
    prefix, width, aspect, construction, rim, load, dual_load, speed, extra = match.groups()
    prefix = prefix or ""
    sidewall = int(width) * int(aspect) / 100
    diameter = float(rim) * 25.4 + 2 * sidewall
    size = f"{prefix}{width}/{aspect}{construction}{rim}"
    service = f" {load}{'/' + dual_load if dual_load else ''}{speed}" if load else ""
    return {
        "normalized": size + service + (f" {extra}" if extra else ""),
        "size": size, "prefix": prefix, "widthMm": int(width),
        "aspectRatio": int(aspect), "construction": construction,
        "rimInches": float(rim), "loadIndex": int(load) if load else None,
        "dualLoadIndex": int(dual_load) if dual_load else None,
        "speedSymbol": speed, "extraLoad": extra,
        "sidewallMm": sidewall, "diameterMm": diameter,
        "circumferenceMm": math.pi * diameter,
    }


def compare_tire_sizes(original, candidate):
    """Return dimension changes, not a safety or fitment recommendation."""
    a, b = parse_tire_size(original), parse_tire_size(candidate)
    return {
        "original": a["normalized"], "candidate": b["normalized"],
        "diameterDifferenceMm": b["diameterMm"] - a["diameterMm"],
        "diameterDifferencePercent": (b["diameterMm"] / a["diameterMm"] - 1) * 100,
        "widthDifferenceMm": b["widthMm"] - a["widthMm"],
        "rimDifferenceInches": b["rimInches"] - a["rimInches"],
    }
