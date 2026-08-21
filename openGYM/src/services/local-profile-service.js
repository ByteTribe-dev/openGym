import { getCalendars } from 'expo-localization'
import { localTZ } from '../core/format.js'

export const localProfileService = {
  timezone: () => getCalendars()[0]?.timeZone || localTZ(),
  hourCycle: () => getCalendars()[0]?.uses24hourClock ? '24' : '12',
}
