export interface IHTTPErrorResponse extends Response {
   error: {
       statusCode: number;
       message?: string;
   }
}

export const getErrorMessage = (response: IHTTPErrorResponse): string => {
    return response.error.message || response.statusText;
}