import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { BodyMap } from '../components/BodyMap.jsx'
import { LineChart } from '../components/LineChart.jsx'
import { Card, SectionTitle, Stat, Title } from '../components/UI.jsx'
import { Screen } from '../components/Screen.jsx'
import { effortSummary } from '../core/effort.js'
import { fmtNum } from '../core/format.js'
import { setsDone } from '../core/history.js'
import { loadOfWorkouts, MUSCLE_NAME, rankOf } from '../core/muscles.js'
import { t, useLang } from '../i18n/index.js'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

const FOUR_WEEKS_AGO = Date.now() - 28 * 86400000

export default function StatsScreen() {
  useLang()
  const theme = useTheme()
  const state = useStore(store => store.S)
  const recent = state.workouts.filter(workout => (workout.start || new Date(workout.d).getTime()) >= FOUR_WEEKS_AGO)
  const load = loadOfWorkouts(recent)
  const rank = rankOf(load)
  const effort = effortSummary(state, 28)
  const volume = state.workouts.slice(-12).map(workout => workout.vol || 0)
  const totalSets = recent.reduce((sum, workout) => sum + setsDone(workout), 0)
  return <Screen topInset><Title subtitle={t('Your local training data, on this device')}>{t('Stats')}</Title><View style={styles.stats}><Stat label={t('Last 4 weeks')} value={recent.length} /><Stat label={t('Sets')} value={totalSets} /><Stat label={t('Volume')} value={fmtNum(recent.reduce((sum, workout) => sum + (workout.vol || 0), 0))} /></View><SectionTitle>{t('Training volume')}</SectionTitle><Card><LineChart values={volume} empty={t('Complete two workouts to see a trend.')} /></Card><SectionTitle>{t('Muscle balance')} · {t('4 weeks')}</SectionTitle><Card><BodyMap load={load} body={state.body} height={280} />{rank.worked.length ? <Text style={[styles.summary, { color: theme.text }]}>{t('Most trained')}: {rank.worked.slice(0, 3).map(item => t(MUSCLE_NAME[item])).join(', ')}</Text> : <Text style={[styles.summary, { color: theme.muted }]}>{t('Complete a workout to light up the map.')}</Text>}</Card><SectionTitle>{t('Effort')}</SectionTitle><Card><View style={styles.effort}><View><Text style={[styles.big, { color: theme.text }]}>{effort.avg == null ? '—' : fmtNum(effort.avg)}</Text><Text style={{ color: theme.muted }}>{t('Average RIR')}</Text></View><View><Text style={[styles.big, { color: theme.text }]}>{effort.rated}/{effort.done}</Text><Text style={{ color: theme.muted }}>{t('Rated sets')}</Text></View><View><Text style={[styles.big, { color: theme.text }]}>{effort.hardPct == null ? '—' : `${Math.round(effort.hardPct * 100)}%`}</Text><Text style={{ color: theme.muted }}>{t('Hard sets')}</Text></View></View></Card><Pressable onPress={() => router.push('/history')}><Text style={[styles.link, { color: theme.accent }]}>{t('Open full history')} ›</Text></Pressable></Screen>
}

const styles = StyleSheet.create({ stats: { flexDirection: 'row', gap: 8 }, summary: { textAlign: 'center', textTransform: 'capitalize' }, effort: { flexDirection: 'row', justifyContent: 'space-around' }, big: { fontSize: 22, fontWeight: '800', textAlign: 'center' }, link: { textAlign: 'center', paddingVertical: 10, fontWeight: '700' } })
