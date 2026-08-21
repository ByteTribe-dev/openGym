import { storageService } from './storage-service.js'

export const STATE_KEY = 'gym_state_v1'
export const STORAGE_SCHEMA = 1

let timer = null
let pending = null

const clone = value => JSON.parse(JSON.stringify(value))

export function normalizeState(value, defaults) {
  const parsed = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return {
    ...clone(defaults),
    ...parsed,
    reminder: { ...defaults.reminder, ...(parsed.reminder || {}) },
    routines: Array.isArray(parsed.routines) ? parsed.routines : [],
    workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
    bodyweight: Array.isArray(parsed.bodyweight) ? parsed.bodyweight : [],
    customEx: Array.isArray(parsed.customEx) ? parsed.customEx : [],
    _schema: STORAGE_SCHEMA,
  }
}

async function writePending() {
  if (!pending) return
  const snapshot = pending
  pending = null
  await storageService.set(STATE_KEY, JSON.stringify(snapshot))
}

export const stateRepository = {
  async load(defaults) {
    try {
      const raw = await storageService.get(STATE_KEY)
      return raw ? normalizeState(JSON.parse(raw), defaults) : normalizeState({}, defaults)
    } catch {
      return normalizeState({}, defaults)
    }
  },
  save(state, delay = 700) {
    pending = clone(state)
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      writePending().catch(() => {})
    }, delay)
  },
  async flush() {
    clearTimeout(timer)
    timer = null
    await writePending()
  },
  async remove() {
    clearTimeout(timer)
    timer = null
    pending = null
    await storageService.remove(STATE_KEY)
  },
  importBackup(text, defaults) {
    const parsed = typeof text === 'string' ? JSON.parse(text) : text
    const payload = parsed?.state && typeof parsed.state === 'object' ? parsed.state : parsed
    return normalizeState(payload, defaults)
  },
  exportBackup(state) {
    return JSON.stringify({ app: 'openGym', schema: STORAGE_SCHEMA, exportedAt: new Date().toISOString(), state }, null, 2)
  },
}
