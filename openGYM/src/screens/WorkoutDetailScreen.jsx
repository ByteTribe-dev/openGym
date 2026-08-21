import { useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { BodyMap } from '../components/BodyMap.jsx'
import { Card, Stat, Title } from '../components/UI.jsx'
import { Screen } from '../components/Screen.jsx'
import { exOr } from '../core/exercises.js'
import { fmtDate, fmtDur, fmtNum, fmtVol } from '../core/format.js'
import { setsDone } from '../core/history.js'
import { loadOfWorkouts } from '../core/muscles.js'
import { t, useLang } from '../i18n/index.js'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

export default function WorkoutDetailScreen() {
  useLang()
  const theme = useTheme()
  const { id } = useLocalSearchParams()
  const state = useStore(store => store.S)
  const workout = state.workouts.find(item => item.id === id)
  if (!workout) return <Screen><Title>{t('Workout not found')}</Title></Screen>
  return <Screen><Title subtitle={fmtDate(workout.d, true)}>{workout.name}</Title><View style={styles.stats}><Stat label={t('Duration')} value={fmtDur(workout.end - workout.start)} /><Stat label={t('Sets')} value={setsDone(workout)} /><Stat label={t('Volume')} value={fmtVol(workout.vol || 0, state.unit)} /></View>{workout.entries.map((entry, index) => <Card key={`${entry.id}:${index}`}><Text style={[styles.ex, { color: theme.text }]}>{exOr(entry.id).n}</Text>{entry.sets.filter(item => item.done).map((item, setIndex) => <View key={setIndex} style={[styles.set, { borderColor: theme.line }]}><Text style={{ color: theme.muted }}>{setIndex + 1}</Text><Text style={{ color: theme.text }}>{fmtNum(item.w || 0)} {state.unit} × {item.r ?? item.sec ?? item.min ?? '—'}</Text>{item.rir != null || item.rpe != null ? <Text style={{ color: theme.muted }}>{item.rir != null ? `RIR ${item.rir}` : `RPE ${item.rpe}`}</Text> : null}</View>)}</Card>)}<Card><BodyMap load={loadOfWorkouts([workout])} body={state.body} height={240} /></Card></Screen>
}

const styles = StyleSheet.create({ stats: { flexDirection: 'row', gap: 8 }, ex: { fontSize: 17, fontWeight: '750', textTransform: 'capitalize', marginBottom: 8 }, set: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderTopWidth: StyleSheet.hairlineWidth } })
