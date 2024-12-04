import { Octokit } from '@octokit/core'
import { Store } from '@tauri-apps/plugin-store';
import { v4 as uuid } from 'uuid';

export function uint8ArrayToBase64(data: Uint8Array) {
  return Buffer.from(data).toString('base64');
}

export async function uploadFile({ path, ext, file }: { path: string, ext: string, file: string}) {
    console.log(ext);
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
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
      return false
    }
  }