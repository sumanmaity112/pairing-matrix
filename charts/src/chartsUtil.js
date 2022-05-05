export const createD3Matrix = (authors, data) => {
  const index = new Map(authors.map((name, i) => [name, i]));
  const matrix = Array.from(index, () => new Array(authors.length).fill(0));

  for (const { author, coAuthor, times } of data) {
    matrix[index.get(author)][index.get(coAuthor)] += times;
  }

  return matrix;
};
