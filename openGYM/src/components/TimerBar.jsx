import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useUI } from '../store/useUI.js'
import { useTheme } from '../theme/index.js'

export function TimerBar() {
  const theme = useTheme()
  const rest = useUI(state => state.rest)
  const work = useUI(state => state.work)
  const adjust = useUI(state => state.adjust)
  const stopRest = useUI(state => state.stopRest)
  const stopWork = useUI(state => state.stopWork)
  const reconcile = useUI(state => state.reconcile)
  const [now, setNow] = useState(timer ? timer.endsAt - timer.duration * 1000 : 0)
  const timer = work || rest
  useEffect(() => {
    if (!timer) return
    const interval = setInterval(() => { reconcile(); setNow(Date.now()) }, 250)
    return () => clearInterval(interval)
  }, [timer, reconcile])
  if (!timer) return null
  const kind = work ? 'work' : 'rest'
  const seconds = Math.max(0, Math.ceil((timer.endsAt - now) / 1000))
  const label = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
  return <View style={[styles.wrap, { backgroundColor: theme.surface, borderColor: theme.line }]}><Text style={[styles.kind, { color: theme.muted }]}>{kind.toUpperCase()}</Text><Pressable onPress={() => adjust(kind, -15)}><Text style={[styles.adjust, { color: theme.accent }]}>−15</Text></Pressable><Text style={[styles.time, { color: theme.text }]}>{label}</Text><Pressable onPress={() => adjust(kind, 15)}><Text style={[styles.adjust, { color: theme.accent }]}>+15</Text></Pressable><Pressable onPress={work ? stopWork : stopRest}><Text style={[styles.close, { color: theme.muted }]}>×</Text></Pressable></View>
}

const styles = StyleSheet.create({ wrap: { position: 'absolute', left: 12, right: 12, bottom: 8, zIndex: 30, minHeight: 58, borderWidth: 1, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 10 }, kind: { fontSize: 10, fontWeight: '800' }, adjust: { fontWeight: '750' }, time: { fontSize: 23, fontWeight: '850', fontVariant: ['tabular-nums'] }, close: { fontSize: 24 } })
