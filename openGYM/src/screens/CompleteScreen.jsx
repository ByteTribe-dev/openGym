import { router } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { BodyMap } from '../components/BodyMap.jsx'
import { Button, Card, Stat, Title } from '../components/UI.jsx'
import { Screen } from '../components/Screen.jsx'
import { fmtDur, fmtVol } from '../core/format.js'
import { setsDone } from '../core/history.js'
import { loadOfWorkouts } from '../core/muscles.js'
import { t, useLang } from '../i18n/index.js'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

export default function CompleteScreen() {
  useLang()
  const theme = useTheme()
  const state = useStore(store => store.S)
  const workout = state.workouts[state.workouts.length - 1]
  if (!workout) return <Screen><Title>{t('Workout complete')}</Title><Button onPress={() => router.dismissTo('/')}>{t('Done')}</Button></Screen>
  return <Screen><View style={styles.center}><Text style={[styles.trophy, { color: theme.accent }]}>◆</Text><Title>{t('Workout complete!')}</Title><Text style={{ color: theme.muted }}>{workout.name}</Text></View><View style={styles.stats}><Stat label={t('Duration')} value={fmtDur(workout.end - workout.start)} /><Stat label={t('Sets')} value={setsDone(workout)} /><Stat label={t('Volume')} value={fmtVol(workout.vol || 0, state.unit)} /></View>{workout.prs?.length ? <Card><Text style={[styles.pr, { color: theme.accent }]}>{t('{0} new personal records', workout.prs.length)}</Text></Card> : null}<View style={styles.body}><BodyMap load={loadOfWorkouts([workout])} body={state.body} height={230} /></View><Button variant="primary" onPress={() => router.dismissTo('/')}>{t('Nice!')}</Button></Screen>
}

const styles = StyleSheet.create({ center: { alignItems: 'center' }, trophy: { fontSize: 48 }, stats: { flexDirection: 'row', gap: 8 }, body: { flexDirection: 'row' }, pr: { textAlign: 'center', fontWeight: '750' } })
