import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Button, Card, Empty, SectionTitle, Title } from '../components/UI.jsx'
import { Screen } from '../components/Screen.jsx'
import { DAYN } from '../core/format.js'
import { useLang, t } from '../i18n/index.js'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

const DAYS = [1, 2, 3, 4, 5, 6, 0]

export default function PlanScreen() {
  useLang()
  const theme = useTheme()
  const state = useStore(store => store.S)
  const update = useStore(store => store.update)
  const addRoutine = useStore(store => store.addRoutine)
  const loadStarter = useStore(store => store.loadStarter)
  const cycleDay = day => update(draft => {
    const choices = ['', ...draft.routines.map(routine => routine.id)]
    const next = (choices.indexOf(draft.week[day] || '') + 1) % choices.length
    if (choices[next]) draft.week[day] = choices[next]
    else delete draft.week[day]
  })
  const create = () => { const id = addRoutine(); router.push(`/routine/${id}`) }
  return <Screen topInset><Title subtitle={t('Tap a day to rotate through your routines')}>{t('Plan')}</Title>
    <View style={styles.week}>{DAYS.map(day => { const routine = state.routines.find(item => item.id === state.week[day]); return <Pressable accessibilityRole="button" accessibilityLabel={DAYN[day]} key={day} onPress={() => cycleDay(day)} style={[styles.day, { backgroundColor: routine ? theme.accent + '1f' : theme.surface, borderColor: routine ? theme.accent : theme.line }]}><Text style={[styles.dayName, { color: routine ? theme.accent : theme.muted }]}>{DAYN[day].slice(0, 2)}</Text><Text numberOfLines={2} style={[styles.dayRoutine, { color: theme.text }]}>{routine?.name || t('Rest')}</Text></Pressable> })}</View>
    <SectionTitle action={<Pressable onPress={create}><Text style={{ color: theme.accent }}>＋ {t('New')}</Text></Pressable>}>{t('Routines')}</SectionTitle>
    {state.routines.length ? state.routines.map(routine => <Card key={routine.id} onPress={() => router.push(`/routine/${routine.id}`)} style={styles.routine}><View style={[styles.badge, { backgroundColor: theme.surface2 }]}><Text style={{ fontSize: 22 }}>◆</Text></View><View style={styles.grow}><Text style={[styles.routineName, { color: theme.text }]}>{routine.name}</Text><Text style={{ color: theme.muted }}>{t('{0} exercises', routine.ex.length)}</Text></View><Text style={{ color: theme.muted, fontSize: 20 }}>›</Text></Card>)
      : <Empty icon="≡" title={t('Build your training week')} body={t('Start with a ready-made push, pull and legs plan, or create your own.')} action={<View style={styles.actions}><Button variant="primary" onPress={loadStarter}>{t('Load starter plan')}</Button><Button onPress={create}>{t('Create routine')}</Button></View>} />}
  </Screen>
}

const styles = StyleSheet.create({ week: { flexDirection: 'row', gap: 5 }, day: { flex: 1, minHeight: 88, borderWidth: 1, borderRadius: 14, alignItems: 'center', paddingHorizontal: 3, paddingVertical: 10 }, dayName: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }, dayRoutine: { fontSize: 10, fontWeight: '600', textAlign: 'center', marginTop: 12 }, routine: { flexDirection: 'row', alignItems: 'center', gap: 12 }, badge: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, grow: { flex: 1 }, routineName: { fontSize: 17, fontWeight: '750' }, actions: { gap: 9, marginTop: 8, minWidth: 230 } })
