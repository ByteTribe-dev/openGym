import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Card, Empty, SectionTitle, Stat, Title, Button } from '../components/UI.jsx'
import { Screen } from '../components/Screen.jsx'
import { effectiveRoutine, setsDone, streakWeeks } from '../core/history.js'
import { fmtDate, fmtVol, todayISO } from '../core/format.js'
import { useLang, t } from '../i18n/index.js'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

export default function HomeScreen() {
  useLang()
  const theme = useTheme()
  const state = useStore(store => store.S)
  const loadStarter = useStore(store => store.loadStarter)
  const startWorkout = useStore(store => store.startWorkout)
  const today = effectiveRoutine(state, todayISO())
  const recent = state.workouts.slice(-3).reverse()
  const start = routineId => { startWorkout(routineId); router.navigate('/workout') }
  return <Screen topInset><Title subtitle={fmtDate(todayISO(), true)} right={<Pressable accessibilityLabel="Settings" onPress={() => router.push('/settings')}><Text style={[styles.settings, { color: theme.muted }]}>⚙</Text></Pressable>}>openGym</Title>
    {state.active ? <Card onPress={() => router.navigate('/workout')} style={{ borderColor: theme.warning }}><Text style={[styles.eyebrow, { color: theme.warning }]}>{t('Workout in progress')}</Text><Text style={[styles.cardTitle, { color: theme.text }]}>{state.active.name}</Text><Text style={{ color: theme.muted }}>{t('{0} sets', state.active.entries.reduce((n, entry) => n + entry.sets.filter(item => item.done).length, 0))}</Text><Button variant="primary" style={styles.cardButton} onPress={() => router.navigate('/workout')}>{t('Resume workout')}</Button></Card>
      : today ? <Card><Text style={[styles.eyebrow, { color: theme.accent }]}>{t("Today's workout")}</Text><Text style={[styles.cardTitle, { color: theme.text }]}>{today.name}</Text><Text style={{ color: theme.muted }}>{t('{0} exercises', today.ex.length)}</Text><Button variant="primary" style={styles.cardButton} onPress={() => start(today.id)}>{t('Start workout')}</Button></Card>
        : <Card><Text style={[styles.eyebrow, { color: theme.muted }]}>{t('Rest day')}</Text><Text style={[styles.cardTitle, { color: theme.text }]}>{t('Move if it feels good.')}</Text><Button style={styles.cardButton} onPress={() => start(null)}>{t('Start freestyle')}</Button></Card>}
    <View style={styles.stats}><Stat label={t('Workouts')} value={state.workouts.length} /><Stat label={t('This streak')} value={`${streakWeeks(state)}w`} /><Stat label={t('Routines')} value={state.routines.length} /></View>
    <SectionTitle action={<Pressable onPress={() => router.push('/history')}><Text style={{ color: theme.accent }}>{t('See all')}</Text></Pressable>}>{t('Recent activity')}</SectionTitle>
    {recent.length ? recent.map(workout => <Card key={workout.id} onPress={() => router.push(`/workout/${workout.id}`)} style={styles.row}><View style={styles.grow}><Text style={[styles.rowTitle, { color: theme.text }]}>{workout.name}</Text><Text style={{ color: theme.muted }}>{fmtDate(workout.d)} · {t('{0} sets', setsDone(workout))}</Text></View><Text style={{ color: theme.muted }}>{fmtVol(workout.vol || 0, state.unit)} ›</Text></Card>)
      : <Empty icon="⌁" title={t('No workouts yet')} body={t('Load the starter plan or build a routine to begin.')} action={state.routines.length ? null : <Button variant="primary" onPress={loadStarter}>{t('Load starter plan')}</Button>} />}
  </Screen>
}

const styles = StyleSheet.create({ settings: { fontSize: 25 }, eyebrow: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }, cardTitle: { fontSize: 24, fontWeight: '800', marginTop: 5 }, cardButton: { marginTop: 16 }, stats: { flexDirection: 'row', gap: 9 }, row: { flexDirection: 'row', alignItems: 'center' }, grow: { flex: 1 }, rowTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 } })
