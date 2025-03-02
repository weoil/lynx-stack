// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import path from 'node:path';

import sourceMap from 'source-map';
import invariant from 'tiny-invariant';

/**
 * Check the mapping of various key locations back to the original source
 * @param {string} out - The output bundle.
 * @param {string} outCodeMap - The output source-map.
 * @param {Record<string,string>} toSearch - The source to search.
 * @returns {Promise<void>} void
 */
export async function checkSourceMap(
  out: string,
  outCodeMap: string,
  toSearch: Record<string, string>,
): Promise<void> {
  const sources =
    (JSON.parse(outCodeMap) as import('source-map').RawSourceMap).sources;
  for (const source of sources) {
    if (sources.filter(s => s === source).length > 1) {
      throw new Error(
        `Duplicate source ${JSON.stringify(source)} found in source map`,
      );
    }
  }

  const map = await new sourceMap.SourceMapConsumer(outCodeMap);
  for (const id in toSearch) {
    const outIndex = out.indexOf(id);
    if (outIndex < 0) {
      throw new Error(`Failed to find "${id}" in output`);
    }
    const outLines = out.slice(0, outIndex).split('\n');
    const outLine = outLines.length;
    const outLastLine = outLines[outLines.length - 1];

    invariant(outLastLine, `Should have outLastLine`);

    let outColumn = outLastLine.length;
    const { source, line, column } = map.originalPositionFor({
      line: outLine,
      column: outColumn,
    });

    const inSource = toSearch[id];

    invariant(
      typeof source === 'string'
        && typeof inSource === 'string'
        && source?.includes(inSource),
      `expected source: ${inSource}, observed source: ${source}@${line}:${column}, {out_source}@${outLine}:${outColumn}.`,
    );

    const inCode = map.sourceContentFor(source);

    invariant(inCode, `Should have source content for source: ${source}`);

    let inIndex = inCode.indexOf(id);
    if (inIndex < 0) inIndex = inCode.indexOf(`'${id}'`);
    if (inIndex < 0) {
      throw new Error(`Failed to find "${id}" in input ${inCode}`);
    }
    const inLines = inCode.slice(0, inIndex).split('\n');
    const inLine = inLines.length;
    const inLastLine = inLines[inLines.length - 1];
    invariant(inLastLine, `Should have inLastLine`);
    let inColumn = inLastLine.length;

    if (path.extname(source) === 'css') {
      const outMatch = /\s*content:\s*$/.exec(outLastLine);
      const inMatch = /\bcontent:\s*$/.exec(inLastLine);
      if (outMatch) outColumn -= outMatch[0].length;
      if (inMatch) inColumn -= inMatch[0].length;
    }

    const expected = JSON.stringify({ source, line: inLine, column: inColumn });
    const observed = JSON.stringify({ source, line, column });
    invariant(
      expected === observed,
      `expected original position: ${expected}, observed original position: ${observed}, out: ${
        outLine + ',' + outColumn + ',' + outIndex + ':' + id
      }`,
    );

    // Also check the reverse mapping
    const positions = map.allGeneratedPositionsFor({
      source,
      line: inLine,
      column: inColumn,
    });
    invariant(
      positions.length > 0,
      `expected generated positions: 1, observed generated positions: ${positions.length}`,
    );
    let found = false;
    for (const { line, column } of positions) {
      if (line === outLine && column === outColumn) {
        found = true;
        break;
      }
    }
    const expectedPosition = JSON.stringify({
      line: outLine,
      column: outColumn,
    });
    const observedPositions = JSON.stringify(positions);
    invariant(
      found,
      `expected generated position: ${expectedPosition}, observed generated positions: ${observedPositions}`,
    );
  }
}
