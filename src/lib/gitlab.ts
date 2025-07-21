import { toast } from '@/hooks/use-toast';
import { Store } from '@tauri-apps/plugin-store';
import { v4 as uuid } from 'uuid';
import { fetch, Proxy } from '@tauri-apps/plugin-http';
import { 
  GitlabError, 
  GitlabUserInfo, 
  GitlabProjectInfo, 
  GitlabRepositoryFile,
  GitlabCommit,
  GitlabResponse,
  GitlabInstanceType,
  GITLAB_INSTANCES
} from './gitlab.types';
import { RepoNames } from './github.types';

// Base64 编码工具函数
export function uint8ArrayToBase64(data: Uint8Array) {
  return Buffer.from(data).toString('base64');
}

// File 转换 Base64
export async function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // 删除前缀
      const base64 = reader.result?.toString().replace(/^data:image\/\w+;base64,/, '');
      resolve(base64 || '');
    }
    reader.onerror = error => reject(error);
  });
}

// Base64 解码为字符串
export function decodeBase64ToString(str: string) {
  return decodeURIComponent(atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

// 获取 Gitlab 实例的 API 基础 URL
async function getGitlabApiBaseUrl(): Promise<string> {
  const store = await Store.load('store.json');
  const instanceType = await store.get<GitlabInstanceType>('gitlabInstanceType') || GitlabInstanceType.OFFICIAL;
  
  if (instanceType === GitlabInstanceType.SELF_HOSTED) {
    const customUrl = await store.get<string>('gitlabCustomUrl') || '';
    return `${customUrl}/api/v4`;
  }
  
  const instance = GITLAB_INSTANCES[instanceType];
  return `${instance.baseUrl}/api/v4`;
}

// 获取通用请求头
async function getCommonHeaders(): Promise<Headers> {
  const store = await Store.load('store.json');
  const accessToken = await store.get<string>('gitlabAccessToken');
  
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);
  headers.append('Content-Type', 'application/json');
  
  return headers;
}

// 获取代理配置
async function getProxyConfig(): Promise<Proxy | undefined> {
  const store = await Store.load('store.json');
  const proxyUrl = await store.get<string>('proxy');
  return proxyUrl ? { all: proxyUrl } : undefined;
}

/**
 * 上传文件到 Gitlab 项目
 * @param params 上传参数
 */
export async function uploadFile({
  ext,
  file,
  filename,
  sha,
  message,
  repo,
  path
}: {
  ext: string;
  file: string;
  filename?: string;
  sha?: string;
  message?: string;
  repo: RepoNames;
  path?: string;
}) {
  try {
    const store = await Store.load('store.json');
    const gitlabUsername = await store.get<string>('gitlabUsername');
    const projectId = await store.get<string>(`gitlab_${repo}_project_id`);
    
    if (!gitlabUsername || !projectId) {
      throw new Error('Gitlab 用户名或项目 ID 未配置');
    }

    const id = uuid();
    let _filename = '';
    if (filename) {
      _filename = `${filename}`;
    } else {
      _filename = `${id}.${ext}`;
    }
    // 将空格转换成下划线
    _filename = _filename.replace(/\s/g, '_');
    const _path = path ? `${path}/${_filename}` : _filename;

    const baseUrl = await getGitlabApiBaseUrl();
    const headers = await getCommonHeaders();
    const proxy = await getProxyConfig();

    const requestBody = {
      branch: 'main',
      content: file,
      commit_message: message || `Upload ${filename || id}`,
      encoding: 'base64'
    };

    // 如果是更新文件，需要添加 last_commit_id
    if (sha) {
      // 获取文件的最新提交 ID
      const commitsUrl = `${baseUrl}/projects/${projectId}/repository/commits?path=${_path}&per_page=1`;
      const commitsResponse = await fetch(commitsUrl, {
        method: 'GET',
        headers,
        proxy
      });
      
      if (commitsResponse.ok) {
        const commits = await commitsResponse.json() as GitlabCommit[];
        if (commits.length > 0) {
          (requestBody as any).last_commit_id = commits[0].id;
        }
      }
    }

    const url = `${baseUrl}/projects/${projectId}/repository/files/${encodeURIComponent(_path)}`;
    const method = sha ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(requestBody),
      proxy
    });

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      return { data } as GitlabResponse<any>;
    }

    const errorData = await response.json();
    throw {
      status: response.status,
      message: errorData.message || '同步失败'
    } as GitlabError;

  } catch (error) {
    console.error('Gitlab 上传文件失败:', error);
    toast({
      title: '同步失败',
      description: (error as GitlabError).message || '上传文件时发生错误',
      variant: 'destructive',
    });
    throw error;
  }
}

