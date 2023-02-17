import { IHTTPErrorResponse } from "./error-response";

export enum HTTPRequestMethod {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

interface IHTTPRequestOptions<Body = unknown> {
    method: HTTPRequestMethod,
    body?: Body,
    queryParams?: object,
    headers?: object,
}

export function httpRequest<ResponseData = unknown>(url: string, options: IHTTPRequestOptions): Promise<ResponseData> {
    const DefaultHeaders = {['Content-Type']: 'application/json'};

    if (options.queryParams) {
        url = url + '?' + new URLSearchParams(options.queryParams as Record<string, string>);
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: options.method,
            headers: {...DefaultHeaders, ...options.headers},
            body: JSON.stringify(options.body),
        }).then(async (res: Response | IHTTPErrorResponse) => {
            if (res.ok) {
                try {
                    const data: ResponseData = res.json && await res.json();
                    resolve(data);
                } catch (e) {
                    resolve(undefined as ResponseData);
                }
            } else {
                reject({
                    ...res,
                    error: await res.json()
                } as IHTTPErrorResponse);
            }
        })
    });
}
