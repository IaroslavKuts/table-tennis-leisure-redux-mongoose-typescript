const generateNumber = (): string => {
  return Array<number>(10)
    .fill(0)
    .map((_) => Math.floor(Math.random() * 10))
    .join("");
};

export const number_functions = { generateNumber };
