import { useEffect } from 'react'
import { AppState, View } from 'react-native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { setLang } from '../i18n/index.js'
import { TimerBar } from '../components/TimerBar.jsx'
import { keepAwakeService } from '../services/keep-awake-service.js'
import { soundService } from '../services/sound-service.js'
import { stateRepository } from '../services/state-repository.js'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { useTheme } from '../theme/index.js'

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const theme = useTheme()
  const ready = useStore(state => state.ready)
  const hydrate = useStore(state => state.hydrate)
  const lang = useStore(state => state.S.lang)
  const active = useStore(state => !!state.S.active)
  const keepAwake = useStore(state => state.S.keepAwake)
  const sound = useStore(state => state.S.sound)

  useEffect(() => { hydrate() }, [hydrate])
  useEffect(() => { setLang(lang) }, [lang])
  useEffect(() => { soundService.setEnabled(sound) }, [sound])
  useEffect(() => { keepAwakeService.sync(active && keepAwake); return () => keepAwakeService.disable() }, [active, keepAwake])
  useEffect(() => {
    if (!ready) return
    SplashScreen.hideAsync().catch(() => {})
  }, [ready])
  useEffect(() => {
    const listener = AppState.addEventListener('change', next => {
      if (next === 'active') useUI.getState().reconcile()
      else stateRepository.flush().catch(() => {})
    })
    return () => listener.remove()
  }, [])

  if (!ready) return <View style={{ flex: 1, backgroundColor: theme.bg }} />
  const nestedContent = { backgroundColor: theme.bg }
  return <View style={{ flex: 1 }}><StatusBar style={theme.dark ? 'light' : 'dark'} /><Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal', headerStyle: { backgroundColor: theme.bg }, headerTintColor: theme.text, contentStyle: { backgroundColor: theme.bg } }}><Stack.Screen name="(tabs)" options={{ headerShown: false }} /><Stack.Screen name="settings" options={{ title: 'Settings', contentStyle: nestedContent }} /><Stack.Screen name="history" options={{ title: 'History', contentStyle: nestedContent }} /><Stack.Screen name="routine/[id]" options={{ title: 'Routine', contentStyle: nestedContent }} /><Stack.Screen name="exercise/[id]" options={{ title: 'Exercise', contentStyle: nestedContent }} /><Stack.Screen name="workout/[id]" options={{ title: 'Workout', contentStyle: nestedContent }} /><Stack.Screen name="import" options={{ title: 'Import', contentStyle: nestedContent, presentation: 'formSheet', sheetGrabberVisible: true, sheetAllowedDetents: [0.55, 0.9] }} /><Stack.Screen name="complete" options={{ title: 'Workout complete', contentStyle: nestedContent, presentation: 'formSheet', sheetGrabberVisible: true, sheetAllowedDetents: [0.5] }} /></Stack><TimerBar /></View>
}
