import { apiFetch } from "../../../services/apiClient";

export const addToCart = (productId: string, quantity: number) => {
  return apiFetch(process.env.NEXT_PUBLIC_CART_SERVICE_URL + "/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
};