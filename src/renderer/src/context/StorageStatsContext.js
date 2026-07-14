import { createContext, useContext } from 'react'

export const StorageStatsContext = createContext(null)

/**
 * Hook to consume shared storage stats.
 */
export function useStorageStats() {
  const context = useContext(StorageStatsContext)
  if (context === undefined) {
    throw new Error('useStorageStats must be used within a StorageStatsContext Provider')
  }
  return context
}
