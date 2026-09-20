import { breakpoints, colors, fontFamilies, fontSizes, motion, radii, spacing } from './tokens';

const kebab = (value: string): string => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function block(prefix: string, values: Record<string, string>): string {
  return Object.entries(values)
    .map(([key, value]) => `  --${prefix}-${kebab(key)}: ${value};`)
    .join('\n');
}

/** Serializes the design tokens to a CSS custom-property block. */
export function toCssVariables(): string {
  return [
    ':root {',
    block('color', colors),
    block('space', spacing),
    block('radius', radii),
    block('font-family', fontFamilies),
    block('font-size', fontSizes),
    block('breakpoint', breakpoints),
    block('motion', motion),
    '}',
  ].join('\n');
}
