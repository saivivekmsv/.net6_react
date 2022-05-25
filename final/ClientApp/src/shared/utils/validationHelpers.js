export const required = (value) => {
  return [undefined, null, ""].includes(value) ? "Required" : undefined;
};

export const requiredNumber = (value) => {
  return [undefined, null, "", 0].includes(value) ? "Required" : undefined;
};
