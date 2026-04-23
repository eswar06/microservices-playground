import { cookies } from "next/headers";
import PlaceOrder from "../../components/features/PlaceOrder";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

async function getCart() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const url = process.env.CART_SERVICE_URL;
  const res = await fetch(url + "/cart", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Cart API error response:", text);
    return null;
  }

  console.log("Cart API response status:", res.status);

  return res.json();
}

export default async function CartPage() {
  const token = (await cookies()).get("token");
  
    if (!token) {
      redirect("/login");
    }
  
  const res = await getCart();
  let cart: any[] = [];

  if (!res || res.message) {
    cart = [];
  } else {
    cart = res;
  }
  console.log("Cart data:", cart);
  return <PlaceOrder cart={cart} />;
}