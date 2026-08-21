import { Text } from 'react-native'

const GLYPH = {
  figureStrength: '◆', arm: '◆', abs: '◇', legs: '◇', pullup: '⌁', dumbbell: '◆',
  barbell: '━', kettlebell: '●', plate: '●', machine: '▣', figureRun: '↗', bike: '◎',
  swim: '≈', boxing: '◇', timer: '◷', stretch: '⌁', moon: '◐', heart: '♡', flame: '♢',
  bolt: 'ϟ', target: '◎', trophy: '◆', medal: '●', star: '✦', crown: '◇', shield: '◇',
}

export const ICON_NAMES = Object.keys(GLYPH)

export function Icon({ name, style, ...props }) {
  return <Text style={style} {...props}>{GLYPH[name] || '•'}</Text>
}
