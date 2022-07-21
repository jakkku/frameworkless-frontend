export type Params = {
  url: string;
  body?: any;
  headers?: Headers;
  method?: Method;
};
type Headers = { [key: string]: string };
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface HttpClient {
  get: HttpRequest;
  post: HttpRequest;
  put: HttpRequest;
  patch: HttpRequest;
  delete: HttpRequest;
}
type HttpRequest = <T>(params: Params) => Promise<T>;

class Http {
  constructor(private httpClient: HttpClient) {}

  get<T>(params: Params) {
    return this.httpClient.get<T>(params);
  }
  post<T>(params: Params) {
    return this.httpClient.post<T>(params);
  }
  put<T>(params: Params) {
    return this.httpClient.put<T>(params);
  }
  patch<T>(params: Params) {
    return this.httpClient.patch<T>(params);
  }
  delete<T>(params: Params) {
    return this.httpClient.delete<T>(params);
  }
}

export default Http;
