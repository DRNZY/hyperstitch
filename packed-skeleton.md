### File: `src/themes/index.ts` (12 tokens)
```ts
import { ThemeConfig, ThemeId } from '../types';
```

### File: `src/types/index.ts` (358 tokens)
```ts
export type ThemeId = 'void' | 'apple' | 'cyber' | 'sunset';
export type ViewportId = 'desktop' | 'tablet' | 'mobile' | 'ultrawide';
export type ComponentCategory = 'all' | 'metrics' | 'audio' | 'agent' | 'commerce' | 'inputs' | 'system';
export interface ViewportConfig {
  id: ViewportId;
  label: string;
  width: string;
  height: string;
  aspectRatio: string;
}
export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgClass: string;
  cardClass: string;
  borderClass: string;
  accentClass: string;
  textClass: string;
  glowColor: string;
  contrastRatio: string;
}
export interface ComponentPropSchema {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  defaultValue: any;
  options?: string[];
}
export interface ComponentSpec {
  id: string;
  name: string;
  category: Exclude<ComponentCategory, 'all'>;
  description: string;
  tags: string[];
  propSchema: ComponentPropSchema[];
  defaultProps: Record<string, any>;
  code: (props: Record<string, any>) => string;
  render: (props: Record<string, any>) => React.ReactNode;
}
export interface A11yReport {
  contrastRatio: string;
  wcagLevel: 'AAA' | 'AA' | 'FAIL';
  touchTargetPass: boolean;
  hasAriaLabels: boolean;
  keyboardNavigable: boolean;
  reducedMotionSafe: boolean;
}
```

### File: `package.json` (0 tokens)
```json

```

### File: `src/App.tsx` (168 tokens)
```tsx
import React, { useState } from 'react';
import { HeaderToolbar } from './components/toolbar/HeaderToolbar';
import { ComponentSidebar } from './components/gallery/ComponentSidebar';
import { PreviewStage } from './components/canvas/PreviewStage';
import { CodeInspector } from './components/inspector/CodeInspector';
import { COMPONENT_CATALOG } from './mock/components';
import { THEMES } from './themes';
import { ThemeId, ViewportId, ComponentSpec } from './types';
export function App() { /* ... */ }
const handleSelectComponent = (/* ... */) => { /* ... */ };
const handleChangeProp = (/* ... */) => { /* ... */ };
const handleResetProps = (/* ... */) => { /* ... */ };
const handleExport = (/* ... */) => { /* ... */ };
```

### File: `src/components/canvas/PreviewStage.tsx` (102 tokens)
```tsx
import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Smartphone, Tablet, Monitor, Tv } from 'lucide-react';
import { ComponentSpec, ThemeConfig, ViewportId } from '../../types';
interface PreviewStageProps {
  component: ComponentSpec;
  theme: ThemeConfig;
  viewportId: ViewportId;
  currentProps: Record<string, any>;
}
export function PreviewStage( { /* ... */ }
```

### File: `src/components/gallery/ComponentSidebar.tsx` (96 tokens)
```tsx
import React, { useState } from 'react';
import { Search, Layers, Activity, Disc3, ShoppingBag, LayoutGrid, Sparkles } from 'lucide-react';
import { ComponentCategory, ComponentSpec } from '../../types';
import { COMPONENT_CATALOG } from '../../mock/components';
interface ComponentSidebarProps {
  selectedComponent: ComponentSpec;
  onSelectComponent: (comp: ComponentSpec) => void;
}
export function ComponentSidebar( { /* ... */ }
```

### File: `src/components/inspector/CodeInspector.tsx` (165 tokens)
```tsx
import React, { useState } from 'react';
import { Code2, Check, Copy, ShieldCheck, Sparkles, Sliders, Download, Zap } from 'lucide-react';
import { ComponentSpec, ThemeConfig } from '../../types';
import { PropsTuner } from './PropsTuner';
interface CodeInspectorProps {
  component: ComponentSpec;
  theme: ThemeConfig;
  currentProps: Record<string, any>;
  onChangeProp: (key: string, value: any) => void;
  onResetProps: () => void;
  isOpen: boolean;
  onClose: () => void;
}
export function CodeInspector( { /* ... */ }
const handleCopy = (/* ... */) => { /* ... */ };
const handleDownload = (/* ... */) => { /* ... */ };
```

### File: `src/components/inspector/PropsTuner.tsx` (73 tokens)
```tsx
import React from 'react';
import { ComponentSpec } from '../../types';
interface PropsTunerProps {
  component: ComponentSpec;
  currentProps: Record<string, any>;
  onChangeProp: (key: string, value: any) => void;
  onResetProps: () => void;
}
export function PropsTuner( { /* ... */ }
```

### File: `src/components/toolbar/HeaderToolbar.tsx` (120 tokens)
```tsx
import React from 'react';
import { 
import { ThemeId, ViewportId } from '../../types';
import { THEMES } from '../../themes';
interface HeaderToolbarProps {
  currentTheme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
  currentViewport: ViewportId;
  onViewportChange: (v: ViewportId) => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  onExport: () => void;
  copied: boolean;
}
export function HeaderToolbar( { /* ... */ }
```

### File: `src/main.tsx` (25 tokens)
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
```

### File: `src/mock/components.tsx` (24 tokens)
```tsx
import React, { useState, useEffect } from 'react';
import { 
import { ComponentSpec } from '../types';
```

### File: `tsconfig.json` (0 tokens)
```json

```

### File: `tsconfig.node.json` (0 tokens)
```json

```

### File: `vite.config.ts` (32 tokens)
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
```