#!/usr/bin/env python3
"""Plan or acquire the three pinned FLEURS SEA validation packages.

The default is metadata-only. Pass ``--download`` to fetch from the pinned
provider URLs into a caller-selected directory and verify byte size and SHA-256.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys
from urllib.request import urlopen


REVISION = "70bb2e84b976b7e960aa89f1c648e09c59f894dd"
BASE_RESOLVE_URI = f"https://huggingface.co/datasets/google/fleurs/resolve/{REVISION}"
BASE_RAW_URI = f"https://huggingface.co/datasets/google/fleurs/raw/{REVISION}"

ARTIFACTS = (
    {
        "role": "dataset_card",
        "filename": "README.md",
        "byte_size": 385614,
        "sha256": "688f79f2a5c731af3796e9f683eb02f9b3f09d040decd8c5625d0f37098e71c6",
        "source_uri": f"{BASE_RAW_URI}/README.md",
    },
    {
        "role": "selected_slice_package",
        "language": "id-ID",
        "source_config": "id_id",
        "source_split": "validation",
        "filename": "parquet-data/id_id/validation-00000-of-00001.parquet",
        "byte_size": 265875871,
        "sha256": "d5fe4ac4679cf2687917adc235db89ae82df815c53a23850f6ba8e159bb4df77",
        "source_uri": f"{BASE_RESOLVE_URI}/parquet-data/id_id/validation-00000-of-00001.parquet",
    },
    {
        "role": "selected_slice_package",
        "language": "fil-PH",
        "source_config": "fil_ph",
        "source_split": "validation",
        "filename": "parquet-data/fil_ph/validation-00000-of-00001.parquet",
        "byte_size": 454686207,
        "sha256": "693d176879c83b3ce9fa86d350f2351237e41e4f5e85bad1d8d7c0b7137d9f43",
        "source_uri": f"{BASE_RESOLVE_URI}/parquet-data/fil_ph/validation-00000-of-00001.parquet",
    },
    {
        "role": "selected_slice_package",
        "language": "vi-VN",
        "source_config": "vi_vn",
        "source_split": "validation",
        "filename": "parquet-data/vi_vn/validation-00000-of-00001.parquet",
        "byte_size": 274630187,
        "sha256": "a6d7cf5fd0711ba5437e6f59f244e72207616aaa6b721f5f7bb2efb98eed1e20",
        "source_uri": f"{BASE_RESOLVE_URI}/parquet-data/vi_vn/validation-00000-of-00001.parquet",
    },
)


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _verify(path: Path, artifact: dict[str, object]) -> None:
    size = path.stat().st_size
    if size != artifact["byte_size"]:
        raise ValueError(f"byte-size mismatch for {artifact['filename']}: expected {artifact['byte_size']}, got {size}")
    digest = _sha256(path)
    if digest != artifact["sha256"]:
        raise ValueError(f"SHA-256 mismatch for {artifact['filename']}: expected {artifact['sha256']}, got {digest}")


def _target_path(output_root: Path, filename: str) -> Path:
    root = output_root.expanduser().resolve()
    target = (root / filename).resolve()
    if target != root and root not in target.parents:
        raise ValueError(f"artifact path escapes output directory: {filename}")
    return target


def acquire(output_root: Path) -> list[dict[str, object]]:
    """Download and verify all pinned artifacts into ``output_root``."""

    records: list[dict[str, object]] = []
    for artifact in ARTIFACTS:
        target = _target_path(output_root, str(artifact["filename"]))
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            _verify(target, artifact)
            records.append({"filename": artifact["filename"], "status": "verified_existing"})
            continue

        partial = target.with_name(target.name + ".part")
        try:
            with urlopen(str(artifact["source_uri"]), timeout=60) as response, partial.open("wb") as handle:
                while chunk := response.read(1024 * 1024):
                    handle.write(chunk)
            _verify(partial, artifact)
            partial.replace(target)
        except Exception:
            partial.unlink(missing_ok=True)
            raise
        records.append({"filename": artifact["filename"], "status": "downloaded_verified"})
    return records


def _payload() -> dict[str, object]:
    return {
        "dataset": "Google FLEURS",
        "dataset_revision": REVISION,
        "domain_label": "read_speech_language_control_not_broadcast",
        "license": "CC-BY-4.0",
        "license_uri": "https://creativecommons.org/licenses/by/4.0/",
        "attribution": "FLEURS, Conneau et al. (2022), https://arxiv.org/abs/2205.12446",
        "change_disclosure": "Pinned validation packages are acquired without modification; Pixel ML does not re-host them.",
        "artifacts": ARTIFACTS,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out-dir", type=Path, help="Caller-selected destination for provider artifacts.")
    parser.add_argument(
        "--download",
        action="store_true",
        help="Fetch and verify artifacts. Without this flag, print the immutable plan only.",
    )
    args = parser.parse_args()

    payload = _payload()
    if not args.download:
        print(json.dumps({"status": "plan_only", **payload}, indent=2))
        return 0
    if args.out_dir is None:
        parser.error("--out-dir is required with --download")

    try:
        records = acquire(args.out_dir)
    except Exception as exc:
        print(json.dumps({"status": "blocked", "error": str(exc)}), file=sys.stderr)
        return 1
    print(json.dumps({"status": "ok", "output_root": str(args.out_dir.resolve()), "records": records}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
