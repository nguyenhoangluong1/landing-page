'use client'

import { useEffect } from 'react'

/**
 * Component to suppress browser extension attribute warnings
 * Handles attributes like bis_skin_checked, bis_size, etc. that are added by security extensions
 */
export const BrowserExtensionSupport = () => {
  useEffect(() => {
    // Suppress React warnings for known browser extension attributes
    const originalError = console.error
    console.error = (...args) => {
      if (
        args[0]?.includes?.('Extra attributes from the server') &&
        (args[0]?.includes?.('bis_skin_checked') ||
         args[0]?.includes?.('bis_size') ||
         args[0]?.includes?.('bis_id'))
      ) {
        return // Suppress these specific warnings
      }
      originalError.call(console, ...args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return null
}