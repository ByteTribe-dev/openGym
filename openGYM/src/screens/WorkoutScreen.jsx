import { useMemo, useState } from 'react'
import { router } from 'expo-router'
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Card, Empty, SectionTitle, Title } from '../components/UI.jsx'
import { ExerciseRow } from '../components/ExerciseRow.jsx'
import { Screen } from '../components/Screen.jsx'
import { allExercises, exOr } from '../core/exercises.js'
import { lastBW, modeOf, setsDoneActive, supersetUnits } from '../core/history.js'
import { t, useLang } from '../i18n/index.js'
import { soundService } from '../services/sound-service.js'
import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { useTheme } from '../theme/index.js'

function StartChooser() {
  const theme = useTheme()
  const state = useStore(store => store.S)
  const startWorkout = useStore(store => store.startWorkout)
  const [bodyweight, setBodyweight] = useState(String(lastBW(state)?.w || ''))
  const begin = routineId => startWorkout(routineId, Number(bodyweight) || null)
  return <Screen topInset><Title subtitle={t('Choose a routine or train freestyle')}>{t('Start workout')}</Title><Card><Text style={[styles.label, { color: theme.muted }]}>{t('Body weight')} · {state.unit}</Text><TextInput value={bodyweight} onChangeText={setBodyweight} keyboardType="decimal-pad" placeholder="—" placeholderTextColor={theme.muted} style={[styles.bodyInput, { color: theme.text, borderColor: theme.line }]} /></Card><SectionTitle>{t('Routines')}</SectionTitle>{state.routines.map(routine => <Card key={routine.id} onPress={() => begin(routine.id)} style={styles.choice}><View style={styles.grow}><Text style={[styles.choiceName, { color: theme.text }]}>{routine.name}</Text><Text style={{ color: theme.muted }}>{t('{0} exercises', routine.ex.length)}</Text></View><Text style={{ color: theme.accent, fontSize: 24 }}>▶</Text></Card>)}<Button onPress={() => begin(null)}>{t('Start freestyle')}</Button></Screen>
}

function SetRow({ entryIndex, setIndex, setItem, entry }) {
  const theme = useTheme()
  const state = useStore(store => store.S)
  const setField = useStore(store => store.setActiveField)
  const toggle = useStore(store => store.toggleActiveSet)
  const startRest = useUI(store => store.startRest)
  const startWork = useUI(store => store.startWork)
  const mode = modeOf(entry.target)
  const field = mode === 'time' ? 'sec' : mode === 'cardio' ? 'min' : 'r'
  const value = setItem[field] ?? entry.target?.[field] ?? ''
  const complete = () => {
    const wasDone = setItem.done
    toggle(entryIndex, setIndex)
    if (!wasDone) { soundService.setComplete(); startRest(state.restSec || 90) }
  }
  return <View style={[styles.setRow, { borderColor: theme.line, opacity: setItem.done ? 0.64 : 1 }]}><Text style={[styles.setNo, { color: theme.muted }]}>{setIndex + 1}</Text>{mode !== 'cardio' && <TextInput accessibilityLabel={`Set ${setIndex + 1} weight`} value={String(setItem.w ?? '')} onChangeText={text => setField(entryIndex, setIndex, 'w', Number(text) || 0)} keyboardType="decimal-pad" style={[styles.cell, { color: theme.text, backgroundColor: theme.surface2 }]} />}<TextInput accessibilityLabel={`Set ${setIndex + 1} ${field}`} value={String(value)} onChangeText={text => setField(entryIndex, setIndex, field, Number(text) || 0)} keyboardType="decimal-pad" style={[styles.cell, { color: theme.text, backgroundColor: theme.surface2 }]} />{mode === 'time' && <Pressable accessibilityLabel="Start timed set" onPress={() => startWork(Number(value) || 45)}><Text style={{ color: theme.accent, fontSize: 20 }}>▶</Text></Pressable>}<Pressable accessibilityRole="checkbox" accessibilityState={{ checked: !!setItem.done }} onPress={complete} style={[styles.check, { borderColor: setItem.done ? theme.accent : theme.line, backgroundColor: setItem.done ? theme.accent : 'transparent' }]}><Text style={{ color: setItem.done ? '#071008' : theme.muted }}>{setItem.done ? '✓' : ''}</Text></Pressable></View>
}

