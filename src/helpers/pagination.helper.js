const paginationHandler = (paginationObject, totalPage, query) => {
  paginationObject.totalPage = Math.ceil(totalPage / paginationObject.limitPage);

  if (query.page) {
    paginationObject.currentPage = Number(query.page);
    if (query.limit) paginationObject.limitPage = Number(query.limit);
    paginationObject.offset = Number(
      (paginationObject.currentPage - 1) * paginationObject.limitPage
    );
  }

  return paginationObject;
};

module.exports = paginationHandler;
