import { apiFetch } from "../../apiClient";

export const login = async (email: string, password: string) => {
  const data = await apiFetch(process.env.NEXT_PUBLIC_AUTH_SERVICE_URL + "/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // store token in cookie
  if (data.token) {
    document.cookie = `token=${data.token}; path=/`;
  }

  return data;
};

