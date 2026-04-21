//products page
"use client";

import { useEffect, useRef, useState } from "react";
import ApiFlowVisualizer from "../ui/ApiFlowVisualizer";
import Header from "../layout/Header";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/ToastProvider"
import Stepslayout from "../layout/Stepslayout";
import Mainlayout from "../layout/Mainlayout";
import { CART_LABELS, CART_STEPS } from "../../constant/constant";
import { getSocket } from "../../lib/socket";
import { processQueueNew } from "../../utils/utils"
import { addToCart } from "@/services/cart/add/route";

const socket = getSocket();

export default function AddProduct({ products }: { products: any[] }) {
  const [flowState, setFlowState] = useState<any>(null);
  const router = useRouter();
  const toast = useToast();

  const eventQueueRef = useRef<any[]>([]);
  const isProcessingRef = useRef(false);

  const processQueue = async () => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    while (eventQueueRef.current.length > 0) {
      console.log(
        "Processing event queue, remaining events:",
        eventQueueRef.current.length,
      );
      const event: any = eventQueueRef.current.shift();

      const index = CART_STEPS.findIndex((s) => s.key === event?.step);

      if (index === -1) {
        setFlowState({ status: "error", stepIndex: 0 });
        continue;
      }

      if (index === CART_STEPS.length - 1) {
        console.log("Final step reached, updating flow state to success");
        setFlowState({ status: "success", stepIndex: index });
        await new Promise((res) => setTimeout(res, 1500)); // final pause
        toast("Product added successfully", "success");
        router.refresh();
      } else {
        console.log(`Updating flow state: ${event?.type} (step ${index})`);
        setFlowState({ status: "loading", stepIndex: index });
        await new Promise((res) => setTimeout(res, 1000)); // 👈 smooth step delay
      }
    }

    isProcessingRef.current = false;
  };

  useEffect(() => {
    try {
      socket.on("flow-event", (event: any) => {
        console.log("FLOW EVENT:", event);
        if (event.type !== "FLOW_STEP") {
          console.warn("Received event without type:", event);
          return;
        }

        eventQueueRef?.current?.push(event);
        // processQueue();
        processQueueNew({
          eventQueueRef : eventQueueRef,
          isProcessingRef : isProcessingRef,
          steps: CART_STEPS,
          setFlowState,
          onSuccess: () => {
            toast("Product added successfully", "success");
            // router.refresh();
          },
        })
      });
    } catch (err) {
      console.error("Socket connection error:", err);
      toast("Real-time updates unavailable", "error");
    } finally {
      return () => {
        socket.off("flow-event");
      };
    }
  }, []);

  const handleAddToCart = async (productId: string, quantity: number) => {
    setFlowState({ status: "loading", stepIndex: 0 });

    try {
      // const res = await fetch("/api/cart/add", {
      //   method: "POST",
      //   body: JSON.stringify({ productId, quantity }),
      // });
      const data = await addToCart(productId, quantity);
      if (data.error) throw new Error();
      else {
        console.log("Add to cart request successful, waiting for flow events...");
      }
    } catch {
      toast("Failed to add item to cart", "error");
    }
  };

  return (
    <Mainlayout>
      {/* ── Header ── */}
      <Header
        title="System Playground"
        subtitle="Trigger backend services and observe system flow"
      />

      {/* ── Main — centered, condensed ── */}
      <main className="flex-1 flex flex-col items-center mt-20 px-10 py-8 gap-8">
        {/* Two-column content block — constrained width */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-6xl">
          {/* LEFT — Product list */}
          <section className="space-y-3">
            <h2 className="text-xl uppercase tracking-widest text-gray-400 mb-3">
              Products
            </h2>
            {products.length === 0 && (
              <p className="text-gray-600 text-sm">No products available.</p>
            )}
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-[#111] border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-600 transition-colors"
              >
                <span className="text-gray-200 text-sm ">{p.name}</span>
                <button
                  onClick={() => handleAddToCart(p.id, 1)}
                  disabled={flowState?.status === "loading"}
                  className="
                    px-3 py-1.5 text-xs font-semibold rounded-lg
                    bg-orange-500 text-black
                    hover:bg-orange-400 active:scale-95
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all
                  "
                >
                  Add to Cart
                </button>
              </div>
            ))}
            <div className="pt-2">
              <Button onClick={() => router.push("./cart")}>Go to Cart</Button>
            </div>
          </section>

          {/* RIGHT — API Flow Visualizer */}
          <section>
            <h2 className="text-xl uppercase tracking-widest text-gray-400 mb-3">
              Service Details
            </h2>
            <ApiFlowVisualizer flowState={flowState} steps={CART_STEPS} />
          </section>
        </div>

        {/* ── System Flow — centered, same width as grid ── */}
        <div className="w-full max-w-6xl pt-6">
          <Stepslayout
            flowState={flowState}
            STEPS={CART_STEPS}
            flowLabels={CART_LABELS}
          />
        </div>
      </main>

      {/* Spin keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </Mainlayout>
  );
}
