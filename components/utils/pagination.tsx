export function getPaginatedData<T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number,
): T[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return data.slice(startIndex, startIndex + itemsPerPage);
}

export function getTotalPages(
  totalItems: number,
  itemsPerPage: number,
): number {
  return Math.ceil(totalItems / itemsPerPage);
}
