export interface Pagination {
  page: number;
  size: number;
}

interface PaginatedResponseOptions<T> {
  items: T[];
  total: number;
  pagination: Pagination;
  query?: Record<string, any>;
}

export function buildPaginatedResponse<T>({
  items,
  total,
  pagination,
  query = {},
}: PaginatedResponseOptions<T>) {
  const { page, size } = pagination;
  const pageCount = Math.ceil(total / size);
  const isFirstPage = page <= 1;
  const isLastPage = page >= pageCount;

  const buildLink = (targetPage: number) => {
    const params = new URLSearchParams({
      ...query,
      page: targetPage.toString(),
      pageSize: size.toString(),
    });
    return `${process.env.BASE_URL}?${params.toString()}`;
  };

  return {
    items,
    meta: {
      pageSize: size,
      pageCount,
      itemCount: total,
      previousPage: isFirstPage ? undefined : page - 1,
      nextPage: isLastPage ? undefined : page + 1,
    },
    links: {
      self: buildLink(page),
      prev: isFirstPage ? undefined : buildLink(page - 1),
      next: isLastPage ? undefined : buildLink(page + 1),
    },
  };
}
