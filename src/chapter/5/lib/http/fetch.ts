import { Params } from ".";

type Headers = Params["headers"];

const parseResponse = async <T>(response: Response) => {
  const { status } = response;
  let data: T | undefined;

  if (status !== 204) {
    data = await response.json();
  }

  return { status, data };
};

const request = async <T>(params: Params) => {
  const { method = "GET", url, headers = {}, body } = params;
  const config: RequestInit = { method, headers: new window.Headers(headers) };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  return parseResponse<T>(response);
};

const get = async <T>(url: string, body?: any, headers?: Headers) => {
  const response = await request<T>({ url, headers, body });
  return response.data;
};

const post = async <T>(url: string, body?: any, headers?: Headers) => {
  const response = await request<T>({ url, headers, method: "POST", body });
  return response.data;
};

const put = async <T>(url: string, body?: any, headers?: Headers) => {
  const response = await request<T>({ url, headers, method: "PUT", body });
  return response.data;
};

const patch = async <T>(url: string, body?: any, headers?: Headers) => {
  const response = await request<T>({ url, headers, method: "PATCH", body });
  return response.data;
};

const deleteRequest = async <T>(url: string, headers?: Headers) => {
  const response = await request<T>({ url, headers, method: "DELETE" });
  return response.data;
};

export default {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
};
