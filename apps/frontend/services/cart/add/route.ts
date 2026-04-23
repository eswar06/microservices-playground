import { apiFetch } from "../../apiClient";

export const addToCart = (productId: string, quantity: number) => {
  const url = process.env.NEXT_PUBLIC_CART_SERVICE_URL ;
  return apiFetch(url + "/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
};