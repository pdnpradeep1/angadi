import { jwtDecode } from "jwt-decode"; // Named import, not default

export const getRolesFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken?.roles || []; // Adjust based on your JWT structure
  } catch (error) {
    console.error("Invalid token", error);
    return [];
  }
};
