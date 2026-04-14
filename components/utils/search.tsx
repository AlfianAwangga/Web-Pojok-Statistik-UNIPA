export function filterByTitle<T extends { title: string }>(
  data: T[],
  query: string,
): T[] {
  if (!query || query.trim() === "") return data;
  return data.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );
}

export function filterByCategory<T extends { category: string }>(
  data: T[],
  category: string,
): T[] {
  if (!category || category.trim() === "" || category === "Semua Kategori")
    return data;
  return data.filter((item) => item.category === category);
}

export function filterData<T extends { title: string; category: string }>(
  data: T[],
  query: string,
  category: string,
): T[] {
  let result = data;
  result = filterByTitle(result, query);
  result = filterByCategory(result, category);
  return result;
}

export function getUniqueCategories<T extends { category: string }>(
  data: T[],
): string[] {
  const categories = data.map((item) => item.category.trim());
  return ["Semua Kategori", ...Array.from(new Set(categories))];
}
