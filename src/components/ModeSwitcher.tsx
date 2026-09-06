import { useCallback } from 'react';
import './ModeSwitcher.css';

export type PortfolioMode = 'terminal' | 'professional' | 'manga';

interface ModeSwitcherProps {
  mode: PortfolioMode;
  onChange: (mode: PortfolioMode) => void;
}

const MODES: Array<{ value: PortfolioMode; label: string; icon: string }> = [
  { value: 'terminal', label: 'Terminal', icon: '>_' },
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'manga', label: 'Manga', icon: '📖' },
];

/**
 * Persistent three-way mode switch. Rendered once by the App shell so it
 * floats above every mode. Keyboard: arrow keys move between options.
 */
export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const index = MODES.findIndex((entry) => entry.value === mode);
      let next: number;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          next = (index + 1) % MODES.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          next = (index - 1 + MODES.length) % MODES.length;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = MODES.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      onChange(MODES[next].value);
    },
    [mode, onChange]
  );

  return (
    <div
      className="modeswitch"
      role="radiogroup"
      aria-label="Portfolio display mode"
      onKeyDown={handleKeyDown}
    >
      {MODES.map((entry) => {
        const active = entry.value === mode;
        return (
          <button
            key={entry.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className={`modeswitch__option modeswitch__option--${entry.value} ${active ? 'is-active' : ''}`}
            onClick={() => onChange(entry.value)}
          >
            <span className="modeswitch__icon" aria-hidden="true">{entry.icon}</span>
            <span className="modeswitch__label">{entry.label}</span>
          </button>
        );
      })}
    </div>
  );
}