//

import axios from "axios";
import {
  AxiosRequestConfig,
  AxiosResponse
} from "axios";
import {
  RECAPTCHA_KEY
} from "/client/variable";
import {
  ProcessName,
  RequestData,
  ResponseData,
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";


let client = axios.create({timeout: 10000, validateStatus: () => true});

export async function request<N extends ProcessName>(name: N, data: Omit<RequestData<N>, "recaptchaToken">, config: RequestConfigWithRecaptcha): Promise<AxiosResponseSpec<N>>;
export async function request<N extends ProcessName>(name: N, data: RequestData<N>, config?: RequestConfig): Promise<AxiosResponseSpec<N>>;
export async function request<N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
  let url = SERVER_PATH_PREFIX + SERVER_PATHS[name];
  let method = "post" as const;
  if (config.useRecaptcha) {
    let action = (typeof config.useRecaptcha === "string") ? config.useRecaptcha : name;
    let recaptchaToken = await grecaptcha.execute(RECAPTCHA_KEY, {action});
    if (data !== undefined) {
      if (data instanceof FormData) {
        data.append("recaptchaToken", recaptchaToken);
      } else {
        data = {...data, recaptchaToken};
      }
    }
  }
  let response = await (async () => {
    try {
      return await client.request({url, method, ...config, data});
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        let data = undefined as any;
        return {status: 408, statusText: "Request Timeout", headers: {}, data, config};
      } else {
        throw error;
      }
    }
  })();
  return response;
}

export async function requestFile<N extends ProcessName>(name: N, data: WithFile<Omit<RequestData<N>, "recaptchaToken">>, config: RequestConfigWithRecaptcha): Promise<AxiosResponseSpec<N>>;
export async function requestFile<N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config?: RequestConfig): Promise<AxiosResponseSpec<N>>;
export async function requestFile<N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
  let formData = new FormData() as any;
  for (let [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  let nextConfig = {...config, timeout: 0};
  let response = await request(name, formData, nextConfig);
  return response;
}

export function determineErrorPopupType(response: AxiosResponse<any>): string {
  let status = response.status;
  let body = response.data;
  if (status === 400) {
    if (typeof body === "object" && "error" in body && "type" in body && typeof body.type === "string") {
      return body.type;
    } else {
      return "messageNotFound";
    }
  } else if (status === 401) {
    return "unauthenticated";
  } else if (status === 403) {
    if (typeof body === "object" && "error" in body && "type" in body && typeof body.type === "string") {
      return body.type;
    } else {
      return "forbidden";
    }
  } else if (status === 404) {
    return "serverNotFound";
  } else if (status === 408) {
    return "requestTimeout";
  } else if (status === 500 || status === 503) {
    return "serverError";
  } else if (status === 504) {
    return "serverTimeout";
  } else {
    return "unexpected";
  }
}

type AdditionalRequestConfig = {
  ignoreError?: boolean,
  useRecaptcha?: boolean | string
};
export type RequestConfig = AxiosRequestConfig & AdditionalRequestConfig;
export type RequestConfigWithRecaptcha = RequestConfig & {useRecaptcha: true | string};
export type WithFile<T> = T & {file: Blob} & {[key: string]: string | Blob};
export type AxiosResponseSpec<N extends ProcessName> = AxiosResponse<ResponseData<N>>;