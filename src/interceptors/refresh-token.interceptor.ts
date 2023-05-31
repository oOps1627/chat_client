import { IHttpInterceptor } from "../http/inteerceptor";
import { IHttpErrorResponse } from "../http/error-response";
import { restApi } from "../http/http";

export const SKIP_REFRESH_TOKEN_INTERCEPTOR_HEADER = 'SKIP_REFRESH_TOKEN';

export class RefreshTokenInterceptor implements IHttpInterceptor {
    intercept<T>(request: Request, next: (request: Request) => Promise<T>): Promise<T> {

        if (request.headers.has(SKIP_REFRESH_TOKEN_INTERCEPTOR_HEADER)) {
            return next(request);
        }

        return new Promise<T>((resolve, reject) => {
            next(request)
                .then((res => {
                    resolve(res);
                }))
                .catch((error: IHttpErrorResponse) => {
                    if (error.error.statusCode === 401) {
                       this._refreshTokenRequest()
                            .then(() => {
                                const newRequest: Request = request.clone();
                                newRequest.headers.append(SKIP_REFRESH_TOKEN_INTERCEPTOR_HEADER, 'true');
                                next(newRequest).then(resolve).catch(reject);
                            })
                            .catch(() => reject(error));
                    } else {
                        reject(error);
                    }
                });
        })
    }

    private _refreshTokenRequest(): Promise<void> {
        return restApi.post(`${process.env.REACT_APP_API_HOST}/auth/refresh`,{
            headers: {[SKIP_REFRESH_TOKEN_INTERCEPTOR_HEADER]: 'true'}
        })
    }
}
