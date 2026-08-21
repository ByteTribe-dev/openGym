import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useStore } from '../store/useStore.js'
import { useTheme } from '../theme/index.js'

const META = {
  index: ['⌂', 'Home'], plan: ['≡', 'Plan'], workout: ['＋', 'Start'], stats: ['⌁', 'Stats'], exercises: ['◎', 'Exercises'],
}

export function AppTabBar({ state, navigation }) {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const activeWorkout = useStore(store => !!store.S.active)
  return <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8), backgroundColor: theme.surface, borderColor: theme.line }]}>{state.routes.map((route, index) => {
    const focused = state.index === index
    const [icon, fallbackLabel] = META[route.name] || ['•', route.name]
    const center = route.name === 'workout'
    const label = center && activeWorkout ? 'Resume' : fallbackLabel
    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params)
    }
    const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key })
    return <Pressable key={route.key} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={label} onPress={onPress} onLongPress={onLongPress} style={styles.item}><View style={[center && styles.center, center && { backgroundColor: activeWorkout ? theme.warning : theme.accent }]}><Text style={[styles.icon, { color: center ? '#071008' : focused ? theme.accent : theme.muted }]}>{center && activeWorkout ? '▶' : icon}</Text></View><Text style={[styles.label, { color: focused ? theme.accent : theme.muted }]}>{label}</Text></Pressable>
  })}</View>
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 7 }, item: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 2, minHeight: 52 },
  center: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginTop: -26 }, icon: { fontSize: 24, fontWeight: '700' }, label: { fontSize: 10, fontWeight: '700' },
})
