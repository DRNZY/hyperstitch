import React, { useState } from 'react';
import { HeaderToolbar } from './components/toolbar/HeaderToolbar';
import { ComponentSidebar } from './components/gallery/ComponentSidebar';
import { PreviewStage } from './components/canvas/PreviewStage';
import { CodeInspector } from './components/inspector/CodeInspector';
import { COMPONENT_CATALOG } from './mock/components';
import { THEMES } from './themes';
import { ThemeId, ViewportId, ComponentSpec } from './types';

export function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('void');
  const [currentViewport, setCurrentViewport] = useState<ViewportId>('desktop');
  const [selectedComponent, setSelectedComponent] = useState<ComponentSpec>(COMPONENT_CATALOG[0]);
  const [currentProps, setCurrentProps] = useState<Record<string, any>>(COMPONENT_CATALOG[0].defaultProps || {});
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleSelectComponent = (comp: ComponentSpec) => {
    setSelectedComponent(comp);
    setCurrentProps(comp.defaultProps || {});
  };

  const handleChangeProp = (key: string, value: any) => {
    setCurrentProps(prev => ({ ...prev, [key]: value }));
  };

  const handleResetProps = () => {
    setCurrentProps(selectedComponent.defaultProps || {});
  };

  const handleExport = () => {
    navigator.clipboard.writeText(selectedComponent.code(currentProps));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-zinc-100 font-sans select-none">
      <HeaderToolbar
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        currentViewport={currentViewport}
        onViewportChange={setCurrentViewport}
        isInspectorOpen={isInspectorOpen}
        onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
        onExport={handleExport}
        copied={copied}
      />

      <div className="flex flex-1 overflow-hidden">
        <ComponentSidebar
          selectedComponent={selectedComponent}
          onSelectComponent={handleSelectComponent}
        />

        <PreviewStage
          component={selectedComponent}
          theme={THEMES[currentTheme]}
          viewportId={currentViewport}
          currentProps={currentProps}
        />

        <CodeInspector
          component={selectedComponent}
          theme={THEMES[currentTheme]}
          currentProps={currentProps}
          onChangeProp={handleChangeProp}
          onResetProps={handleResetProps}
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
