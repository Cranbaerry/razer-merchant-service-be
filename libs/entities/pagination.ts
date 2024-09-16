export interface PaginationRequest {
  limit: number;
  page: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  resources: T[];
  meta: PaginatedMeta;
}

export interface PaginatedMeta {
  page: number;
  search?: string;
  totalPages: number;
  totalResources: number;
}
