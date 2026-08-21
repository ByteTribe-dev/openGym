import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../theme/index.js'

export function Title({ children, subtitle, right }) {
  const theme = useTheme()
  return <View style={styles.titleRow}><View style={styles.grow}><Text style={[styles.title, { color: theme.text }]}>{children}</Text>{subtitle ? <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text> : null}</View>{right}</View>
}

export function SectionTitle({ children, action }) {
  const theme = useTheme()
  return <View style={styles.sectionRow}><Text style={[styles.section, { color: theme.muted }]}>{children}</Text>{action}</View>
}

export function Card({ children, style, onPress, accessibilityLabel }) {
  const theme = useTheme()
  const Component = onPress ? Pressable : View
  return <Component accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: theme.surface, borderColor: theme.line }, style, pressed && { opacity: 0.72 }]}>{children}</Component>
}

export function Button({ children, onPress, variant = 'default', disabled, style, accessibilityLabel }) {
  const theme = useTheme()
  const primary = variant === 'primary'
  const danger = variant === 'danger'
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor: primary ? theme.accent : danger ? theme.danger : theme.surface2, opacity: disabled ? 0.4 : pressed ? 0.72 : 1 }, style]}><Text style={[styles.buttonText, { color: primary ? '#071008' : '#fff' }]}>{children}</Text></Pressable>
}

export function Pill({ children, selected, onPress }) {
  const theme = useTheme()
  return <Pressable onPress={onPress} style={[styles.pill, { borderColor: selected ? theme.accent : theme.line, backgroundColor: selected ? theme.accent + '22' : theme.surface }]}><Text style={{ color: selected ? theme.accent : theme.muted, fontWeight: '600' }}>{children}</Text></Pressable>
}

export function Empty({ icon = '○', title, body, action }) {
  const theme = useTheme()
  return <View style={styles.empty}><Text style={[styles.emptyIcon, { color: theme.accent }]}>{icon}</Text><Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>{body ? <Text style={[styles.emptyBody, { color: theme.muted }]}>{body}</Text> : null}{action}</View>
}

export function Stat({ label, value }) {
  const theme = useTheme()
  return <View style={[styles.stat, { backgroundColor: theme.surface, borderColor: theme.line }]}><Text style={[styles.statValue, { color: theme.text }]}>{value}</Text><Text style={[styles.statLabel, { color: theme.muted }]}>{label}</Text></View>
}

const styles = StyleSheet.create({
  grow: { flex: 1 }, titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 }, subtitle: { fontSize: 14, marginTop: 3 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }, section: { fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 18, padding: 16 },
  button: { minHeight: 48, paddingHorizontal: 18, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, buttonText: { fontSize: 16, fontWeight: '750' },
  pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 13, paddingVertical: 8 },
  empty: { minHeight: 260, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 }, emptyIcon: { fontSize: 44, fontWeight: '300' }, emptyTitle: { fontSize: 20, fontWeight: '750', textAlign: 'center' }, emptyBody: { fontSize: 15, lineHeight: 21, textAlign: 'center', maxWidth: 330 },
  stat: { flex: 1, minWidth: 100, borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, padding: 14 }, statValue: { fontSize: 22, fontWeight: '800' }, statLabel: { fontSize: 12, marginTop: 3 },
})
