import { useMemo, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Card, Empty, SectionTitle } from '../components/UI.jsx'
import { ExerciseRow } from '../components/ExerciseRow.jsx'
import { allExercises, exOr } from '../core/exercises.js'
import { cleanupSg, defaultConfig, exLine } from '../core/history.js'
import { useLang, t } from '../i18n/index.js'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

export default function RoutineScreen() {
  useLang()
  const theme = useTheme()
  const { id } = useLocalSearchParams()
  const state = useStore(store => store.S)
  const update = useStore(store => store.update)
  const removeRoutine = useStore(store => store.removeRoutine)
  const routine = state.routines.find(item => item.id === id)
  const [picker, setPicker] = useState(false)
  const [query, setQuery] = useState('')
  const matches = useMemo(() => allExercises(state).filter(exercise => !query || `${exercise.n} ${exercise.bp}`.toLowerCase().includes(query.toLowerCase())).slice(0, 100), [state, query])
  if (!routine) return <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}><Empty title={t('Routine not found')} action={<Button onPress={() => router.back()}>{t('Go back')}</Button>} /></SafeAreaView>
  const add = exercise => { update(draft => { draft.routines.find(item => item.id === id).ex.push(defaultConfig(exercise.id)) }); setPicker(false); setQuery('') }
  const remove = index => update(draft => { const target = draft.routines.find(item => item.id === id); target.ex.splice(index, 1); cleanupSg(target.ex) })
  return <SafeAreaView edges={['left', 'right', 'bottom']} style={[styles.safe, { backgroundColor: theme.bg }]}><FlatList data={routine.ex} keyExtractor={(item, index) => `${item.id}:${index}`} contentContainerStyle={styles.list} ListHeaderComponent={<View style={styles.head}><TextInput accessibilityLabel="Routine name" value={routine.name} onChangeText={name => update(draft => { draft.routines.find(item => item.id === id).name = name })} style={[styles.name, { color: theme.text, borderColor: theme.line, backgroundColor: theme.surface }]} /><SectionTitle>{t('Exercises')}</SectionTitle></View>} renderItem={({ item, index }) => <Card style={styles.config}><ExerciseRow exercise={exOr(item.id)} detail={exLine(item, state.unit)} onPress={() => router.push(`/exercise/${item.id}`)} /><View style={styles.configRow}><Pressable onPress={() => update(draft => { const config = draft.routines.find(r => r.id === id).ex[index]; config.sets = Math.max(1, (config.sets || 1) - 1) })}><Text style={[styles.control, { color: theme.accent }]}>−</Text></Pressable><Text style={{ color: theme.muted }}>{item.sets || 1} {t('sets')}</Text><Pressable onPress={() => update(draft => { draft.routines.find(r => r.id === id).ex[index].sets = (item.sets || 1) + 1 })}><Text style={[styles.control, { color: theme.accent }]}>＋</Text></Pressable><View style={{ flex: 1 }} /><Pressable onPress={() => remove(index)}><Text style={{ color: theme.danger }}>{t('Remove')}</Text></Pressable></View></Card>} ListEmptyComponent={<Empty icon="＋" title={t('No exercises yet.')} body={t('Add exercises in the order you want to train them.')} />} ListFooterComponent={<View style={styles.footer}><Button variant="primary" onPress={() => setPicker(true)}>＋ {t('Add exercise')}</Button><Button variant="danger" onPress={() => { removeRoutine(id); router.back() }}>{t('Delete routine')}</Button></View>} />
    <Modal visible={picker} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPicker(false)}><SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}><View style={styles.modalHead}><Text style={[styles.modalTitle, { color: theme.text }]}>{t('Add exercise')}</Text><Button onPress={() => setPicker(false)}>{t('Close')}</Button></View><TextInput autoFocus value={query} onChangeText={setQuery} placeholder={t('Search exercises')} placeholderTextColor={theme.muted} style={[styles.search, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.line }]} /><FlatList data={matches} keyExtractor={item => item.id} contentContainerStyle={styles.pickerList} renderItem={({ item }) => <ExerciseRow exercise={item} onPress={() => add(item)} />} /></SafeAreaView></Modal>
  </SafeAreaView>
}

const styles = StyleSheet.create({ safe: { flex: 1 }, list: { padding: 16, gap: 10, paddingBottom: 40 }, head: { gap: 14, marginBottom: 10 }, name: { minHeight: 52, borderWidth: StyleSheet.hairlineWidth, borderRadius: 15, paddingHorizontal: 14, fontSize: 20, fontWeight: '750' }, config: { padding: 6 }, configRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingBottom: 8 }, control: { fontSize: 25 }, footer: { gap: 10, marginTop: 12 }, modalHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 }, modalTitle: { fontSize: 24, fontWeight: '800' }, search: { marginHorizontal: 18, minHeight: 46, borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, paddingHorizontal: 14 }, pickerList: { padding: 18, gap: 8 } })
