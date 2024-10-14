import { getClient, Body } from '@tauri-apps/api/http';

const key = import.meta.env.VITE_APP_IMAGE_KEY

const client = await getClient();

const baseUrl = 'https://sm.ms/api/v2';

interface HistoryData {
  success: boolean;
  code: string;
  message: string;
  data: ImageData[];
  CurrentPage: number;
  TotalPages: number;
  PerPage: number;
  Count: number;
  RequestId: string;
}

export interface ImageData {
  width: number;
  height: number;
  filename: string;
  storename: string;
  size: number;
  path: string;
  hash: string;
  created_at: string;
  url: string;
  delete: string;
  page: string;
}


function getHistory() {
  return client.request<HistoryData>({
    method: 'GET',
    url: `${baseUrl}/upload_history`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: key,
    }
  });
}

async function uploadImage(blob: Blob) {
  const form = new FormData();
  form.append('smfile', blob);
  const formBody = Body.form(form);

  try {
    try {
      const res = await client.request<HistoryData>({
        method: 'POST',
        url: `${baseUrl}/upload`,
        body: formBody,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: key,
        },
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  } finally {
    console.log('end');
  }
}

export { getHistory, uploadImage }