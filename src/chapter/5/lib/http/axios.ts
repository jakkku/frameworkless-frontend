import axios from "axios";

import { Params } from ".";

type Headrs = Params["headers"];

const request = async (params: Params) => {
  const { method = "GET", url, headers = {}, body } = params;
  const config = {
    url,
    headers,
    method,
    data: body,
  };

  return axios(config);
};

const get = async <T>(url: string, headers?: Headrs): Promise<T> => {
  const response = await request({ url, headers });
  return response.data;
};

const post = async <T>(
  url: string,
  headers?: Headrs,
  body?: any
): Promise<T> => {
  const response = await request({ url, headers, method: "POST", body });
  return response.data;
};

const put = async <T>(
  url: string,
  headers?: Headrs,
  body?: any
): Promise<T> => {
  const response = await request({ url, headers, method: "PUT", body });
  return response.data;
};

const patch = async <T>(
  url: string,
  headers?: Headrs,
  body?: any
): Promise<T> => {
  const response = await request({ url, headers, method: "PATCH", body });
  return response.data;
};

const deleteRequest = async <T>(url: string, headers?: Headrs): Promise<T> => {
  const response = await request({ url, headers, method: "DELETE" });
  return response.data;
};

export default {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
};