function ActiveWorkout() {
  const theme = useTheme()
  const state = useStore(store => store.S)
  const update = useStore(store => store.update)
  const addSet = useStore(store => store.addActiveSet)
  const addExercise = useStore(store => store.addActiveExercise)
  const finishWorkout = useStore(store => store.finishWorkout)
  const discard = useStore(store => store.discardWorkout)
  const [picker, setPicker] = useState(false)
  const [query, setQuery] = useState('')
  const active = state.active
  const matches = useMemo(() => allExercises(state).filter(exercise => !query || `${exercise.n} ${exercise.bp}`.toLowerCase().includes(query.toLowerCase())).slice(0, 100), [state, query])
  if (!active) return null
  const units = supersetUnits(active.entries)
  const currentIndex = Math.min(active.cur || 0, Math.max(0, active.entries.length - 1))
  const unitIndex = units.findIndex(unit => unit.includes(currentIndex))
  const currentUnit = units[unitIndex] || []
  const done = setsDoneActive(active)
  const total = active.entries.reduce((sum, entry) => sum + entry.sets.length, 0)
  const finish = () => {
    const perform = () => { const result = finishWorkout(); if (result) { soundService.workoutComplete(); router.replace('/complete') } }
    if (done < total) Alert.alert(t('Finish early?'), t('{0} sets are still unchecked.', total - done), [{ text: t('Cancel'), style: 'cancel' }, { text: t('Finish workout'), onPress: perform }])
    else perform()
  }
  const discardFlow = () => Alert.alert(t('Discard workout?'), t('The sets you logged in this session will be lost.'), [{ text: t('Cancel'), style: 'cancel' }, { text: t('Discard'), style: 'destructive', onPress: discard }])
  const add = exercise => { addExercise({ id: exercise.id, sets: 3, reps: 10, weight: 0 }); setPicker(false); setQuery('') }
  return <Screen topInset><View style={styles.workoutHead}><Pressable onPress={discardFlow}><Text style={{ color: theme.muted, fontSize: 24 }}>×</Text></Pressable><View style={styles.grow}><Text style={[styles.workoutName, { color: theme.text }]}>{active.name}</Text><Text style={[styles.centerText, { color: theme.muted }]}>{done}/{total} {t('sets')}</Text></View><Pressable onPress={finish}><Text style={{ color: theme.accent, fontSize: 22 }}>✓</Text></Pressable></View><View style={[styles.progress, { backgroundColor: theme.surface2 }]}><View style={{ height: '100%', borderRadius: 3, width: `${total ? done / total * 100 : 0}%`, backgroundColor: theme.accent }} /></View>
    {active.entries.length ? currentUnit.map(entryIndex => { const entry = active.entries[entryIndex]; const exercise = exOr(entry.id); const mode = modeOf(entry.target); return <Card key={entryIndex} style={styles.exerciseCard}><ExerciseRow exercise={exercise} detail={entry.plan?.kind ? `${entry.plan.kind} · ${entry.target.sets || entry.sets.length} sets` : null} onPress={() => router.push(`/exercise/${entry.id}`)} /><View style={styles.setHeaders}><Text style={[styles.setNo, { color: theme.muted }]}>#</Text>{mode !== 'cardio' && <Text style={[styles.cellLabel, { color: theme.muted }]}>{t('Weight')}</Text>}<Text style={[styles.cellLabel, { color: theme.muted }]}>{mode === 'time' ? t('Seconds') : mode === 'cardio' ? t('Minutes') : t('Reps')}</Text><View style={{ width: 38 }} /></View>{entry.sets.map((setItem, setIndex) => <SetRow key={setIndex} entry={entry} entryIndex={entryIndex} setIndex={setIndex} setItem={setItem} />)}<Button style={{ marginTop: 8 }} onPress={() => addSet(entryIndex)}>＋ {t('Add set')}</Button></Card> }) : <Empty title={t('Freestyle workout')} body={t('Add your first exercise to begin logging.')} />}
    <View style={styles.nav}><Button disabled={unitIndex <= 0} onPress={() => update(draft => { draft.active.cur = units[unitIndex - 1][0] })}>‹ {t('Prev')}</Button><Button disabled={unitIndex < 0 || unitIndex >= units.length - 1} onPress={() => update(draft => { draft.active.cur = units[unitIndex + 1][0] })}>{t('Next')} ›</Button></View><Button onPress={() => setPicker(true)}>＋ {t('Add exercise')}</Button><Button variant={done === total && total ? 'primary' : 'default'} onPress={finish}>{done === total && total ? t('Finish workout') : t('Finish workout early')}</Button>
    <Modal visible={picker} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPicker(false)}><SafeAreaView style={[styles.modal, { backgroundColor: theme.bg }]}><View style={styles.modalHead}><Text style={[styles.modalTitle, { color: theme.text }]}>{t('Add exercise')}</Text><Button onPress={() => setPicker(false)}>{t('Close')}</Button></View><TextInput autoFocus value={query} onChangeText={setQuery} placeholder={t('Search exercises')} placeholderTextColor={theme.muted} style={[styles.search, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.line }]} /><FlatList data={matches} keyExtractor={item => item.id} contentContainerStyle={styles.pickerList} renderItem={({ item }) => <ExerciseRow exercise={item} onPress={() => add(item)} />} /></SafeAreaView></Modal>
  </Screen>
}

export default function WorkoutScreen() {
  useLang()
  const active = useStore(store => store.S.active)
  return active ? <ActiveWorkout /> : <StartChooser />
}

const styles = StyleSheet.create({ grow: { flex: 1 }, label: { fontSize: 12, fontWeight: '750', textTransform: 'uppercase' }, bodyInput: { borderBottomWidth: 1, fontSize: 30, fontWeight: '800', paddingVertical: 8 }, choice: { flexDirection: 'row', alignItems: 'center' }, choiceName: { fontSize: 18, fontWeight: '750' }, workoutHead: { flexDirection: 'row', alignItems: 'center', gap: 12 }, workoutName: { fontSize: 18, fontWeight: '800', textAlign: 'center' }, centerText: { textAlign: 'center', fontSize: 12 }, progress: { height: 5, borderRadius: 3 }, exerciseCard: { padding: 7 }, setHeaders: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, marginTop: 10 }, setRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 8, paddingHorizontal: 8 }, setNo: { width: 24, textAlign: 'center' }, cellLabel: { width: 78, fontSize: 11, fontWeight: '700', textAlign: 'center' }, cell: { width: 78, minHeight: 40, borderRadius: 10, textAlign: 'center', fontSize: 16, fontWeight: '700' }, check: { width: 36, height: 36, borderWidth: 1.5, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }, nav: { flexDirection: 'row', justifyContent: 'space-between' }, modal: { flex: 1 }, modalHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 }, modalTitle: { fontSize: 24, fontWeight: '800' }, search: { marginHorizontal: 18, minHeight: 46, borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, paddingHorizontal: 14 }, pickerList: { padding: 18, gap: 8 } })
