export const apiDetails = {
  baseUrl: process.env.REACT_APP_API_BASE_URL,
  // baseUrl: "http://localhost:8080/api",
};

export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
