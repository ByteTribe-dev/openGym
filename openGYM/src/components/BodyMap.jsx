import Svg, { G, Path } from 'react-native-svg'
import { View } from 'react-native'
import { levelsOf } from '../core/muscles.js'
import paths from '../core/body-paths.js'
import { useTheme } from '../theme/index.js'

export function BodyMap({ load = {}, body = 'male', height = 280 }) {
  const theme = useTheme()
  const levels = levelsOf(load)
  const views = paths[body] || paths.male
  const render = view => {
    const geometry = views[view]
    return <Svg key={view} viewBox={geometry.vb} width="50%" height={height} preserveAspectRatio="xMidYMid meet"><G>{Object.entries(geometry.p).flatMap(([muscle, list]) => list.map((d, index) => <Path key={`${muscle}:${index}`} d={d} fill={levels[muscle] ? theme.accent : theme.surface2} fillOpacity={levels[muscle] ? 0.25 + levels[muscle] * 0.18 : 1} stroke={theme.line} strokeWidth={1.2} />))}</G></Svg>
  }
  return <View style={{ flexDirection: 'row', width: '100%' }}>{render('front')}{render('back')}</View>
}
