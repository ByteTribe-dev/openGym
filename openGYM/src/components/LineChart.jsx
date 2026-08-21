import { Text, View } from 'react-native'
import Svg, { Circle, Line, Polyline } from 'react-native-svg'
import { useTheme } from '../theme/index.js'

export function LineChart({ values = [], height = 150, empty = 'Not enough data yet' }) {
  const theme = useTheme()
  const points = values.filter(value => Number.isFinite(value))
  if (points.length < 2) return <View style={{ height, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: theme.muted }}>{empty}</Text></View>
  const width = 320
  const padding = 14
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const xy = points.map((value, index) => ({ x: padding + index / (points.length - 1) * (width - padding * 2), y: padding + (max - value) / span * (height - padding * 2) }))
  return <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}><Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={theme.line} /><Polyline points={xy.map(point => `${point.x},${point.y}`).join(' ')} fill="none" stroke={theme.accent} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />{xy.map((point, index) => <Circle key={index} cx={point.x} cy={point.y} r={3} fill={theme.accent} />)}</Svg>
}
