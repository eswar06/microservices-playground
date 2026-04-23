import { apiFetch } from "../apiClient";

export const createOrder = () => {
  const url =  process.env.ORDER_SERVICE_URL
  return apiFetch(url + "/orders", {
    method: "POST",
  });
};