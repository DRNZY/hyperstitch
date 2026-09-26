import React from 'react';
import { ComponentSpec } from '../../types';

interface PropsTunerProps {
  component: ComponentSpec;
  currentProps: Record<string, any>;
  onChangeProp: (key: string, value: any) => void;
  onResetProps: () => void;
}

/**
 * Live prop controls.
 *
 * Square inputs, square toggles, no radius, no blur, no indigo. The boolean
 * control is a `role="switch"` with `aria-checked` so its state is exposed
 * rather than implied by a colour.
 */
export function PropsTuner({ component, currentProps, onChangeProp, onResetProps }: PropsTunerProps) {
  const fields = component.propSchema ?? [];

  if (fields.length === 0) {
    return (
      <div className="p-4 text-center font-mono text-xs text-ash-500">
        This entry exposes no props.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.14em] text-ash-500">PROPS</span>
        <button
          type="button"
          onClick={onResetProps}
          className="border border-ash-800 px-2 py-1 font-mono text-[10px] text-ash-400 hover:bg-ash-900"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field) => {
          const value = currentProps[field.key] ?? field.defaultValue;
          const id = `prop-${component.id}-${field.key}`;

          if (field.type === 'text') {
            return (
              <div key={field.key}>
                <label htmlFor={id} className="mb-1 block text-[11px] font-medium text-ash-400">
                  {field.label}
                </label>
                <input
                  id={id}
                  type="text"
                  value={String(value ?? '')}
                  onChange={(event) => onChangeProp(field.key, event.target.value)}
                  className="w-full border border-ash-800 bg-ash-900 px-3 py-2 text-xs text-ash-100 placeholder:text-ash-500 focus:border-ash-600 focus:outline-none"
                />
              </div>
            );
          }

          if (field.type === 'number') {
            return (
              <div key={field.key}>
                <div className="mb-1 flex items-center justify-between text-[11px] text-ash-400">
                  <label htmlFor={id}>{field.label}</label>
                  <span className="font-mono text-ash-200">{String(value)}</span>
                </div>
                <input
                  id={id}
                  type="range"
                  min={0}
                  max={100}
                  value={Number(value)}
                  onChange={(event) => onChangeProp(field.key, Number.parseInt(event.target.value, 10))}
                  className="h-2 w-full cursor-pointer appearance-none bg-ash-800 accent-ochre-500"
                />
              </div>
            );
          }

          if (field.type === 'select' && field.options) {
            return (
              <div key={field.key}>
                <label htmlFor={id} className="mb-1 block text-[11px] font-medium text-ash-400">
                  {field.label}
                </label>
                <select
                  id={id}
                  value={String(value)}
                  onChange={(event) => onChangeProp(field.key, event.target.value)}
                  className="w-full border border-ash-800 bg-ash-900 px-3 py-2 text-xs text-ash-100 focus:border-ash-600 focus:outline-none"
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === 'boolean') {
            const on = Boolean(value);
            return (
              <div key={field.key} className="flex items-center justify-between py-1">
                <span className="text-[11px] text-ash-400">{field.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={field.label}
                  onClick={() => onChangeProp(field.key, !on)}
                  className={`h-6 w-12 border ${
                    on ? 'border-ochre-500 bg-ochre-500' : 'border-ash-700 bg-ash-950'
                  }`}
                >
                  <span className={`block h-4 w-4 ${on ? 'ml-6 bg-ash-950' : 'ml-1 bg-ash-500'}`} />
                </button>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
