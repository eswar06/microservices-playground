//products page
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddProduct from "../components/features/AddProduct";

export const dynamic = "force-dynamic";

async function fetchProducts() {
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL + "/products", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export default async function Home() {
  const token = (await cookies()).get("token");

  if (!token) {
    redirect("/welcome");
  }

  const res = await fetchProducts();

  let products: any[] = [];

  if (!res || res.message) {
    products = [];
  } else {
    products = res;
  }

  return(
    <>
      <AddProduct products={products} />;
    </>
  ) 
  
}