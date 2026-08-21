import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'

const TAG = 'opengym-active-workout'
let wanted = false

export const keepAwakeService = {
  isActive: () => wanted,
  async enable() {
    if (wanted) return
    wanted = true
    try { await activateKeepAwakeAsync(TAG) } catch { wanted = false }
  },
  disable() {
    if (!wanted) return
    wanted = false
    deactivateKeepAwake(TAG)
  },
  sync(enabled) {
    return enabled ? this.enable() : this.disable()
  },
}
