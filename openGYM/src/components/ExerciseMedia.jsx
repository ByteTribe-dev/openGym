import { Image } from 'expo-image'
import { StyleSheet, View } from 'react-native'
import { mediaService } from '../services/media-service.js'
import { useTheme } from '../theme/index.js'

export function ExerciseMedia({ exercise, animated = false, contentFit = 'cover', style }) {
  const theme = useTheme()
  const source = animated ? mediaService.gif(exercise) : mediaService.image(exercise)
  if (!source) return <View style={[styles.placeholder, { backgroundColor: theme.surface2 }, style]} />
  return <Image source={source} accessible accessibilityLabel={`${exercise.n} ${animated ? 'animation' : 'image'}`} autoplay contentFit={contentFit} transition={120} recyclingKey={`${exercise.id}:${animated}`} style={[styles.image, style]} />
}

const styles = StyleSheet.create({ image: { width: 58, height: 58, borderRadius: 14 }, placeholder: { width: 58, height: 58, borderRadius: 14 } })
