import { useRef, useEffect } from "react";

export function useStockfishWorker() {
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/stockfishWorker.js", import.meta.url)
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const getBestMove = (fen, depth = 15) =>
    new Promise((resolve) => {
      const worker = workerRef.current;
      if (!worker) return resolve(null);

      const handler = (ev) => {
        if (ev.data?.type === "bestMove") {
          resolve(ev.data.move);
          worker.removeEventListener("message", handler);
        }
      };

      worker.addEventListener("message", handler);
      worker.postMessage({ command: "getBestMove", fen, depth });
    });

  return { getBestMove };
}
