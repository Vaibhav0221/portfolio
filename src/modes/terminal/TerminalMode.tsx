import { useCallback, useEffect, useRef, useState } from 'react';
import {
  COMMAND_REGISTRY,
  unknownCommand,
  type TerminalLine,
} from './commands';
import { portfolioData as d } from '../../data/portfolio';
import './terminal.css';

const PROMPT = 'vaibhav@portfolio:~$';

/** Lines printed during boot. */
function bootLines(): TerminalLine[] {
  return [
    { kind: 'system', text: 'Last login: ' + new Date().toDateString() },
    { kind: 'section', text: d.profile.name + ' — terminal portfolio' },
  ];
}

export function TerminalMode() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const historyIndexRef = useRef(-1);
  const draftRef = useRef('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Boot output on mount.
  useEffect(() => {
    setLines(bootLines());
  }, []);

  // Stick to the latest output, but never fight manual scrolling:
  // only jump when the user is already near the bottom.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distance <= 140) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines]);

  /** Append result lines with a staggered reveal (instant under reduced motion). */
  const appendLines = useCallback((result: TerminalLine[]) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || result.length === 0) {
      setLines((prev) => [...prev, ...result]);
      return;
    }
    let i = 0;
    const step = () => {
      const slice = result.slice(i, i + 3);
      setLines((prev) => [...prev, ...slice]);
      i += 3;
      if (i < result.length) {
        window.setTimeout(step, 24);
      }
    };
    step();
  }, []);

  /** Execute one command line: echo input, run, print output. */
  const execute = useCallback(
    (raw: string) => {
      const text = raw.trim();
      setLines((prev) => [
        ...prev,
        { kind: 'input', text: PROMPT + ' ' + text },
      ]);
      if (!text) return;
      setHistory((prev) => {
        const next = prev.includes(text) ? prev : [...prev, text];
        return next.slice(-100);
        }
      );
      historyIndexRef.current = -1;
      draftRef.current = '';

      const parts = text.split(/\s+/);
      const name = parts[0].toLowerCase();
      const args = parts.slice(1);
      // Support "sudo hire-vaibhav" as a two-token phrase.
      const fullName = name === 'sudo' && args.length > 0
        ? name + ' ' + args[0]
        : name;

      const registryHit = COMMAND_REGISTRY[fullName] ?? COMMAND_REGISTRY[name];
      if (!registryHit && name === 'sudo') {
        appendLines([
          { kind: 'error', text: 'sudo: only hire-vaibhav is permitted here.' },
          { kind: 'system', text: 'Hint: sudo hire-vaibhav' },
        ]);
        return;
      }

      const command = registryHit ?? null;
      if (!command) {
        appendLines(unknownCommand(name));
        return;
      }

      const result = command.run(args);
      if (result === 'CLEAR') {
        setLines([]);
        return;
      }
      appendLines(result);
    },
    [appendLines]
  );

  /** Step through history: direction 1 = older, -1 = newer. */
  const navigateHistory = useCallback(
    (direction: number) => {
      if (history.length === 0) return;
      let index = historyIndexRef.current;
      if (direction > 0) {
        // Start at the newest entry.
        index = index === -1 ? history.length - 1 : Math.max(0, index - 1);
        if (historyIndexRef.current === -1) draftRef.current = inputValue;
      } else {
        if (historyIndexRef.current === -1) return;
        index = historyIndexRef.current + 1;
        if (index >= history.length) {
          historyIndexRef.current = -1;
          setInputValue(draftRef.current);
          return;
        }
      }
      historyIndexRef.current = index;
      setInputValue(history[index]);
    },
    [history, inputValue]
  );

  /** Tab completion over command names; prints candidates when ambiguous. */
  const completeInput = useCallback(() => {
    const value = inputValue.trimStart();
    if (value === '') return;
    const names = Object.keys(COMMAND_REGISTRY);
    const matches = names.filter((n) => n.startsWith(value));
    if (matches.length === 1) {
      setInputValue(matches[0] + ' ');
      return;
    }
    if (matches.length > 1) {
      setLines((prev) => [
        ...prev,
        { kind: 'input', text: PROMPT + ' ' + inputValue },
        { kind: 'system', text: matches.join('   ') },
      ]);
    }
  }, [inputValue]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      if (event.key === 'Enter') {
        event.preventDefault();
        execute(input.value);
        setInputValue('');
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        navigateHistory(1);
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        navigateHistory(-1);
        return;
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        completeInput();
      }
    },
    [execute, navigateHistory, completeInput]
  );

  return (
    <div className="term">
      <div className="term__window">
        <div className="term__header">
          <span className="term__dot term__dot--r" />
          <span className="term__dot term__dot--y" />
          <span className="term__dot term__dot--g" />
          <span className="term__title">vaibhav@portfolio: ~</span>
        </div>
        <div className="term__body">
          <div className="term__scroll" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
            <div className="term__lines" aria-live="polite">
              {lines.map((line, i) => (
                <TerminalLineView key={i} line={line} />
              ))}
            </div>
            <form className="term__prompt" onSubmit={(e) => e.preventDefault()}>
              <label className="sr-only" htmlFor="term-input">terminal command</label>
              <span className="term__ps1">{PROMPT}</span>
              <input
                id="term-input"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                autoFocus
                aria-label="Enter a command"
              />
            </form>
          </div>
        </div>
      </div>
      <p className="term__hint">Type <code>help</code> to begin · ↑/↓ history · Tab completes</p>
      <p className="term__hint term__hint--dim">Tip: try <code>sudo hire-vaibhav</code></p>
    </div>
  );
}

function TerminalLineView({ line }: { line: TerminalLine }) {
  if (line.href) {
    return (
      <a className={`term-line term-line--link`} href={line.href} target="_blank" rel="noopener noreferrer">
        {line.text}
      </a>
    );
  }
  return (
    <div className={`term-line term-line--${line.kind}`}>
      {line.text === '' ? ' ' : line.text}
    </div>
 );
}