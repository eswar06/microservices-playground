"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Mainlayout from "../components/layout/Mainlayout";
import Header from "../components/layout/Header";

const SERVICES = [
  { name: "Auth Service",    desc: "JWT login & signup",           proto: "REST",        color: "#f97316" },
  { name: "Product Service", desc: "Stateless product catalog",    proto: "REST",        color: "#fb923c" },
  { name: "Cart Service",    desc: "User cart + event consumer",   proto: "REST + AMQP", color: "#fdba74" },
  { name: "Order Service",   desc: "Order creation + publisher",   proto: "REST + AMQP", color: "#fed7aa" },
];

const FLOWS = [
  { label: "Add to Cart",  steps: ["Client", "API Gateway", "Cart Service", "RabbitMQ", "Order Service"] },
  { label: "Place Order",  steps: ["Client", "API Gateway", "Order Service", "RabbitMQ", "Cart Service"] },
  { label: "Auth",         steps: ["Client", "API Gateway", "Auth Service", "Database", "JWT", "Session"] },
];

const STACK = [
  { layer: "Frontend",       items: ["Next.js", "React 18", "Tailwind CSS"] },
  { layer: "Backend",        items: ["Node.js", "Express.js", "RabbitMQ"] },
  { layer: "Infrastructure", items: ["Docker", "JWT", "bcrypt"] },
];

function AnimatedFlow({ steps }: { steps: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => (p + 1) % steps.length);
    }, 700);
    return () => clearInterval(t);
  }, [steps.length]);

  return (
    <div className="flex items-center gap-0 flex-wrap">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <span
            className="text-xs px-2 py-0.5 rounded border transition-all duration-300"
            style={{
              borderColor: active === i ? "#f97316" : "#374151",
              color: active === i ? "#f97316" : "#6b7280",
              boxShadow: active === i ? "0 0 8px rgba(249,115,22,0.4)" : "none",
            }}
          >
            {s}
          </span>
          {i < steps.length - 1 && (
            <span className="text-gray-700 mx-0.5 text-xs">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
      <Mainlayout>
      {/* Grid texture overlay */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── Nav ── */}
        <Header title="Services Playground" subtitle="Visualizing microservices in real-time"/>

        {/* ── Hero ── */}
        <section className="flex flex-col items-center justify-center text-center px-10 pt-28 pb-20">
          <div
            className="text-sm uppercase tracking-[0.3em] text-orange-500 mb-6 opacity-0"
            style={{ animation: mounted ? "fadeUp 0.6s ease 0.1s forwards" : "none" }}
          >
            Developer Tool · Not an e-commerce app
          </div>

          <h1
            className="text-7xl font-bold leading-tight mb-6 opacity-0"
            style={{ animation: mounted ? "fadeUp 0.6s ease 0.3s forwards" : "none", letterSpacing: "-0.02em" }}
          >
            Exposing what most backends<br />
            <span className="text-orange-500">try to hide</span>
          </h1>

          <p
            className="text-base text-gray-400 max-w-xl leading-relaxed mb-10 opacity-0"
            style={{ animation: mounted ? "fadeUp 0.6s ease 0.5s forwards" : "none" }}
          >
            A real microservices stack — Auth, Products, Cart, Orders — wired through
            RabbitMQ and visualized in real time. Watch service-to-service communication,
            event propagation, and distributed state changes as they actually happen.
          </p>

          <div
            className="flex items-center gap-4 opacity-0"
            style={{ animation: mounted ? "fadeUp 0.6s ease 0.7s forwards" : "none" }}
          >
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-2.5 text-sm font-bold rounded-lg bg-orange-500 text-black hover:bg-orange-400 active:scale-95 transition-all"
            >
              Enter Playground →
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-6 py-2.5 text-sm font-semibold rounded-lg border border-gray-700 text-gray-300 hover:border-orange-500 hover:text-orange-400 transition-all"
            >
              Create Account
            </button>
          </div>
        </section>

        {/* ── Live flows ── */}
        <section className="px-10 pb-20 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Live system flows</p>
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-6 space-y-5">
              {FLOWS.map((f) => (
                <div key={f.label} className="flex items-center gap-6">
                  <span className="text-xs text-gray-600 w-24 shrink-0">{f.label}</span>
                  <AnimatedFlow steps={f.steps} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services ── */}
        <section className="px-10 pb-20 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Services</p>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map((s) => (
                <div key={s.name} className="bg-[#0f0f0f] border border-gray-800 rounded-xl px-5 py-4 flex items-start justify-between hover:border-gray-600 transition-colors">
                  <div>
                    <p className="text-base font-semibold text-white mb-1">{s.name}</p>
                    <p className="text-sm text-gray-500">{s.desc}</p>
                  </div>
                  <span
                    className="text-[11px] px-2 py-0.5 rounded border shrink-0 ml-4 mt-0.5"
                    style={{ borderColor: "#374151", color: s.color }}
                  >
                    {s.proto}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Architecture callout ── */}
        <section className="px-10 pb-20 flex flex-col items-center">
          <div className="w-full max-w-4xl bg-[#0f0f0f] border border-gray-800 rounded-2xl p-8">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-6">Communication model</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <span className="text-sm text-gray-400">
                  <span className="text-green-400 font-semibold">Synchronous</span>
                  &nbsp;—&nbsp; Client → API Gateway → Service (HTTP/REST)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span className="text-sm text-gray-400">
                  <span className="text-orange-400 font-semibold">Asynchronous</span>
                  &nbsp;—&nbsp; Order Service → RabbitMQ → Cart Service (AMQP events)
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-6 border-t border-gray-800 pt-5">
              The async layer enables loose coupling — state changes propagate through events,
              not direct calls. Cart is cleared by consuming an ORDER_PLACED event, not by the Order Service calling Cart directly.
            </p>
          </div>
        </section>

        {/* ── Stack ── */}
        <section className="px-10 pb-20 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Tech stack</p>
            <div className="grid grid-cols-3 gap-3">
              {STACK.map((s) => (
                <div key={s.layer} className="bg-[#0f0f0f] border border-gray-800 rounded-xl px-5 py-4">
                  <p className="text-xs uppercase tracking-widest text-orange-500 mb-3">{s.layer}</p>
                  <div className="space-y-1.5">
                    {s.items.map((item) => (
                      <p key={item} className="text-sm text-gray-400">{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-10 pb-28 flex flex-col items-center text-center">
          <div
            className="w-full max-w-4xl border border-gray-800 rounded-2xl px-10 py-14 flex flex-col items-center gap-6"
            style={{ background: "radial-gradient(ellipse at center, rgba(249,115,22,0.05) 0%, transparent 70%)" }}
          >
            <p className="text-xs uppercase tracking-widest text-orange-500">Built by Eswar</p>
            <h2 className="text-3xl font-bold" style={{ letterSpacing: "-0.02em" }}>
              Bridge the gap between theory<br />and real implementation
            </h2>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              Every click triggers real backend services. Every animation reflects what actually happened.
              No mocks, no stubs — just the system working.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="px-8 py-3 text-sm font-bold rounded-lg bg-orange-500 text-black hover:bg-orange-400 active:scale-95 transition-all"
            >
              Enter the Playground →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-900 px-10 py-6 flex items-center justify-between">
          <span className="text-xs text-gray-700 uppercase tracking-widest">µServices Playground</span>
          <span className="text-xs text-gray-700">Eswar · 2025</span>
        </footer>
      </div>

      <style>{`
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </Mainlayout>
  );
}