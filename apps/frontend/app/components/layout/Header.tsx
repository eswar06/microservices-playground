"use client";

import { useRouter } from "next/navigation";
import Button from "../ui/Button";

export default function Header({ title, subtitle, back }: { title?: string; subtitle?: string; back?: boolean }) {
  const router = useRouter();

  return (
    <>
      <header className="w-full border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center gap-3 px-6 pt-8 pb-5">
          {/* Back button */}
          {back && (
            <Button
              onClick={() => router.back()}
              className="mr-2 text-gray-500 hover:text-orange-400 transition-colors"
            >
              ←
            </Button>
          )}

          {/* Pulse orb */}
          <div className="flex items-center gap-4">
            <div
              style={{
                position: "relative",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "2px solid #f97316",
                  animation: "pulseRing 3.2s ease-out infinite",
                  animationDelay: "1.8s",
                }}
              />
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 35% 30%, #fff3e0, #f97316 45%, #c2410c 75%, #431407)",
                  boxShadow:
                    "inset -2px -2px 4px rgba(0,0,0,0.5), 0 0 8px rgba(249,115,22,0.5)",
                  position: "relative",
                  zIndex: 2,
                }}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-orange-500 leading-tight tracking-tight">
                {title}
              </h1>
              <p className="text-xs text-gray-300 mt-0.5">{subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <style>{`
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </>
  );
}