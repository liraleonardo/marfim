export interface IAppError {
  code: string;
  message: string;
}

export interface IHttpError {
  title: string;
  redirect: {
    action?: string;
    to: string;
  };
}

export interface IHttpErrors {
  [name: string]: IHttpError;
}

export interface IErrorState {
  status: string | number;
  title: string;
  messages: string[];
  isPageError?: boolean;
}
