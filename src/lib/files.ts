export async function readInputFile(
  file: File,
  encoding: BufferEncoding = "utf8",
) {
  return Buffer.from(await file.arrayBuffer()).toString(encoding);
}
