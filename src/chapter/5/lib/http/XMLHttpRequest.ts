type Params = {
  url: string;
  body?: any;
  headers?: Headers;
  method?: Method;
};
type Headers = { [key: string]: string };
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type Response<T> = {
  status: number;
  data: T;
};

const setHeaders = (xhr: XMLHttpRequest, headers: Headers) => {
  Object.entries(headers).forEach((header) => {
    const [name, value] = header;

    xhr.setRequestHeader(name, value);
  });
};

const parseResponse = (xhr: XMLHttpRequest) => {
  const { status, responseText } = xhr;

  let data;
  if (status !== 204) {
    data = JSON.parse(responseText);
  }

  return { status, data };
};

const request = <T>({ method = "GET", url, headers = {}, body }: Params) => {
  return new Promise<Response<T>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    setHeaders(xhr, headers);

    xhr.send(JSON.stringify(body));

    xhr.onerror = () => {
      reject(new Error("HTTP Error"));
    };

    xhr.ontimeout = () => {
      reject(new Error("Timeout Error"));
    };

    xhr.onload = () => resolve(parseResponse(xhr));
  });
};

const get = async (url: string, headers?: Headers) => {
  const response = await request({ url, headers });
  return response.data;
};

const post = async (url: string, body: any, headers?: Headers) => {
  const response = await request({ url, headers, method: "POST", body });
  return response.data;
};

const put = async (url: string, body: any, headers?: Headers) => {
  const response = await request({ url, headers, method: "PUT", body });
  return response.data;
};

const patch = async (url: string, body: any, headers: Headers) => {
  const response = await request({ url, headers, method: "PATCH", body });
  return response.data;
};

const deleteRequest = async (url: string, headers: Headers) => {
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
