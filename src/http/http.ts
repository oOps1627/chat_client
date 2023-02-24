import { IHttpErrorResponse } from "./error-response";
import { IHttpInterceptor } from "./inteerceptor";

export interface IRequestOptions {
    headers?: HeadersInit;
    queryParams?: object;
    body?: any;
}

class Http {
    private _interceptors: IHttpInterceptor[] = [];

    get<T = unknown>(url: string, options?: Omit<IRequestOptions, 'body'>): Promise<T> {
        const request = this._createRequest(this._buildURLWithQueryParams(url, options?.queryParams), {
            headers: options?.headers,
            method: 'GET'
        });

        return this._handleRequest(request);
    }

    post<T = unknown>(url: string, options?: IRequestOptions): Promise<T> {
        const request = this._createRequest(url, {
            headers: options?.headers,
            body: this._normalizeBody(options?.body),
            method: 'POST'
        });

        return this._handleRequest(request);
    }

    put<T = unknown>(url: string, options?: IRequestOptions): Promise<T> {
        const request = this._createRequest(url, {
            headers: options?.headers,
            method: 'PUT'
        });

        return this._handleRequest(request);
    }

    delete<T = unknown>(url: string, options?: Omit<IRequestOptions, 'body'>): Promise<T> {
        const request = this._createRequest(url, {
            headers: options?.headers,
            method: 'DELETE'
        });

        return this._handleRequest(request);
    }

    useMiddleware(interceptor: IHttpInterceptor): void {
        this._interceptors.push(interceptor);
    }

    private _buildURLWithQueryParams(url: string, queryParams?: object): string {
        if (queryParams) {
            return url + '?' + new URLSearchParams(queryParams as Record<string, string>);
        }

        return url;
    }

    private _createRequest(url: string, options: RequestInit): Request {
        const defaultHeaders = new Headers({
            ['Content-Type']: 'application/json'
        });

        return new Request(url, {
            ...options,
            headers: options.headers ?? defaultHeaders,
        })
    }

    private _normalizeBody(body: any): string {
        if (typeof body === 'object') {
            return JSON.stringify(body);
        }

        return body;
    }

    private async _handleRequest<T>(request: Request): Promise<T> {
        let currentInterceptorIndex = 0;

        const handleInterceptor = (): Promise<any> => {
            const currentInterceptor = this._interceptors[currentInterceptorIndex];

            if (!currentInterceptor) {
                return this._send(request);
            }

            currentInterceptorIndex++;

            return currentInterceptor.intercept(request, (newRequest) => {
                request = newRequest;
                return handleInterceptor();
            });
        }

        return handleInterceptor();
    }

    private _send<T>(request: Request): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            return fetch(request).then((response: Response | IHttpErrorResponse) => {
                if (response.ok) {
                    this._transformSuccessResponse<T>(response).then(resolve);
                } else {
                    this._transformErrorResponse<IHttpErrorResponse>(response).then(reject);
                }
            })
        });
    }

    private async _transformSuccessResponse<T>(response: Response): Promise<T> {
        try {
            return (await response.json() as T);
        } catch (e) {
            console.error(e);
            return (undefined as T);
        }
    }

    private async _transformErrorResponse<T>(response: Response): Promise<IHttpErrorResponse> {
        return {
            ...response,
            error: await response.json()
        }
    }
}

export const restApi = new Http();
