import * as fs from "fs/promises";
import * as path from "path";

type MetaMap = Record<
  string,
  {
    filename: string;
    downloadedAt: string;
  }
>;

export async function updateMetaFile(
  metaPath: string,
  fileId: string,
  filename: string
): Promise<void> {
  let meta: MetaMap = {};

  try {
    const raw = await fs.readFile(metaPath, "utf-8");
    meta = JSON.parse(raw);
  } catch {
    console.log("Meta file not found, creating a new one.");
    return fs.writeFile(metaPath, JSON.stringify(meta, null, 2), "utf-8");
  }

  meta[fileId] = {
    filename: filename,
    downloadedAt: new Date().toISOString(),
  };

  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), "utf-8");
}

export async function getFilenameFromMeta(
  metaPath: string,
  fileId: string
): Promise<string | undefined> {
  try {
    const raw = await fs.readFile(metaPath, "utf-8");
    const meta: MetaMap = JSON.parse(raw);
    return meta[fileId]?.filename;
  } catch {
    return undefined;
  }
}
