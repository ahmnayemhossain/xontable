export function parseTSV(text: string): string[][] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (lines.length && lines[lines.length - 1] === "") lines.pop();
  return lines.map((line) => line.split("\t"));
}

export function toTSV(block: string[][]): string {
  return block.map((row) => row.join("\t")).join("\n");
}
