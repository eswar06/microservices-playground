"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./Button";

type Step = {
  key: string;
  label: string;
  instruction: string;
};

type FlowState = {
  status: "loading" | "success" | "error";
  stepIndex: number;
} | null;

type LogEntry = {
  label: string;
  instruction: string;
  status: "loading" | "success" | "error";
};

function TypewriterText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, 22);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="animate-pulse text-orange-400">▌</span>
      )}
    </span>
  );
}

export default function ApiFlowVisualizer({
  flowState,
  steps,
}: {
  flowState: FlowState;
  steps: Step[];
}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const prevStepIndex = useRef<number | null>(null);
  const prevStatus = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef<Set<number>>(new Set());
  
  const activeStep = flowState != null ? steps[flowState.stepIndex] : null;
  const isSuccess = flowState?.status === "success";
  const isError = flowState?.status === "error";

  // Reset revealed tracker when flowState is cleared
  useEffect(() => {
    if (!flowState) {
      revealedRef.current = new Set();
    }
  }, [flowState]);

  useEffect(() => {
  if (!flowState) {
    setLogs([]);
    prevStepIndex.current = null;
    prevStatus.current = null;
    return;
  }

  const { stepIndex, status } = flowState;

  // Append a new entry whenever stepIndex changes — regardless of status
  if (stepIndex !== prevStepIndex.current) {
    const step = steps[stepIndex];
    setLogs((prev) => [
      ...prev,
      { label: step.label, instruction: step.instruction, status },
    ]);
    prevStepIndex.current = stepIndex;
  }

  // Update the last entry's status if it changed
  if (status !== prevStatus.current) {
    if (status === "success" || status === "error") {
      setLogs((prev) =>
        prev.map((log, i) =>
          i === prev.length - 1
            ? {
                ...log,
                status,
                ...(status === "error" && {
                  instruction: "Something went wrong. Please try again.",
                }),
              }
            : log
        )
      );
    }
    prevStatus.current = status;
  }
}, [flowState?.stepIndex, flowState?.status]);

  // Auto-scroll to bottom on new log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 flex flex-col gap-4 h-full min-h-[300px]">

      {/* Service Name */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Service Name</p>
        <div
          className={`
            border rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300
            ${isError    ? "border-red-500 text-red-400" :
              isSuccess  ? "border-green-500 text-green-400" :
              activeStep ? "border-orange-500 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]" :
                           "border-gray-700 text-gray-600"}
          `}
        >
          {isSuccess ? "✓ All Services Done"
            : isError   ? "✗ Error"
            : activeStep ? activeStep.label
            : "—"}
        </div>
      </div>

      {/* Log block */}
      <div className="flex flex-col">
        <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Instruction</p>
        <div
          ref={scrollRef}
          className="bg-[#0B0B0B] border border-gray-800 rounded-lg p-3 h-[180px] overflow-y-auto font-mono text-xs space-y-1.5 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {logs.length === 0 ? (
            <span className="text-gray-600">Click Add to Cart to begin...</span>
          ) : (
            logs.map((log, i) => {
              const alreadyRevealed = revealedRef.current.has(i);
              const color =
                log.status === "error"   ? "text-red-400"   :
                log.status === "success" ? "text-green-400" :
                                           "text-gray-400";
              const prefix =
                log.status === "error"   ? "✗" :
                log.status === "success" ? "✓" : "›";
              const prefixColor =
                log.status === "error"   ? "text-red-500"   :
                log.status === "success" ? "text-green-500" : "text-orange-500";

              return (
                <div key={i} className="flex gap-2 leading-relaxed text-[13px]">
                  <span className={`${prefixColor} select-none`}>{prefix}</span>
                  <span className="text-gray-500 shrink-0">[{log.label}]</span>
                  <span className={color}>
                    {!alreadyRevealed ? (
                      <TypewriterText
                        text={log.instruction}
                        onDone={() => {
                          revealedRef.current = new Set(revealedRef.current).add(i);
                        }}
                      />
                    ) : (
                      log.instruction
                    )}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => {
            setLogs([]);
            revealedRef.current = new Set();
          }}
          disabled={logs.length === 0}
        >
          Clear Logs
        </Button>
      </div>

      {/* Status pill */}
      {flowState && (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isSuccess ? "bg-green-400" :
              isError   ? "bg-red-400"   :
                          "bg-orange-400 animate-pulse"
            }`}
          />
          <span
            className={`text-[11px] font-mono uppercase tracking-wider ${
              isSuccess ? "text-green-400" :
              isError   ? "text-red-400"   :
                          "text-orange-400"
            }`}
          >
            {flowState.status}
          </span>
        </div>
      )}
    </div>
  );
}