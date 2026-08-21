import { create } from 'zustand'
import { notificationService } from '../services/notification-service.js'
import { soundService } from '../services/sound-service.js'

const timerState = { rest: null, work: null }

export const useUI = create((set, get) => ({
  ...timerState,
  toast: null,
  selectedExercise: null,
  showToast(message) {
    set({ toast: message })
    setTimeout(() => { if (get().toast === message) set({ toast: null }) }, 2600)
  },
  selectExercise(exercise) { set({ selectedExercise: exercise }) },
  startRest(seconds) {
    const rest = { startedAt: Date.now(), endsAt: Date.now() + seconds * 1000, duration: seconds }
    set({ rest, work: null })
    notificationService.scheduleRestComplete(rest.endsAt).catch(() => {})
  },
  startWork(seconds) {
    notificationService.cancelRestComplete().catch(() => {})
    set({ work: { startedAt: Date.now(), endsAt: Date.now() + seconds * 1000, duration: seconds }, rest: null })
  },
  adjust(kind, deltaSeconds) {
    const timer = get()[kind]
    if (!timer) return
    const next = { ...timer, endsAt: Math.max(Date.now(), timer.endsAt + deltaSeconds * 1000) }
    set({ [kind]: next })
    if (kind === 'rest') notificationService.scheduleRestComplete(next.endsAt).catch(() => {})
  },
  stopRest() {
    notificationService.cancelRestComplete().catch(() => {})
    set({ rest: null })
  },
  stopWork() { set({ work: null }) },
  reconcile() {
    const now = Date.now()
    if (get().rest && get().rest.endsAt <= now) {
      notificationService.cancelRestComplete().catch(() => {})
      set({ rest: null })
      soundService.restComplete()
    }
    if (get().work && get().work.endsAt <= now) {
      set({ work: null })
      soundService.restComplete()
    }
  },
}))
