export type DiffRow = {
  oldNo: number | null;
  newNo: number | null;
  oldLine: string;
  newLine: string;
  type: 'same' | 'added' | 'removed' | 'changed';
};

export function buildLineDiff(oldText: string, newText: string): DiffRow[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const max = Math.max(oldLines.length, newLines.length);
  const rows: DiffRow[] = [];

  for (let i = 0; i < max; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];
    if (oldLine === newLine) {
      rows.push({
        oldNo: oldLine === undefined ? null : i + 1,
        newNo: newLine === undefined ? null : i + 1,
        oldLine: oldLine ?? '',
        newLine: newLine ?? '',
        type: 'same',
      });
      continue;
    }
    if (oldLine === undefined) {
      rows.push({ oldNo: null, newNo: i + 1, oldLine: '', newLine: newLine ?? '', type: 'added' });
      continue;
    }
    if (newLine === undefined) {
      rows.push({ oldNo: i + 1, newNo: null, oldLine: oldLine ?? '', newLine: '', type: 'removed' });
      continue;
    }
    rows.push({ oldNo: i + 1, newNo: i + 1, oldLine, newLine, type: 'changed' });
  }

  return rows;
}

export function splitChangedLine(oldLine: string, newLine: string) {
  const minLength = Math.min(oldLine.length, newLine.length);
  let prefix = 0;
  while (prefix < minLength && oldLine[prefix] === newLine[prefix]) {
    prefix += 1;
  }

  let oldSuffix = oldLine.length - 1;
  let newSuffix = newLine.length - 1;
  while (oldSuffix >= prefix && newSuffix >= prefix && oldLine[oldSuffix] === newLine[newSuffix]) {
    oldSuffix -= 1;
    newSuffix -= 1;
  }

  return {
    prefix: oldLine.slice(0, prefix),
    oldChanged: oldLine.slice(prefix, oldSuffix + 1),
    newChanged: newLine.slice(prefix, newSuffix + 1),
    suffix: oldLine.slice(oldSuffix + 1),
  };
}
