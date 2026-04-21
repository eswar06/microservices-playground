"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ApiFlowVisualizer from "../components/ui/ApiFlowVisualizer";
import Header from "../components/layout/Header";
import { useToast } from "../components/ui/ToastProvider";
import Stepslayout from "../components/layout/Stepslayout";
import Mainlayout from "../components/layout/Mainlayout";
import { LOGIN_STEPS, LOGIN_FLOW_LABELS } from "../constant/constant";
import Button from "../components/ui/Button";
import { getSocket } from "../lib/socket";
import { processQueueNew } from "../utils/page";
import { login } from "../api/auth/login/page";

const socket = getSocket();

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [flowState, setFlowState] = useState<any>(null);
  const [proceed, setProceed] = useState(false);

  const eventQueueRef = useRef<any[]>([]);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    try {
      socket.on("flow-event", (event: any) => {
        console.log("FLOW EVENT:", event);
        if (event.type !== "FLOW_STEP") {
          console.warn("Received event without type:", event);
          return;
        }

        eventQueueRef?.current?.push(event);
        processQueueNew({
          eventQueueRef : eventQueueRef,
          isProcessingRef : isProcessingRef,
          steps: LOGIN_STEPS,
          setFlowState,
          onSuccess: () => {
            toast("User logged in successfully", "success");
            setProceed(true);
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

  const handleLogin = async () => {
    setError("");
    setFlowState({ status: "loading", stepIndex: 0 });

    try {
      const data = await login(email, password);

      if (data.error) {
        setError(data.message || "Authentication failed");
        return;
      }
    } catch {
      setError("Something went wrong");
      setFlowState((prev: any) => ({ ...prev, status: "error" }));
      toast("Login failed", "error");
    }
  };

  const isLoading = flowState?.status === "loading";

  return (
    <Mainlayout>
      {/* Header */}
      <Header
        title="Auth Gateway"
        subtitle="Observe your credentials flow through the system"
      />

      {/* Main */}
      <main className="flex-1 flex flex-col items-center mt-20 px-10 py-8 gap-8">
        <div className="flex justify-center items-center py-3">
          {proceed ? (
            <Button onClick={() => router.push("/")} variant="success">
              Proceed to Dashboard
            </Button>
          ) : (
            <div></div>
          )}
        </div>
        {/* Two-column grid */}
        
        <div className="grid grid-cols-2 gap-6 w-full max-w-6xl">
          {/* LEFT — Login form */}
          <section className="space-y-3">
            <h2 className="text-xl uppercase tracking-widest text-gray-400 mb-3">
              Login
            </h2>

            <div className="bg-[#111] border border-gray-800 rounded-xl px-6 py-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-[#0B0B0B] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 uppercase tracking-widest">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#0B0B0B] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="
                  w-full px-4 py-2.5 text-xs font-semibold rounded-lg
                  bg-orange-500 text-black
                  hover:bg-orange-400 active:scale-95
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all mt-2
                "
              >
                {isLoading ? "Authenticating..." : "Login"}
              </button>

              <p className="text-xs text-gray-600 text-center pt-1">
                No access yet?{" "}
                <span
                  onClick={() => router.push("/signup")}
                  className="text-orange-500 cursor-pointer hover:text-orange-400 transition-colors"
                >
                  Signup
                </span>
              </p>
            </div>
          </section>

          {/* RIGHT — Flow visualizer */}
          <section>
            <h2 className="text-xl uppercase tracking-widest text-gray-400 mb-3">
              Service Details
            </h2>
            <ApiFlowVisualizer flowState={flowState} steps={LOGIN_STEPS} />
          </section>
        </div>

        {/* System Flow */}

        <div className="w-full max-w-6xl pt-6">
          <Stepslayout
            flowState={flowState}
            STEPS={LOGIN_STEPS}
            flowLabels={LOGIN_FLOW_LABELS}
          />
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
