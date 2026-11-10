import argparse
import json
from . import compare_tire_sizes, parse_tire_size


def main():
    parser = argparse.ArgumentParser(description="Read tire markings. Not a vehicle-fitment check.")
    parser.add_argument("original", help="Example: 215/60R16 95H")
    parser.add_argument("candidate", nargs="?", help="Optional second marking to compare")
    args = parser.parse_args()
    try:
        result = compare_tire_sizes(args.original, args.candidate) if args.candidate else parse_tire_size(args.original)
    except (ValueError, TypeError) as error:
        parser.error(str(error))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
