import { router } from 'expo-router'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, Empty } from '../components/UI.jsx'
import { fmtDate, fmtDur, fmtVol } from '../core/format.js'
import { setsDone } from '../core/history.js'
import { t, useLang } from '../i18n/index.js'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

export default function HistoryScreen() {
  useLang()
  const theme = useTheme()
  const state = useStore(store => store.S)
  const workouts = state.workouts.slice().reverse()
  return <SafeAreaView edges={['left', 'right', 'bottom']} style={[styles.safe, { backgroundColor: theme.bg }]}><FlatList data={workouts} keyExtractor={item => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <Card onPress={() => router.push(`/workout/${item.id}`)} style={styles.row}><View style={styles.date}><Text style={[styles.day, { color: theme.text }]}>{new Date(`${item.d}T12:00:00`).getDate()}</Text><Text style={[styles.month, { color: theme.muted }]}>{fmtDate(item.d).split(' ')[1] || ''}</Text></View><View style={styles.grow}><Text style={[styles.name, { color: theme.text }]}>{item.name}</Text><Text style={{ color: theme.muted }}>{fmtDur(item.end - item.start)} · {t('{0} sets', setsDone(item))}</Text></View><Text style={{ color: theme.muted }}>{fmtVol(item.vol || 0, state.unit)} ›</Text></Card>} ListEmptyComponent={<Empty icon="⌁" title={t('No history yet')} body={t('Completed workouts appear here and remain available offline.')} />} /></SafeAreaView>
}

const styles = StyleSheet.create({ safe: { flex: 1 }, list: { padding: 16, gap: 9, flexGrow: 1 }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, date: { width: 40, alignItems: 'center' }, day: { fontSize: 21, fontWeight: '800' }, month: { fontSize: 11, textTransform: 'uppercase' }, grow: { flex: 1 }, name: { fontSize: 16, fontWeight: '750', marginBottom: 3 } })
