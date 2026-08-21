import { create } from 'zustand'
import { registerCustom } from '../core/exercises.js'
import { todayISO, uid } from '../core/format.js'
import { bestWeightFor, buildSets, setsDoneActive, workoutVolume } from '../core/history.js'
import { is1RMRecord } from '../core/onerm.js'
import { applyPrescription, nextPrescription } from '../core/progression.js'
import { starterRoutines } from '../core/starter.js'
import { notificationService } from '../services/notification-service.js'
import { stateRepository } from '../services/state-repository.js'

export const DEF = {
  unit: 'kg', restSec: 90, sound: true, keepAwake: true, lang: 'en',
  theme: 'dark', accent: 'lime', body: 'male', targetW: null,
  bodyweight: [], routines: [], week: {}, dayPlan: {},
  exWeights: {}, workouts: [], active: null, customEx: [], gifSize: 'full',
  reminder: { on: false, time: '08:00', tz: null }, effort: null,
}

const clone = value => JSON.parse(JSON.stringify(value))
export const hasData = state => !!(state.workouts?.length || state.routines?.length || state.bodyweight?.length)

export const useStore = create((set, get) => ({
  S: clone(DEF),
  ready: false,
  error: null,

  async hydrate() {
    const S = await stateRepository.load(DEF)
    registerCustom(S.customEx)
    set({ S, ready: true })
    notificationService.syncWorkoutReminders(S, false).catch(() => {})
  },

  update(producer) {
    const S = clone(get().S)
    producer(S)
    S._ts = Date.now()
    registerCustom(S.customEx)
    set({ S })
    stateRepository.save(S)
  },

  replaceState(next) {
    const S = { ...clone(DEF), ...clone(next), _ts: Date.now() }
    registerCustom(S.customEx)
    set({ S })
    stateRepository.save(S, 0)
  },

  async reset() {
    await stateRepository.remove()
    const S = clone(DEF)
    set({ S })
    registerCustom([])
  },

  loadStarter() {
    const routines = starterRoutines()
    get().update(state => {
      state.routines = routines
      state.week = { 1: routines[0].id, 3: routines[1].id, 5: routines[2].id }
    })
  },

  addRoutine(name = 'New routine') {
    const routine = { id: uid(), name, emoji: 'barbell', ex: [] }
    get().update(state => { state.routines.push(routine) })
    return routine.id
  },

  removeRoutine(id) {
    get().update(state => {
      state.routines = state.routines.filter(routine => routine.id !== id)
      Object.keys(state.week).forEach(day => { if (state.week[day] === id) delete state.week[day] })
      Object.keys(state.dayPlan).forEach(day => { if (state.dayPlan[day] === id) delete state.dayPlan[day] })
    })
  },

  startWorkout(routineId = null, bodyweight = null) {
    const state = get().S
    const routine = state.routines.find(item => item.id === routineId)
    const entries = (routine?.ex || []).map(config => {
      const plan = nextPrescription(state, config, routine)
      return { id: config.id, sg: config.sg, target: { ...config }, plan, sets: applyPrescription(buildSets(state, config), plan) }
    })
    get().update(draft => {
      draft.active = {
        id: uid(), d: todayISO(), start: Date.now(), routineId,
        name: routine?.name || 'Freestyle', bw: bodyweight || null, cur: 0, entries,
      }
    })
  },

  setActiveField(entryIndex, setIndex, field, value) {
    get().update(state => {
      const setItem = state.active?.entries?.[entryIndex]?.sets?.[setIndex]
      if (setItem) setItem[field] = value
    })
  },

  toggleActiveSet(entryIndex, setIndex) {
    get().update(state => {
      const setItem = state.active?.entries?.[entryIndex]?.sets?.[setIndex]
      if (setItem) setItem.done = !setItem.done
    })
  },

  addActiveSet(entryIndex) {
    get().update(state => {
      const entry = state.active?.entries?.[entryIndex]
      if (!entry) return
      const last = entry.sets[entry.sets.length - 1] || { w: 0, r: entry.target?.reps || 10 }
      entry.sets.push({ ...last, done: false })
    })
  },

  addActiveExercise(config) {
    get().update(state => {
      if (!state.active) return
      const full = { sets: 3, reps: 10, weight: 0, ...config }
      const routine = state.routines.find(item => item.id === state.active.routineId)
      const plan = nextPrescription(state, full, routine)
      state.active.entries.push({ id: full.id, target: { ...full }, plan, sets: applyPrescription(buildSets(state, full), plan) })
      state.active.cur = state.active.entries.length - 1
    })
  },

  discardWorkout() {
    get().update(state => { state.active = null })
  },

  finishWorkout() {
    const state = get().S
    const active = state.active
    if (!active) return null
    const prs = []
    const e1prs = []
    active.entries.forEach(entry => {
      const max = Math.max(0, ...entry.sets.filter(setItem => setItem.done).map(setItem => setItem.w || 0))
      if (max > 0 && max > bestWeightFor(state, entry.id)) prs.push(entry.id)
      const record = is1RMRecord(state, entry.id, entry)
      if (record && !prs.includes(entry.id)) e1prs.push({ id: entry.id, ...record })
    })
    const workout = {
      id: active.id, d: active.d, start: active.start, end: Date.now(),
      routineId: active.routineId, name: active.name, bw: active.bw,
      entries: active.entries
        .map(entry => ({ id: entry.id, sets: entry.sets, topW: entry.topW || null, target: entry.target || null }))
        .filter(entry => entry.sets.some(setItem => setItem.done)),
      prs,
    }
    workout.vol = workoutVolume(workout)
    get().update(draft => {
      workout.entries.forEach(entry => {
        const max = Math.max(0, ...entry.sets.filter(item => item.done).map(item => item.w || 0), entry.topW || 0)
        const current = draft.exWeights[entry.id]
        if (max > 0 && (!current || max > current.w)) draft.exWeights[entry.id] = { w: max, d: workout.d }
      })
      draft.workouts.push(workout)
      draft.active = null
    })
    return { workout, prs, e1prs, completedSets: setsDoneActive(active) }
  },
}))
