"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ApiFlowVisualizer from "../ui/ApiFlowVisualizer";
import Header from "../layout/Header";
import { useToast } from "../ui/ToastProvider"
import Stepslayout from "../layout/Stepslayout";
import Mainlayout from "../layout/Mainlayout";
import { PLACE_ORDER_LABELS, PLACE_ORDER_STEPS } from "../../constant/constant";
import { getSocket } from "../../lib/socket";
import { processQueueNew } from "../../utils/page";
import { createOrder } from "@/app/api/orders/page";

const socket = getSocket()

export default function PlaceOrder({ cart }: { cart: any[] }) {
  const [flowState, setFlowState] = useState<any>(null);
  const router = useRouter();
  const toast = useToast()
  const isEmpty = !cart || cart.length === 0;
  const eventQueueRef = useRef<any[]>([]);
  const isProcessingRef = useRef(false);

//   const processQueue = async () => {
//   if (isProcessingRef.current) return;

//   isProcessingRef.current = true;

//   while (eventQueueRef.current.length > 0) {
//     console.log("Processing event queue, remaining events:", eventQueueRef.current.length);
//     const event : any = eventQueueRef.current.shift()

//     const index = PLACE_ORDER_STEPS.findIndex((s) => s.key === event?.step);

//     if (index === -1) {
//       setFlowState({ status: "error", stepIndex: 0 });
//       continue;
//     }

//     if (index === PLACE_ORDER_STEPS.length - 1) {
//       console.log("Final step reached, updating flow state to success");
//       setFlowState({ status: "success", stepIndex: index });
//       await new Promise((res) => setTimeout(res, 1500)); // final pause
//       toast("Order placed successfully", "success");
//       router.refresh();
//     } else {
//       console.log(`Updating flow state: ${event?.type} (step ${index})`);
//       setFlowState({ status: "loading", stepIndex: index });
//       await new Promise((res) => setTimeout(res, 1000)); // 👈 smooth step delay
//     }
//   }

//   isProcessingRef.current = false;
//  };

  useEffect(() => {
    try {
      socket.on("flow-event", (event : any) => {
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
          steps: PLACE_ORDER_STEPS,
          setFlowState,
          onSuccess: () => {
            toast("Order placed successfully", "success");
            router.refresh();
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

  const handlePlaceOrder = async () => {
    try {
      const data = await createOrder();
      if (data.error) throw new Error();
      toast("Order placed successfully", "success");
    } catch {
      toast("Failed to place order", "error");
    }
  };

  return (
    <Mainlayout>
      <Header title="Order Pipeline" subtitle="Review your items and watch the order flow execute" back={true}/>

      <main className="flex-1 flex flex-col items-center mt-20 px-10 py-8 gap-8">

        {/* Two-column grid */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-6xl">

          {/* LEFT — Cart items */}
          <section className="space-y-3">
            <h2 className="text-xl uppercase tracking-widest text-gray-400 mb-3">Cart</h2>

            {isEmpty ? (
              <div className="flex flex-col gap-3 py-10">
                <p className="text-gray-600 text-sm">Your cart is empty.</p>
                <a
                  href="/"
                  className="text-xs text-orange-500 hover:text-orange-400 underline underline-offset-4 transition-colors w-fit"
                >
                  Browse products
                </a>
              </div>
            ) : (
              <>
                {cart.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#111] border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-200 text-sm">{item.productId}</span>
                      <span className="text-xs text-gray-600">Product ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">qty</span>
                      <span className="text-orange-400 text-sm font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <span className="text-xs text-gray-600">
                    {cart.length} item{cart.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex items-center gap-3">
                    {/* <a
                      href="/orders"
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all"
                    >
                      View Orders
                    </a> */}
                    <button
                      onClick={handlePlaceOrder}
                      disabled={flowState?.status === "loading"}
                      className="
                        px-3 py-1.5 text-xs font-semibold rounded-lg
                        bg-orange-500 text-black
                        hover:bg-orange-400 active:scale-95
                        disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all
                      "
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* RIGHT — Flow visualizer */}
          <section>
            <h2 className="text-xl uppercase tracking-widest text-gray-400 mb-3">Service Details</h2>
            <ApiFlowVisualizer flowState={flowState} steps={PLACE_ORDER_STEPS} />
          </section>
        </div>

        {/* System Flow */}
        <div className="w-full max-w-6xl pt-12">
            <Stepslayout flowState={flowState} STEPS={PLACE_ORDER_STEPS} flowLabels = {PLACE_ORDER_LABELS} />
        </div>

      </main>

      <style>{`
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </Mainlayout>
  );
}