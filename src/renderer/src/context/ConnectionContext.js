import { createContext, useContext } from 'react'

export const ConnectionContext = createContext('CONNECTING')

export function useConnection() {
  return useContext(ConnectionContext)
}
