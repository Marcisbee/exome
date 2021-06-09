export function colorize(
  value: string,
  modifiers: Record<string, (value: string) => string>,
) {
  const chunks = value.split(/<|>/);
  let output = '';
  const unresolvedChunks = [];

  for (const index in chunks) {
    const chunk = chunks[index];

    if (parseInt(index, 10) % 2 === 0) {
      if (unresolvedChunks.length > 0) {
        unresolvedChunks[unresolvedChunks.length - 1] += chunk
        continue;
      }

      output += chunk;
      continue;
    }

    if (typeof modifiers[chunk] === 'function') {
      unresolvedChunks.push(chunk);
      unresolvedChunks.push('');
      continue;
    }

    if (chunk[0] === '/' && typeof modifiers[chunk.slice(1)] === 'function' && unresolvedChunks.length > 0 && chunk.slice(1) === unresolvedChunks[unresolvedChunks.length - 2]) {
      const resolvedChunk = unresolvedChunks.pop()!;
      const modifier = modifiers[unresolvedChunks.pop()!];

      if (unresolvedChunks.length > 0) {
        unresolvedChunks[unresolvedChunks.length - 1] += modifier(resolvedChunk);
        continue;
      }

      output += modifier(resolvedChunk);

      continue;
    }

    if (unresolvedChunks.length > 0) {
      unresolvedChunks[unresolvedChunks.length - 1] += chunk
      continue;
    }

    output += chunk;
  }

  return output;
}
