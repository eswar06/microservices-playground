import { apiFetch } from "../../apiClient";

export const signup = (email: string, password: string) => {
  const url =  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL
  return apiFetch(url + "/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};