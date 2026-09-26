/**
 * Custom SVG marks.
 *
 * These replace the Lucide icon set that this project used throughout.
 * AGENTS.md rule 10 bans Lucide specifically because its rounded, uniform
 * 24x24 stroke vocabulary is the visual signature of generated UI; the
 * replacement is deliberately different: square terminals, 1.6 stroke on a
 * 16-unit grid, and geometric rather than rounded joins.
 *
 * They are hand-authored paths, not a package, which is also why they do not
 * carry the `lucide` class the auditor looks for.
 */

export interface MarkProps {
  size?: number;
  className?: string;
  /** Provide when the mark is the only content of a control. */
  title?: string;
}

function svgProps({ size = 16, className, title }: MarkProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
    className,
    role: title ? ('img' as const) : ('presentation' as const),
    'aria-hidden': title ? undefined : true,
    'aria-label': title,
  };
}

/** A pass: a square-cornered check inside an implied box. */
export function Mark({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M2.5 8.5 L6 12 L13.5 4" />
    </svg>
  );
}

/** A failure: a square-cornered cross. */
export function Cross({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M4 4 L12 12 M12 4 L4 12" />
    </svg>
  );
}

/** A caution marker: a triangle with a rule and a square dot. */
export function Alert({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M8 1.5 L15 14 L1 14 Z" />
      <path d="M8 6 L8 10" />
      <path d="M8 11.6 L8 12.4" />
    </svg>
  );
}

/** Arrow pointing up and to the right, used for positive deltas. */
export function ArrowOut({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M5 11 L11 5" />
      <path d="M5.5 5 L11 5 L11 10.5" />
    </svg>
  );
}

/** A record: concentric squares, used where a disc would be a cliché. */
export function Disc({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="1.5" y="1.5" width="13" height="13" />
      <rect x="5" y="5" width="6" height="6" />
    </svg>
  );
}

