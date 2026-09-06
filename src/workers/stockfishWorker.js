// Stockfish Worker - Full Logging

let engine;

try {
  engine = new Worker("/stockfish/stockfish-17.1-lite-single-03e3232.js");
  console.log('[Stockfish Worker] ✅ Stockfish loaded successfully');
  self.postMessage({ type: 'log', message: 'Stockfish loaded successfully' });
} catch (err) {
  console.error('[Stockfish Worker] ❌ Stockfish failed to load:', err);
  self.postMessage({ type: 'error', message: 'Stockfish failed to load', error: err });
}

const logMessage = (prefix, msg) => {
  console.log(`[Stockfish Worker] ${prefix}:`, msg);
  self.postMessage({ type: 'log', message: `${prefix}: ${msg}` });
};

self.onmessage = (event) => {
  if (!engine) {
    self.postMessage({ type: 'error', message: 'Stockfish not initialized' });
    return;
  }

  const { command, fen, depth } = event.data;
  logMessage('Received command', JSON.stringify(event.data));

  if (command === 'getBestMove') {
    const handleMessage = (msg) => {
      logMessage('Received from Stockfish', msg.data);

      if (typeof msg.data === 'string' && msg.data.startsWith('bestmove')) {
        const move = msg.data.split(' ')[1];
        logMessage('Sending best move', move);
        self.postMessage({ type: 'bestMove', move });
        engine.removeEventListener('message', handleMessage);
      }
    };

    engine.addEventListener('message', handleMessage);

    // Send commands to Stockfish
    const commands = [`position fen ${fen}`, `go depth ${depth}`];
    commands.forEach((c) => {
      logMessage('Sending to Stockfish', c);
      engine.postMessage(c);
    });
  }
};
