import React, { useState } from 'react';
import { Search, Layers, Activity, Disc3, ShoppingBag, LayoutGrid, Sparkles } from 'lucide-react';
import { ComponentCategory, ComponentSpec } from '../../types';
import { COMPONENT_CATALOG } from '../../mock/components';

interface ComponentSidebarProps {
  selectedComponent: ComponentSpec;
  onSelectComponent: (comp: ComponentSpec) => void;
}

export function ComponentSidebar({
  selectedComponent,
  onSelectComponent
}: ComponentSidebarProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ComponentCategory>('all');

  const categories: { id: ComponentCategory; label: string; icon: any }[] = [
    { id: 'all', label: 'All Units', icon: LayoutGrid },
    { id: 'metrics', label: 'Metrics', icon: Activity },
    { id: 'audio', label: 'Audio Decks', icon: Disc3 },
    { id: 'agent', label: 'Agent HUD', icon: Sparkles },
    { id: 'commerce', label: 'Commerce', icon: ShoppingBag }
  ];

  const filtered = COMPONENT_CATALOG.filter(c => {
    const matchesCat = category === 'all' || c.category === category;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase()) ||
                          c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <aside className="w-72 border-r border-white/[0.08] bg-[#0A0A0C]/80 backdrop-blur-2xl flex flex-col h-[calc(100vh-3.5rem)] z-20">
      {/* Search Input */}
      <div className="p-3 border-b border-white/[0.06]">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter components or tags..."
            className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-3 py-2 border-b border-white/[0.06] flex gap-1 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Component Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">
          Catalog ({filtered.length})
        </div>

        {filtered.map((item) => {
          const isSelected = selectedComponent.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectComponent(item)}
              className={`w-full text-left rounded-xl p-3 border transition-all ${
                isSelected
                  ? 'border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/5'
                  : 'border-white/[0.05] bg-zinc-900/40 hover:border-white/[0.1] hover:bg-zinc-900/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {item.name}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((t, idx) => (
                  <span key={idx} className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-mono text-zinc-400">
                    #{t}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
