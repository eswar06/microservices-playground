import { apiFetch } from "../../apiClient";

export const signup = (email: string, password: string) => {
  return apiFetch(process.env.NEXT_PUBLIC_AUTH_SERVICE_URL + "/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};