/**
 * 获取 Gitlab 项目文件列表
 * @param params 查询参数
 */
export async function getFiles({ path, repo }: { path: string; repo: RepoNames }) {
  try {
    const store = await Store.load('store.json');
    const projectId = await store.get<string>(`gitlab_${repo}_project_id`);
    
    if (!projectId) {
      throw new Error('项目 ID 未配置');
    }

    const baseUrl = await getGitlabApiBaseUrl();
    const headers = await getCommonHeaders();
    const proxy = await getProxyConfig();

    const url = `${baseUrl}/projects/${projectId}/repository/tree?path=${path}&recursive=true&per_page=100`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      proxy
    });

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json() as GitlabRepositoryFile[];
      return { data } as GitlabResponse<GitlabRepositoryFile[]>;
    }

    const errorData = await response.json();
    throw {
      status: response.status,
      message: errorData.message || '获取文件列表失败'
    } as GitlabError;

  } catch (error) {
    console.error('Gitlab 获取文件列表失败:', error);
    toast({
      title: '获取文件列表失败',
      description: (error as GitlabError).message || '获取文件列表时发生错误',
      variant: 'destructive',
    });
    throw error;
  }
}

/**
 * 删除 Gitlab 项目文件
 * @param params 删除参数
 */
export async function deleteFile({ path, repo }: { path: string; sha?: string; repo: RepoNames }) {
  try {
    const store = await Store.load('store.json');
    const projectId = await store.get<string>(`gitlab_${repo}_project_id`);
    
    if (!projectId) {
      throw new Error('项目 ID 未配置');
    }

    const baseUrl = await getGitlabApiBaseUrl();
    const headers = await getCommonHeaders();
    const proxy = await getProxyConfig();

    // 获取文件的最新提交 ID
    const commitsUrl = `${baseUrl}/projects/${projectId}/repository/commits?path=${path}&per_page=1`;
    const commitsResponse = await fetch(commitsUrl, {
      method: 'GET',
      headers,
      proxy
    });

    let lastCommitId = '';
    if (commitsResponse.ok) {
      const commits = await commitsResponse.json() as GitlabCommit[];
      if (commits.length > 0) {
        lastCommitId = commits[0].id;
      }
    }

    const url = `${baseUrl}/projects/${projectId}/repository/files/${encodeURIComponent(path)}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({
        branch: 'main',
        commit_message: `Delete ${path}`,
        last_commit_id: lastCommitId
      }),
      proxy
    });

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      return { data } as GitlabResponse<any>;
    }

    const errorData = await response.json();
    throw {
      status: response.status,
      message: errorData.message || '删除文件失败'
    } as GitlabError;

  } catch (error) {
    console.error('Gitlab 删除文件失败:', error);
    toast({
      title: '删除文件失败',
      description: (error as GitlabError).message || '删除文件时发生错误',
      variant: 'destructive',
    });
    return null; // 确保在错误情况下也有返回值
  }
}

/**
 * 获取文件提交历史
 * @param params 查询参数
 */
export async function getFileCommits({ path, repo }: { path: string; repo: RepoNames }) {
  try {
    const store = await Store.load('store.json');
    const projectId = await store.get<string>(`gitlab_${repo}_project_id`);
    
    if (!projectId) {
      throw new Error('项目 ID 未配置');
    }

    const baseUrl = await getGitlabApiBaseUrl();
    const headers = await getCommonHeaders();
    const proxy = await getProxyConfig();

    const url = `${baseUrl}/projects/${projectId}/repository/commits?path=${path}&per_page=50`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      proxy
    });

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json() as GitlabCommit[];
      return { data } as GitlabResponse<GitlabCommit[]>;
    }

    const errorData = await response.json();
    throw {
      status: response.status,
      message: errorData.message || '获取提交历史失败'
    } as GitlabError;

  } catch (error) {
    console.error('Gitlab 获取提交历史失败:', error);
    toast({
      title: '获取提交历史失败',
      description: (error as GitlabError).message || '获取提交历史时发生错误',
      variant: 'destructive',
    });
    throw error;
  }
}

/**
 * 获取 Gitlab 用户信息
 * @param token 可选的访问令牌
 */
export async function getUserInfo(token?: string): Promise<GitlabUserInfo> {
  try {
    const store = await Store.load('store.json');
    const accessToken = token || await store.get<string>('gitlabAccessToken');
    
    if (!accessToken) {
      throw new Error('访问令牌未配置');
    }

    const baseUrl = await getGitlabApiBaseUrl();
    const proxy = await getProxyConfig();

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);
    headers.append('Content-Type', 'application/json');

    const response = await fetch(`${baseUrl}/user`, {
      method: 'GET',
      headers,
      proxy
    });

    if (response.status >= 200 && response.status < 300) {
      const userInfo = await response.json() as GitlabUserInfo;
      
      // 保存用户名到存储
      await store.set('gitlabUsername', userInfo.username);
      await store.save();
      
      return userInfo;
    }

    const errorData = await response.json();
    throw {
      status: response.status,
      message: errorData.message || '获取用户信息失败'
    } as GitlabError;

  } catch (error) {
    console.error('Gitlab 获取用户信息失败:', error);
    toast({
      title: '获取用户信息失败',
      description: (error as GitlabError).message || '获取用户信息时发生错误',
      variant: 'destructive',
    });
    throw error;
  }
}

/**
 * 检查同步项目状态
 * @param name 项目名称
 */
export async function checkSyncProjectState(name: string): Promise<GitlabProjectInfo | null> {
  try {
    const store = await Store.load('store.json');
    const gitlabUsername = await store.get<string>('gitlabUsername');
    
    if (!gitlabUsername) {
      throw new Error('用户名未配置');
    }

    const baseUrl = await getGitlabApiBaseUrl();
    const headers = await getCommonHeaders();
    const proxy = await getProxyConfig();

    // 搜索项目
    const searchUrl = `${baseUrl}/projects?search=${name}&owned=true&per_page=10`;
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers,
      proxy
    });

    if (response.status >= 200 && response.status < 300) {
      const projects = await response.json() as GitlabProjectInfo[];
      
      // 查找匹配的项目
      const project = projects.find(p => p.name === name && p.namespace.path === gitlabUsername);
      
      if (project) {
        // 保存项目 ID
        await store.set(`gitlab_${name}_project_id`, project.id.toString());
        await store.save();
      }
      
      return project || null;
    }

    const errorData = await response.json();
    throw {
      status: response.status,
      message: errorData.message || '检查项目状态失败'
    } as GitlabError;

  } catch (error) {
    console.error('Gitlab 检查项目状态失败:', error);
    throw error;
  }
}

/**
 * 创建同步项目
 * @param name 项目名称
 * @param isPrivate 是否私有项目
 */
export async function createSyncProject(name: string, isPrivate: boolean = true): Promise<GitlabProjectInfo | null> {
  try {
    const baseUrl = await getGitlabApiBaseUrl();
    const headers = await getCommonHeaders();
    const proxy = await getProxyConfig();

    const requestBody = {
      name: name,
      path: name,
      description: `note-gen 同步项目 - ${name}`,
      visibility: isPrivate ? 'private' : 'public',
      initialize_with_readme: true,
      default_branch: 'main'
    };

    const response = await fetch(`${baseUrl}/projects`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      proxy
    });

    if (response.status >= 200 && response.status < 300) {
      const project = await response.json() as GitlabProjectInfo;
      
      // 保存项目 ID
      const store = await Store.load('store.json');
      await store.set(`gitlab_${name}_project_id`, project.id.toString());
      await store.save();
      
      return project;
    }

    const errorData = await response.json();
    throw {
      status: response.status,
      message: errorData.message || '创建项目失败'
    } as GitlabError;

  } catch (error) {
    console.error('Gitlab 创建项目失败:', error);
    toast({
      title: '创建项目失败',
      description: (error as GitlabError).message || '创建项目时发生错误',
      variant: 'destructive',
    });
    return null;
  }
}
