import { useMemo, useState } from 'react'
import { router } from 'expo-router'
import { FlatList, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ExerciseRow } from '../components/ExerciseRow.jsx'
import { Pill, Title } from '../components/UI.jsx'
import { allExercises, BODYPARTS } from '../core/exercises.js'
import { useLang, t } from '../i18n/index.js'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

export default function ExercisesScreen() {
  useLang()
  const theme = useTheme()
  const state = useStore(store => store.S)
  const [query, setQuery] = useState('')
  const [part, setPart] = useState('')
  const exercises = useMemo(() => allExercises(state).filter(exercise => (!part || exercise.bp === part) && (!query || `${exercise.n} ${exercise.bp} ${exercise.eq}`.toLowerCase().includes(query.toLowerCase()))), [state, part, query])
  return <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safe, { backgroundColor: theme.bg }]}><View style={styles.header}><Title subtitle={t('{0} exercises', exercises.length)}>{t('Exercises')}</Title><TextInput value={query} onChangeText={setQuery} placeholder={t('Search exercises')} placeholderTextColor={theme.muted} clearButtonMode="while-editing" style={[styles.search, { color: theme.text, backgroundColor: theme.surface, borderColor: theme.line }]} /></View><FlatList horizontal data={['', ...BODYPARTS]} keyExtractor={item => item || 'all'} contentContainerStyle={styles.filters} showsHorizontalScrollIndicator={false} renderItem={({ item }) => <Pill selected={part === item} onPress={() => setPart(item)}>{item || t('All')}</Pill>} style={styles.filterList} /><FlatList data={exercises} keyExtractor={item => item.id} initialNumToRender={12} windowSize={7} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list} renderItem={({ item }) => <ExerciseRow exercise={item} onPress={() => router.push(`/exercise/${item.id}`)} />} /></SafeAreaView>
}

const styles = StyleSheet.create({ safe: { flex: 1 }, header: { paddingHorizontal: 18, paddingTop: 10, gap: 12 }, search: { minHeight: 46, borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, paddingHorizontal: 14, fontSize: 16 }, filters: { gap: 7, paddingHorizontal: 18 }, filterList: { flexGrow: 0, marginVertical: 10 }, list: { paddingHorizontal: 18, paddingBottom: 110, gap: 8 } })
