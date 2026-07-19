import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ArenaBattle, ArenaChecksums, ArenaRelease } from "./types";

const artifactRoot = path.join(
  process.cwd(),
  "public",
  "bench",
  "composer-arena",
  "v0",
);

async function readJson<T>(filename: string): Promise<T> {
  return JSON.parse(await readFile(path.join(artifactRoot, filename), "utf8")) as T;
}

async function readJsonLines<T>(filename: string): Promise<T[]> {
  const raw = await readFile(path.join(artifactRoot, filename), "utf8");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

export async function loadComposerArena() {
  const [release, battles, checksums] = await Promise.all([
    readJson<ArenaRelease>("release.preview.json"),
    readJsonLines<ArenaBattle>("battles.preview.jsonl"),
    readJson<ArenaChecksums>("checksums.json"),
  ]);

  return { release, battles, checksums };
}
