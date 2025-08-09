// Suppress known React 19 warnings from third-party libraries
// This runs immediately when imported
(() => {
  if (typeof window !== 'undefined' && typeof console !== 'undefined') {
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Override console.error
    console.error = function(...args: any[]) {
      const firstArg = args[0];
      
      // Check if it's a string message
      if (typeof firstArg === 'string') {
        // Suppress React 19 ref warnings from Radix UI components
        if (
          firstArg.includes('Accessing element.ref was removed in React 19') ||
          firstArg.includes('ref is now a regular prop') ||
          firstArg.includes('will be removed from the JSX Element type')
        ) {
          return;
        }
        
        // Also suppress for stack traces that include these warnings
        const stackTrace = new Error().stack;
        if (stackTrace && (
          stackTrace.includes('select.tsx') ||
          stackTrace.includes('SelectPrimitive') ||
          stackTrace.includes('@radix-ui/react-select')
        )) {
          // Check if this is a ref-related warning
          if (firstArg.includes('ref')) {
            return;
          }
        }
      }
      
      // Call original console.error for other messages
      return originalError.apply(console, args);
    };
    
    // Override console.warn as well
    console.warn = function(...args: any[]) {
      const firstArg = args[0];
      
      if (typeof firstArg === 'string') {
        if (
          firstArg.includes('Accessing element.ref') ||
          firstArg.includes('ref is now a regular prop')
        ) {
          return;
        }
      }
      
      return originalWarn.apply(console, args);
    };
  }
})();

export {};