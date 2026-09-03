import React from 'react';
import { ComponentSpec } from '../../types';

interface PropsTunerProps {
  component: ComponentSpec;
  currentProps: Record<string, any>;
  onChangeProp: (key: string, value: any) => void;
  onResetProps: () => void;
}

export function PropsTuner({
  component,
  currentProps,
  onChangeProp,
  onResetProps
}: PropsTunerProps) {
  if (!component.propSchema || component.propSchema.length === 0) {
    return (
      <div className="p-4 text-xs text-zinc-500 text-center">
        No configurable props for this unit.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-zinc-400">Live Prop Controls</span>
        <button
          onClick={onResetProps}
          className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300"
        >
          Reset Defaults
        </button>
      </div>

      <div className="space-y-3">
        {component.propSchema.map((field) => {
          const val = currentProps[field.key] ?? field.defaultValue;

          if (field.type === 'text') {
            return (
              <div key={field.key} className="space-y-1">
                <label className="text-[11px] text-zinc-400 block font-medium">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => onChangeProp(field.key, e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            );
          }

          if (field.type === 'number') {
            return (
              <div key={field.key} className="space-y-1">
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>{field.label}</span>
                  <span className="font-mono text-white">{val}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={val}
                  onChange={(e) => onChangeProp(field.key, parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            );
          }

          if (field.type === 'select' && field.options) {
            return (
              <div key={field.key} className="space-y-1">
                <label className="text-[11px] text-zinc-400 block font-medium">
                  {field.label}
                </label>
                <select
                  value={val}
                  onChange={(e) => onChangeProp(field.key, e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === 'boolean') {
            return (
              <div key={field.key} className="flex justify-between items-center py-1">
                <span className="text-[11px] text-zinc-400">{field.label}</span>
                <button
                  onClick={() => onChangeProp(field.key, !val)}
                  className={`h-5 w-9 rounded-full p-0.5 transition-colors ${
                    val ? 'bg-indigo-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      val ? 'translate-x-4' : ''
                    }`}
                  />
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
