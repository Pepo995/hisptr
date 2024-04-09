export type SelectOption = {
  value: string;
  label: string;
};

export type FilterAndPagination = {
  page: number;
  per_page: number;
  search?: string;
  type?: string;
  sort_field?: string;
  sort_order?: "desc" | "asc";
  duration?: string;
};

export type SelectItem = {
  label: string;
  value: string;
};

export type SelectNumericOption = { label: string; value: number };
