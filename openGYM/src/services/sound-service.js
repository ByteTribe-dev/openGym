import * as Haptics from 'expo-haptics'
import { createAudioPlayer } from 'expo-audio'

let players = null
let enabled = true
const getPlayers = () => players || (players = {
  set: createAudioPlayer(require('../../assets/sounds/set-complete.wav')),
  timer: createAudioPlayer(require('../../assets/sounds/timer-complete.wav')),
  workout: createAudioPlayer(require('../../assets/sounds/workout-complete.wav')),
})
const play = name => {
  try {
    const player = getPlayers()[name]
    player.seekTo(0).then(() => player.play()).catch(() => {})
  } catch { /* Expo Go can temporarily lose its audio session; haptics still fire. */ }
}

export const soundService = {
  setEnabled: value => { enabled = !!value },
  setComplete: () => enabled ? (play('set'), Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {})) : Promise.resolve(),
  restComplete: () => enabled ? (play('timer'), Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})) : Promise.resolve(),
  workoutComplete: () => enabled ? (play('workout'), Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})) : Promise.resolve(),
  warning: () => enabled ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}) : Promise.resolve(),
}
