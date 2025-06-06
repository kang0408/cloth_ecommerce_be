interface IPaginationObject {
  currentPage: number;
  limitPage: number;
  totalPage?: number;
  offset?: number;
}

interface IQuery {
  page?: number;
  limit?: number;
}

const paginationHandler = (
  paginationObject: IPaginationObject,
  totalPage: number,
  query: IQuery
): IPaginationObject => {
  if (query.page) {
    paginationObject.currentPage = Number(query.page);
  }
  if (query.limit) {
    paginationObject.limitPage = Number(query.limit);
  }

  paginationObject.totalPage = Math.ceil(totalPage / paginationObject.limitPage);

  paginationObject.offset = Number((paginationObject.currentPage - 1) * paginationObject.limitPage);

  return paginationObject;
};

export default paginationHandler;
