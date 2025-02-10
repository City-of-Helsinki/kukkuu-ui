export type FilterValues = {
  date?: string;
  time?: string;
};

type Option = {
  key: string;
  label: string;
  value: string;
};

export type FilterOptions = {
  dates: Option[];
  times: Option[];
};
