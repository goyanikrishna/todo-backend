export interface ErrorType {
  name: string;
  message: string;
  status: number;
  isPublic: boolean;
  isError: boolean;
}

export interface ResponseType {
  message: string;
  status: number;
  data: any;
}

export interface SearchString {
  searchString?: string;
}