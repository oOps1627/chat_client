export interface IHttpErrorResponse extends Response {
   error: {
       statusCode: number;
       message?: string;
   }
}

export const getErrorMessage = (response: IHttpErrorResponse): string => {
    return response.error.message || response.statusText;
}
