import { apiFetch } from "../apiClient";

export const createOrder = () => {
  const url = typeof window === "undefined"
    ? process.env.ORDER_SERVICE_URL
    : process.env.NEXT_PUBLIC_ORDER_SERVICE_URL;
  return apiFetch(url + "/orders", {
    method: "POST",
  });
};