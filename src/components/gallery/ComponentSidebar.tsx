import React, { useState } from 'react';
import { Cart, Grid, Layers, Search, Signal } from '../marks/Marks';
import { ComponentCategory, ComponentSpec } from '../../types';
import { COMPONENT_CATALOG } from '../../mock/components';

interface ComponentSidebarProps {
  selectedComponent: ComponentSpec;
  onSelectComponent: (comp: ComponentSpec) => void;
}

const CATEGORIES: {
  id: ComponentCategory;
  label: string;
  Mark: React.ComponentType<{ size?: number }>;
}[] = [
  { id: 'all', label: 'All', Mark: Grid },
  { id: 'metrics', label: 'Metrics', Mark: Signal },
  { id: 'audio', label: 'Audio', Mark: Layers },
  { id: 'agent', label: 'Agent', Mark: Terminal2 },
  { id: 'commerce', label: 'Commerce', Mark: Cart },
  { id: 'inputs', label: 'Inputs', Mark: Search },
  { id: 'system', label: 'System', Mark: Settings2 },
];

/** Local square glyphs, so the sidebar needs no icon package. */
function Terminal2({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="square" aria-hidden="true">
      <rect x="1" y="2" width="14" height="12" />
      <path d="M1 5.5 L15 5.5" />
      <path d="M4 9 L6 10.5 L4 12" />
    </svg>
  );
}

function Settings2({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="square" aria-hidden="true">
      <rect x="5.5" y="5.5" width="5" height="5" />
      <path d="M8 1 L8 3.5 M8 12.5 L8 15 M1 8 L3.5 8 M12.5 8 L15 8" />
    </svg>
  );
}

export function ComponentSidebar({ selectedComponent, onSelectComponent }: ComponentSidebarProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ComponentCategory>('all');

  const needle = search.trim().toLowerCase();
  const filtered = COMPONENT_CATALOG.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (!needle) return true;
    return (
      item.name.toLowerCase().includes(needle)
      || item.description.toLowerCase().includes(needle)
      || item.tags.some((tag) => tag.toLowerCase().includes(needle))
    );
  });

  return (
    <aside className="z-20 flex h-[calc(100vh-3.5rem)] w-72 flex-col border-r border-ash-800 bg-ash-950">
      <div className="border-b border-ash-800 p-3">
        <div className="relative">
          <span className="absolute left-2 top-2.5 text-ash-500"><Search size={13} /></span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by name or tag"
            aria-label="Filter components"
            className="w-full border border-ash-800 bg-ash-900 py-1.5 pl-7 pr-2 text-xs text-ash-100 placeholder:text-ash-500 focus:border-ash-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Category filter: a wrapping row of square toggles, not a pill row. */}
      <div className="flex flex-wrap gap-1 border-b border-ash-800 p-2">
        {CATEGORIES.map(({ id, label, Mark: Icon }) => {
          const isSelected = category === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              aria-pressed={isSelected}
              className={`flex items-center gap-1 border px-2 py-1 font-mono text-[11px] ${
                isSelected
                  ? 'border-ash-100 bg-ash-100 text-ash-950'
                  : 'border-ash-800 text-ash-400 hover:bg-ash-900'
              }`}
            >
              <Icon size={11} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <p className="px-1 pb-2 font-mono text-[10px] tracking-[0.14em] text-ash-500">
          Catalog ({filtered.length}/{COMPONENT_CATALOG.length})
        </p>

        <ul className="space-y-1">
          {filtered.map((item) => {
            const isSelected = selectedComponent.id === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelectComponent(item)}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`w-full border p-3 text-left ${
                    isSelected
                      ? 'border-ash-100 bg-ash-900'
                      : 'border-ash-800 bg-ash-950 hover:border-ash-700 hover:bg-ash-900'
                  }`}
                >
                  <span className={`text-xs font-semibold ${isSelected ? 'text-ash-100' : 'text-ash-300'}`}>
                    {item.name}
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-ash-400">
                    {item.description}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="border border-ash-800 px-1.5 py-0.5 font-mono text-[10px] text-ash-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <p className="px-1 py-4 font-mono text-[11px] text-ash-500">
            No entry matches that filter.
          </p>
        )}
      </div>
    </aside>
  );
}
