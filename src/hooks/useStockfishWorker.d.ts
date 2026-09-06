export interface UseStockfishWorkerReturn {
  getBestMove: (fen: string, depth?: number) => Promise<string | null>;
}

export declare function useStockfishWorker(): UseStockfishWorkerReturn;