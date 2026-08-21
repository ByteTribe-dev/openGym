import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'

const REMINDER_PREFIX = 'opengym-reminder:'
let restIdentifier = null

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

async function ensureChannel() {
  if (Platform.OS !== 'android') return
  await Notifications.setNotificationChannelAsync('workouts', {
    name: 'Workout timers and reminders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  })
}

async function permission(interactive) {
  const current = await Notifications.getPermissionsAsync()
  if (current.granted) return true
  if (!interactive) return false
  return (await Notifications.requestPermissionsAsync()).granted
}

export const notificationService = {
  requestPermission: () => permission(true),
  async cancelWorkoutReminders() {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync()
    await Promise.all(scheduled
      .filter(item => item.content?.data?.key?.startsWith(REMINDER_PREFIX))
      .map(item => Notifications.cancelScheduledNotificationAsync(item.identifier)))
  },
  async syncWorkoutReminders(state, interactive = false) {
    await this.cancelWorkoutReminders()
    if (!state.reminder?.on || !(await permission(interactive))) return false
    await ensureChannel()
    const [hour, minute] = (state.reminder.time || '08:00').split(':').map(Number)
    for (const day of Object.keys(state.week || {}).map(Number).filter(day => state.week[day])) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'openGym',
          body: 'A workout is planned today.',
          sound: 'default',
          data: { key: `${REMINDER_PREFIX}${day}` },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: day === 0 ? 1 : day + 1,
          hour: Number.isFinite(hour) ? hour : 8,
          minute: Number.isFinite(minute) ? minute : 0,
          channelId: 'workouts',
        },
      })
    }
    return true
  },
  async scheduleRestComplete(endsAt) {
    await this.cancelRestComplete()
    if (!(await permission(false))) return null
    await ensureChannel()
    const seconds = Math.max(1, Math.ceil((endsAt - Date.now()) / 1000))
    restIdentifier = await Notifications.scheduleNotificationAsync({
      content: { title: 'Rest complete', body: 'Time for your next set.', sound: 'default', data: { key: 'opengym-rest' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, channelId: 'workouts' },
    })
    return restIdentifier
  },
  async cancelRestComplete() {
    if (!restIdentifier) return
    const id = restIdentifier
    restIdentifier = null
    await Notifications.cancelScheduledNotificationAsync(id).catch(() => {})
  },
}
