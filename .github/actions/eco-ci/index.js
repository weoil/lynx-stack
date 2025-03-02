// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// @ts-check
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspace = path.resolve(__dirname, '..', '..', '..');
async function addCommentReaction() {
  const commentId = context.payload.comment?.id;
  const user = context.payload.sender?.login;
  if (user && commentId) {
    const octokit = getOctokit(core.getInput('token'));
    const comment = await octokit.rest.pulls.getReviewComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: commentId,
    });
    if (comment.data.body_text?.includes('$eco-ci')) {
      await octokit.rest.reactions.createForIssueComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: commentId,
        content: 'rocket',
      });
      return true;
    }
  } else {
    core.debug(`empty ${user ? '' : 'user'} ${commentId ? '' : 'comment-id'}`);
  }
  return false;
}

/**
 * @returns {Promise<Record<string, string>>}
 */
async function readPackages() {
  const fileBinary = await fs.readFile(path.join(workspace, 'eco-ci.json'));
  const pkgResult = JSON.parse(fileBinary.toString());
  return Object.fromEntries(pkgResult.map((e) => [e.name, e.url]));
}

async function run() {
  const shouldRunEcoCi = await addCommentReaction();
  if (shouldRunEcoCi) {
    const pkgs = await readPackages();
    console.info(pkgs);
  }
}

run();
