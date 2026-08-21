import { StyleSheet, Text, View } from 'react-native'
import { ExerciseMedia } from './ExerciseMedia.jsx'
import { Card } from './UI.jsx'
import { useTheme } from '../theme/index.js'

export function ExerciseRow({ exercise, detail, onPress }) {
  const theme = useTheme()
  return <Card onPress={onPress} accessibilityLabel={exercise.n} style={styles.card}><ExerciseMedia exercise={exercise} /><View style={styles.grow}><Text numberOfLines={2} style={[styles.name, { color: theme.text }]}>{exercise.n}</Text><Text numberOfLines={1} style={[styles.meta, { color: theme.muted }]}>{detail || [exercise.bp, exercise.eq].filter(Boolean).join(' · ')}</Text></View><Text style={{ color: theme.muted, fontSize: 20 }}>›</Text></Card>
}

const styles = StyleSheet.create({ card: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 10 }, grow: { flex: 1 }, name: { fontSize: 16, fontWeight: '700', textTransform: 'capitalize' }, meta: { fontSize: 12, marginTop: 4, textTransform: 'capitalize' } })