/** A play triangle with square geometry. */
export function Play({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M4 2.5 L13 8 L4 13.5 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A pause: two solid bars. */
export function Pause({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M4 3 L6.5 3 L6.5 13 L4 13 Z" fill="currentColor" stroke="none" />
      <path d="M9.5 3 L12 3 L12 13 L9.5 13 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A send arrow. */
export function Send({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M14 2 L2 7.5 L6.5 9 L8 13.5 Z" />
    </svg>
  );
}

/** A microphone: a squared capsule on a stand. */
export function Mic({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="6" y="1.5" width="4" height="8" />
      <path d="M3.5 7 L3.5 8.5 A4.5 4.5 0 0 0 12.5 8.5 L12.5 7" />
      <path d="M8 13 L8 15 M5 15 L11 15" />
    </svg>
  );
}

/** A tick inside a square, for feature lists. */
export function Check({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="1.5" y="1.5" width="13" height="13" />
      <path d="M4.5 8 L7 10.5 L11.5 5.5" />
    </svg>
  );
}

/** A card outline, for payment and plan affordances. */
export function Card({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="1.5" y="3" width="13" height="10" />
      <path d="M1.5 6.5 L14.5 6.5" />
      <path d="M4 9.5 L7 9.5" />
    </svg>
  );
}

/** A gear reduced to a square ring with four teeth. */
export function Gear({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="5.5" y="5.5" width="5" height="5" />
      <path d="M8 1 L8 3.5 M8 12.5 L8 15 M1 8 L3.5 8 M12.5 8 L15 8" />
    </svg>
  );
}

/** A terminal prompt: a chevron and an underscore. */
export function Prompt({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M3 3 L7 7.5 L3 12" />
      <path d="M8.5 12.5 L13.5 12.5" />
    </svg>
  );
}

/** A signal-strength bar stack, for telemetry readouts. */
export function Signal({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M2 12 L2 9 M6 12 L6 6 M10 12 L10 3 M14 12 L14 1" />
    </svg>
  );
}

/** A copy action: two offset squares. */
export function Copy({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="1.5" y="1.5" width="9" height="9" />
      <path d="M5.5 14.5 L14.5 14.5 L14.5 5.5" />
    </svg>
  );
}

/** A download action: a down arrow into a baseline. */
export function Download({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M8 1.5 L8 10" />
      <path d="M4.5 7 L8 10.5 L11.5 7" />
      <path d="M2 13.5 L14 13.5" />
    </svg>
  );
}

/** A code view toggle: angle brackets. */
export function Brackets({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M5.5 2 L1.5 8 L5.5 14" />
      <path d="M10.5 2 L14.5 8 L10.5 14" />
    </svg>
  );
}

/** A contract check for the contrast readout. */
export function Contract({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M8 1.5 L14 5 L14 11 L8 14.5 L2 11 L2 5 Z" />
      <path d="M5.5 8 L7.5 10 L11 6" />
    </svg>
  );
}

/** The craft-score toggle: a caliper. */
export function Caliper({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M1.5 12 L8 2 L14.5 12" />
      <path d="M4.5 12 L11.5 12" />
      <path d="M8 2 L8 8" />
    </svg>
  );
}

/** A props toggle: three faders. */
export function Faders({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M3 2 L3 14 M8 2 L8 14 M13 2 L13 14" />
      <path d="M1.5 6 L4.5 6 M6.5 10 L9.5 10 M11.5 4 L14.5 4" />
    </svg>
  );
}

/** A zoom control: a magnifier reduced to a square lens. */
export function Lens({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="1.5" y="1.5" width="9" height="9" />
      <path d="M12 12 L15 15" />
    </svg>
  );
}

/** A reset action: a square arrow. */
export function Reset({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M13.5 8 A5.5 5.5 0 1 1 11 3.2" />
      <path d="M8 1 L8 5.5 L11.5 5.5" />
    </svg>
  );
}

/** A desktop display: a wide rectangle on a stand. */
export function Screen({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="1" y="2.5" width="14" height="9" />
      <path d="M5.5 14.5 L10.5 14.5" />
      <path d="M8 11.5 L8 14.5" />
    </svg>
  );
}

/** An ultrawide display: the same, wider. */
export function Wide({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="0.5" y="4" width="15" height="7" />
      <path d="M4 14 L12 14" />
      <path d="M8 11 L8 14" />
    </svg>
  );
}

/** A tablet: a portrait rectangle with a rule near the base. */
export function Tablet({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="3" y="1" width="10" height="14" />
      <path d="M6.5 12.5 L9.5 12.5" />
    </svg>
  );
}

/** A phone: a narrow portrait rectangle. */
export function Phone({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="4.5" y="1" width="7" height="14" />
      <path d="M7 3 L9 3" />
    </svg>
  );
}

/** A crescent, for the light theme. */
export function Moon({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M13 9.5 A5.5 5.5 0 0 1 6.5 3 A5.5 5.5 0 1 0 13 9.5 Z" />
    </svg>
  );
}

/** A square sun, for the dark theme. */
export function Sun({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="5" y="5" width="6" height="6" />
      <path d="M8 0.5 L8 3 M8 13 L8 15.5 M0.5 8 L3 8 M13 8 L15.5 8" />
      <path d="M2.8 2.8 L4.6 4.6 M11.4 11.4 L13.2 13.2" />
      <path d="M13.2 2.8 L11.4 4.6 M4.6 11.4 L2.8 13.2" />
    </svg>
  );
}

/** A terminal window: a rectangle with a rule across the top. */
export function Terminal({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="1" y="2" width="14" height="12" />
      <path d="M1 5.5 L15 5.5" />
      <path d="M4 9 L6 10.5 L4 12" />
    </svg>
  );
}

/** A search field: a magnifier with a square lens. */
export function Search({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="1" y="1" width="10" height="10" />
      <path d="M12.5 12.5 L15.5 15.5" />
    </svg>
  );
}

/** A layout grid: four equal cells. */
export function Grid({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="1.5" y="1.5" width="5.5" height="5.5" />
      <rect x="9" y="1.5" width="5.5" height="5.5" />
      <rect x="1.5" y="9" width="5.5" height="5.5" />
      <rect x="9" y="9" width="5.5" height="5.5" />
    </svg>
  );
}

/** A cart, for commerce entries. */
export function Cart({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M1 1.5 L3.5 1.5 L5.5 10.5 L13 10.5 L15 4 L4 4" />
      <rect x="6" y="12" width="2" height="2" />
      <rect x="11" y="12" width="2" height="2" />
    </svg>
  );
}

/** Stacked plates, for the audio category. */
export function Layers({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <path d="M8 1 L15 4.5 L8 8 L1 4.5 Z" />
      <path d="M1 8 L8 11.5 L15 8" />
      <path d="M1 11.5 L8 15 L15 11.5" />
    </svg>
  );
}

/** An open panel, for the inspector toggle. */
export function Panel({ size, className, title }: MarkProps) {
  return (
    <svg {...svgProps({ size, className, title })}>
      <rect x="1" y="2" width="14" height="12" />
      <path d="M10 2 L10 14" />
    </svg>
  );
}
