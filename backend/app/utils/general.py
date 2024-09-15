import os
import re
import unicodedata


def initialize_directories(base_dir):
    directories = [base_dir, base_dir / "downloads"]

    for d in directories:
        if not os.path.exists(d):
            os.makedirs(d)

    return True


def sluggify(path, allow_unicode=False):
    if allow_unicode:
        path = unicodedata.normalize("NFKC", path)
    else:
        path = (
            unicodedata.normalize("NFKD", path)
            .encode("ascii", "ignore")
            .decode("ascii")
        )

    path = re.sub(r"[^\w\s-]", "", path.lower())
    path = re.sub(r"[-\s]+", "-", path).strip("-_")

    return os.path.join(path)
