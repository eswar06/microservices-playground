import { apiFetch } from "../apiClient";

export const createOrder = () => {
  return apiFetch(process.env.NEXT_PUBLIC_ORDER_SERVICE_URL + "/orders", {
    method: "POST",
  });
};