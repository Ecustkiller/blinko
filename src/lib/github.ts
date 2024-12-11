import { toast } from '@/hooks/use-toast';
import { Octokit } from '@octokit/core'
import { Store } from '@tauri-apps/plugin-store';
import { v4 as uuid } from 'uuid';

export function uint8ArrayToBase64(data: Uint8Array) {
  return Buffer.from(data).toString('base64');
}


export function decodeBase64ToString(str: string){
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
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

export async function uploadFile(
  { path, ext, file, filename, sha }:
  { path: string, ext: string, file: string, filename?: string, sha?: string}) 
{
  const store = await Store.load('store.json');
  const accessToken = await store.get('accessToken')
  const octokit = new Octokit({
    auth: accessToken
  })
  const githubUsername = await store.get('githubUsername')
  const repositoryName = await store.get('repositoryName')
  try {
    let _filename = ''
    if (filename) {
      _filename = `${filename}`
    } else {
      _filename = `${uuid()}.${ext}`
    }
    // 将空格转换成下划线
    _filename = _filename.replace(/\s/g, '_')
    const res = await octokit.request(`PUT /repos/${githubUsername}/${repositoryName}/contents/${path}/${_filename}`, {
      message: `Upload ${_filename}`,
      content: file,
      sha,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      },
    })
    return res;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast({
      title: '上传失败',
      description: '请检查网络或配置是否正确。',
      variant: 'destructive',
    })
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
  path = path.replace(/\s/g, '_')
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

export async function getFileCommits({ path }: { path: string}) {
  // https://api.github.com/repos/{owner}/{repo}/commits?path={path}
  const store = await Store.load('store.json');
  const accessToken = await store.get('accessToken')
  const octokit = new Octokit({
    auth: accessToken
  })
  const githubUsername = await store.get('githubUsername')
  const repositoryName = await store.get('repositoryName')
  path = path.replace(/\s/g, '_')
  try {
    const res = await octokit.request(`GET /repos/${githubUsername}/${repositoryName}/commits?path=${path}`, {
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