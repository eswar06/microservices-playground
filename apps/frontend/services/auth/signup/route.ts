import { apiFetch } from "../../apiClient";

export const signup = (email: string, password: string) => {
  const url = typeof window === "undefined"
    ? process.env.AUTH_SERVICE_URL
    : process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
  return apiFetch(url + "/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};