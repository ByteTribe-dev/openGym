import { useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { ExerciseMedia } from '../components/ExerciseMedia.jsx'
import { Card, SectionTitle, Title } from '../components/UI.jsx'
import { Screen } from '../components/Screen.jsx'
import { exOr } from '../core/exercises.js'
import { bestWeightFor, lastEntryFor } from '../core/history.js'
import { instrFor, t, useLang } from '../i18n/index.js'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

export default function ExerciseDetailScreen() {
  useLang()
  const theme = useTheme()
  const { id } = useLocalSearchParams()
  const state = useStore(store => store.S)
  const exercise = exOr(id)
  const instructions = instrFor(exercise)
  const best = bestWeightFor(state, id)
  const previous = lastEntryFor(state, id)

  return (
    <Screen>
      <Title subtitle={[exercise.bp, exercise.eq].filter(Boolean).join(' · ')}>{exercise.n}</Title>

      <View style={[styles.mediaFrame, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <ExerciseMedia exercise={exercise} animated contentFit="contain" style={styles.hero} />
      </View>

      <View style={styles.grid}>
        <Card style={styles.tile}>
          <Text style={[styles.value, { color: theme.text }]}>{best || '—'}</Text>
          <Text style={[styles.label, { color: theme.muted }]}>{t('Best weight')}{best ? ` · ${state.unit}` : ''}</Text>
        </Card>
        <Card style={styles.tile}>
          <Text style={[styles.value, { color: theme.text }]}>{previous ? previous.w?.d || previous.d || '✓' : '—'}</Text>
          <Text style={[styles.label, { color: theme.muted }]}>{t('Last trained')}</Text>
        </Card>
      </View>

      <SectionTitle>{t('Instructions')}</SectionTitle>
      <Card style={styles.instructionsCard}>
        {instructions.length ? instructions.map((line, index) => (
          <View key={index} style={[styles.step, index === instructions.length - 1 && styles.lastStep]}>
            <View style={[styles.numberBadge, { backgroundColor: `${theme.accent}22` }]}>
              <Text style={[styles.number, { color: theme.accent }]}>{index + 1}</Text>
            </View>
            <Text style={[styles.instruction, { color: theme.text }]}>{line}</Text>
          </View>
        )) : <Text style={{ color: theme.muted }}>{exercise.desc || t('No instructions available.')}</Text>}
      </Card>

      <SectionTitle>{t('Muscles')}</SectionTitle>
      <Card style={styles.musclesCard}>
        <Text style={[styles.cap, { color: theme.text }]}>{t('Primary')}: {exercise.tg || exercise.bp || '—'}</Text>
        <Text style={[styles.cap, { color: theme.muted }]}>{t('Secondary')}: {(exercise.sm || []).join(', ') || '—'}</Text>
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  mediaFrame: { width: '100%', height: 280, borderWidth: StyleSheet.hairlineWidth, borderRadius: 22, borderCurve: 'continuous', overflow: 'hidden' },
  hero: { width: '100%', height: '100%', borderRadius: 0 },
  grid: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, minHeight: 92, justifyContent: 'space-between', gap: 8 },
  value: { fontSize: 24, fontWeight: '800', fontVariant: ['tabular-nums'] },
  label: { fontSize: 13, lineHeight: 18 },
  instructionsCard: { paddingVertical: 18 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingBottom: 16 },
  lastStep: { paddingBottom: 0 },
  numberBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  number: { fontWeight: '800', fontVariant: ['tabular-nums'] },
  instruction: { flex: 1, fontSize: 15, lineHeight: 22 },
  musclesCard: { gap: 8 },
  cap: { textTransform: 'capitalize', lineHeight: 22 },
})
