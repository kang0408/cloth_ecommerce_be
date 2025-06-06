interface ISortOptions {
  sortBy?: string;
  sortValue?: string;
}

const sortHandler = (sortOptions: ISortOptions) => {
  const { sortBy, sortValue } = sortOptions;

  const sort: { [key: string]: any } = {};
  if (sortBy) sort[sortBy] = sortValue === "asc" ? 1 : -1;

  return sort;
};

export default sortHandler;
