import json
import math
import pathlib
import unittest
from hoptire_tire_size import parse_tire_size, compare_tire_sizes


class ParserTests(unittest.TestCase):
    def test_shared_cases(self):
        cases = json.loads(pathlib.Path(__file__).with_name("cases.json").read_text())
        for case in cases["valid"]:
            with self.subTest(value=case["input"]):
                result = parse_tire_size(case["input"])
                self.assertEqual(result["normalized"], case["normalized"])
                self.assertAlmostEqual(result["diameterMm"], case["diameterMm"])
                self.assertAlmostEqual(result["circumferenceMm"], case["diameterMm"] * math.pi)
        for value in cases["invalid"]:
            with self.subTest(value=value), self.assertRaises((ValueError, TypeError)):
                parse_tire_size(value)

    def test_compare(self):
        self.assertEqual(compare_tire_sizes("215/60R16", "215/60R16")["diameterDifferencePercent"], 0)
        result = compare_tire_sizes("215/60R16", "225/60R16")
        self.assertEqual(result["widthDifferenceMm"], 10)
        self.assertAlmostEqual(result["diameterDifferenceMm"], 12)

    def test_metadata(self):
        result = parse_tire_size("LT245/75R16 120/116S XL")
        self.assertEqual([result[k] for k in ["loadIndex", "dualLoadIndex", "speedSymbol", "extraLoad"]], [120, 116, "S", "XL"])

    def test_length(self):
        with self.assertRaises(TypeError):
            parse_tire_size(" " * 81)


if __name__ == "__main__":
    unittest.main()
