// utils/processQueue.ts

export type FlowState = {
  status: "loading" | "success" | "error";
  stepIndex: number;
};

export type FlowStep = {
  key: string;
};

export type ProcessQueueOptions = {
  eventQueueRef: React.MutableRefObject<any[]>;
  isProcessingRef: React.MutableRefObject<boolean>;
  steps: FlowStep[];
  setFlowState: React.Dispatch<React.SetStateAction<FlowState | null>>;
  onSuccess?: () => void;
  onFinalStep?: () => void;
};

export const processQueueNew = async ({
  eventQueueRef,
  isProcessingRef,
  steps,
  setFlowState,
  onSuccess,
  onFinalStep,
}: ProcessQueueOptions): Promise<void> => {
  if (isProcessingRef.current) return;

  isProcessingRef.current = true;
  let hasBackfilled = false;

  while (eventQueueRef.current.length > 0) {
    console.log(
      "Processing event queue, remaining events:",
      eventQueueRef.current.length,
    );
    const event: any = eventQueueRef.current.shift();

    const index = steps.findIndex((s) => s.key === event?.step);

    if (index === -1) {
      setFlowState({ status: "error", stepIndex: 0 });
      continue;
    }

    if (!hasBackfilled && index > 0) {
      hasBackfilled = true;
      console.log(`Backfilling flow state for skipped steps up to index ${index}`);
      for (let i = 0; i < index; i++) {
        setFlowState({ status: "loading", stepIndex: i });
        await new Promise((res) => setTimeout(res, 800));
      }
    }

    if (index === steps.length - 1) {
      console.log("Event corresponds to final step", event);
      console.log("Final step reached, updating flow state to success");
      setFlowState({ status: "success", stepIndex: index });
      await new Promise((res) => setTimeout(res, 1500));
      onFinalStep?.();
      onSuccess?.();
    } else {
      console.log(`Updating flow state: ${event?.type} (step ${index})`);
      setFlowState({ status: "loading", stepIndex: index });
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  isProcessingRef.current = false;
};

export const generateLabels = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    String.fromCharCode(65 + i)
  );