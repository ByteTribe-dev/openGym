import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../theme/index.js'

export function Screen({ children, scroll = true, contentStyle, style, headerInset = false, topInset = false }) {
  const theme = useTheme()
  const content = <View style={[styles.content, headerInset && styles.headerInset, contentStyle]}>{children}</View>
  return (
    <SafeAreaView edges={topInset ? ['top', 'left', 'right'] : ['left', 'right']} style={[styles.safe, { backgroundColor: theme.bg }, style]}>
      {scroll ? <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: 18, paddingVertical: 14, gap: 14 },
  headerInset: { paddingTop: 66 },
})
