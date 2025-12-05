/**
 * Anti-spam utilities for frontend forms
 */

/**
 * Get form start time (to be stored when form is first interacted with)
 */
export function getFormStartTime(): number {
  return Date.now();
}

/**
 * Generate honeypot field name (randomized to avoid detection)
 */
export function getHoneypotFieldName(): string {
  // Use a common field name that bots might fill
  return 'website';
}

/**
 * Create honeypot field props for React
 */
export function createHoneypotField() {
  const fieldName = getHoneypotFieldName();
  
  return {
    name: fieldName,
    type: 'text',
    tabIndex: -1,
    autoComplete: 'off',
    style: {
      position: 'absolute',
      left: '-9999px',
      opacity: 0,
      pointerEvents: 'none',
      height: 0,
      width: 0,
      overflow: 'hidden',
    } as React.CSSProperties,
    'aria-hidden': true,
  };
}
