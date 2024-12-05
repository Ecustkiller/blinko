import { Octokit } from '@octokit/core'
import { Store } from '@tauri-apps/plugin-store';
import { v4 as uuid } from 'uuid';

export function uint8ArrayToBase64(data: Uint8Array) {
  return Buffer.from(data).toString('base64');
}

export interface GithubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: Links;
}

interface Links {
  self: string;
  git: string;
  html: string;
}

export async function uploadFile({ path, ext, file }: { path: string, ext: string, file: string}) {
  const store = await Store.load('store.json');
  const accessToken = await store.get('accessToken')
  const octokit = new Octokit({
    auth: accessToken
  })
  const githubUsername = await store.get('githubUsername')
  const repositoryName = await store.get('repositoryName')
  try {
    const filename = `${uuid()}.${ext}`
    const res = await octokit.request(`PUT /repos/${githubUsername}/${repositoryName}/contents/${path}/${filename}`, {
      message: 'a new commit message',
      content: file,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return res;
  } catch (error) {
    console.log(error);
    return false
  }
}

export async function getFiles({ path }: { path: string}) {
  const store = await Store.load('store.json');
  const accessToken = await store.get('accessToken')
  const octokit = new Octokit({
    auth: accessToken
  })
  const githubUsername = await store.get('githubUsername')
  const repositoryName = await store.get('repositoryName')
  try {
    const res = await octokit.request(`GET /repos/${githubUsername}/${repositoryName}/contents/${path}`, {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return res.data;
  } catch (error) {
    console.log(error);
    return false
  }
}

export async function deleteFile({ path, sha }: { path: string, sha: string}) {
  const store = await Store.load('store.json');
  const accessToken = await store.get('accessToken')
  const octokit = new Octokit({
    auth: accessToken
  })
  const githubUsername = await store.get('githubUsername')
  const repositoryName = await store.get('repositoryName')
  try {
    console.log(`DELETE /repos/${githubUsername}/${repositoryName}/contents/${path}`);
    const res = await octokit.request(`DELETE /repos/${githubUsername}/${repositoryName}/contents/${path}`, {
      sha,
      message: 'a new commit message',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return res.data;
  } catch (error) {
    console.log(error);
    return false
  }
}