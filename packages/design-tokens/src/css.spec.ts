import { describe, expect, it } from 'vitest';

import { toCssVariables } from './css';
import { colors, spacing } from './tokens';

describe('toCssVariables', () => {
  it('emits a :root block with brand and spacing variables', () => {
    const css = toCssVariables();
    expect(css).toContain(':root {');
    expect(css).toContain(`--color-brand: ${colors.brand};`);
    expect(css).toContain(`--space-xl: ${spacing.xl};`);
  });
});
