import sys
import json
import io
from contextlib import redirect_stdout
from pathlib import Path

from predict import FoodGuardPredictor


def main():
    if len(sys.argv) != 3:
        print(json.dumps({
            "error": "Usage: inference.py <image_path> <model_path>"
        }))
        sys.exit(1)

    image_path = sys.argv[1]
    model_path = sys.argv[2]

    try:
        # Hide the predictor's console logs
        with redirect_stdout(io.StringIO()):
            predictor = FoodGuardPredictor(model_path=model_path)
            result = predictor.predict(image_path)

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({
            "error": str(e)
        }))
        sys.exit(1)


if __name__ == "__main__":
    main()
