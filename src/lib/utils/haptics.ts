/**
 * Utility function to trigger haptic feedback on supported mobile devices.
 * Gracefully degrades on unsupported devices (e.g. iOS Safari, desktops).
 * 
 * @param pattern Number of milliseconds to vibrate, or an array of milliseconds (e.g. [100, 50, 100])
 */
export function vibrate(pattern: number | number[] = 50) {
  if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Ignore errors (e.g., if user hasn't interacted with the page yet)
    }
  }
}
