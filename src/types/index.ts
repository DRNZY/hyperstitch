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
