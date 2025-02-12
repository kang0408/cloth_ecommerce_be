const sortHandler = (sortOptions) => {
  const { sortBy, sortValue } = sortOptions;

  const sort = {};
  if (sortBy) sort[sortBy] = sortValue === "asc" ? 1 : -1;

  return sort;
};

module.exports = sortHandler;
