import { useColorScheme } from 'react-native'
import { ACCENTS } from '../core/format.js'
import { useStore } from '../store/useStore.js'

const DARK = {
  bg: '#0b0d10', surface: '#15181d', surface2: '#1d2128', line: '#292e37',
  text: '#f5f7fa', muted: '#9aa3b2', danger: '#ff453a', warning: '#ff9f0a',
}
const LIGHT = {
  bg: '#f4f5f7', surface: '#ffffff', surface2: '#e9ecf1', line: '#d8dde5',
  text: '#17191d', muted: '#687180', danger: '#d70015', warning: '#c93400',
}

export function useTheme() {
  const mode = useStore(state => state.S.theme)
  const accentName = useStore(state => state.S.accent)
  const system = useColorScheme()
  const dark = mode === 'system' ? system !== 'light' : mode !== 'light'
  return { ...(dark ? DARK : LIGHT), accent: ACCENTS[accentName] || ACCENTS.lime, dark }
}
