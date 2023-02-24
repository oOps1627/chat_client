export interface IHttpInterceptor {
    intercept<T>(request: Request, next: (request: Request) => Promise<T>): Promise<T>;
}
