"use client";

export default function Stepslayout({
  flowState,
  STEPS,
  flowLabels,
}: {
  flowState: any;
  STEPS: any[];
  flowLabels?: string[];
}) {
  return (
    <>
      <div className="flex items-center justify-center pt-12">
        <h2 className="text-xl uppercase tracking-widest text-gray-300 mb-3 mr-9 ">
          System Flow
        </h2>
        {STEPS.map((step, i) => {
          const isActive =
            flowState?.stepIndex === i && flowState?.status === "loading";
          const isDone =
            flowState?.stepIndex > i || flowState?.status === "success";
          const isError =
            flowState?.status === "error" && flowState?.stepIndex === i;
          const label = flowLabels?.[i];

          return (
            <div key={step.key} className="flex items-center">
              {/* Node */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`
                        w-28 h-28 rounded-full border-2 flex items-center justify-center
                        text-2xl font-bold transition-all duration-300
                        ${
                          isError
                            ? "border-red-500 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.6)]"
                            : isActive
                              ? "border-orange-500 text-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.7)] scale-110"
                              : isDone
                                ? "border-green-500 text-green-400"
                                : "border-gray-700 text-gray-600"
                        }
                      `}
                >
                  {label}
                </div>
                <span
                  className={`text-xl text-center mt-2 leading-tight
                        ${
                        isError
                            ? "text-red-400"
                            : isActive
                            ? "text-orange-400"
                            : isDone
                                ? "text-green-400"
                                : "text-gray-600"
                        }`}
                  style={{ width: 64, height: 32, display: "block" }}
                >
                  {step.label}
                </span>
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div
                  className={`
                        w-16 h-px mx-1 mb-10 transition-colors duration-300 
                        ${isDone && flowState?.stepIndex > i ? "bg-green-600" : "bg-gray-700"}
                      `}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
