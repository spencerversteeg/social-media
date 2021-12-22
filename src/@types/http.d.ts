export type HttpResponse = {
  status: 'success' | 'error';
  data?: unknown | null;
  field?: unknown | null;
};
