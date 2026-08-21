import { afterEach, beforeEach, expect, it, jest } from '@jest/globals'
import { notificationService } from '../services/notification-service.js'
import { soundService } from '../services/sound-service.js'
import { useUI } from './useUI.js'

jest.mock('../services/notification-service.js', () => ({ notificationService: { scheduleRestComplete: jest.fn(() => Promise.resolve()), cancelRestComplete: jest.fn(() => Promise.resolve()) } }))
jest.mock('../services/sound-service.js', () => ({ soundService: { restComplete: jest.fn() } }))

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date('2026-08-21T10:00:00Z'))
  jest.clearAllMocks()
  useUI.setState({ rest: null, work: null, toast: null, selectedExercise: null })
})
afterEach(() => jest.useRealTimers())

it('starts a rest timer from an absolute timestamp', () => { useUI.getState().startRest(90); expect(useUI.getState().rest.endsAt).toBe(Date.now() + 90000) })
it('schedules a background rest alert', () => { useUI.getState().startRest(90); expect(notificationService.scheduleRestComplete).toHaveBeenCalledWith(Date.now() + 90000) })
it('work and rest timers are mutually exclusive', () => { useUI.getState().startRest(90); useUI.getState().startWork(30); expect(useUI.getState()).toMatchObject({ rest: null, work: expect.any(Object) }) })
it('starting rest replaces timed work', () => { useUI.getState().startWork(30); useUI.getState().startRest(60); expect(useUI.getState()).toMatchObject({ work: null, rest: expect.any(Object) }) })
it('adds time using endsAt', () => { useUI.getState().startRest(60); useUI.getState().adjust('rest', 15); expect(useUI.getState().rest.endsAt).toBe(Date.now() + 75000) })
it('subtracts without moving before now', () => { useUI.getState().startRest(10); useUI.getState().adjust('rest', -30); expect(useUI.getState().rest.endsAt).toBe(Date.now()) })
it('reconciles a completed background timer', () => { useUI.getState().startRest(10); jest.setSystemTime(Date.now() + 11000); useUI.getState().reconcile(); expect(useUI.getState().rest).toBeNull(); expect(soundService.restComplete).toHaveBeenCalled() })
it('cancels the scheduled alert on early finish', () => { useUI.getState().startRest(90); useUI.getState().stopRest(); expect(notificationService.cancelRestComplete).toHaveBeenCalled(); expect(useUI.getState().rest).toBeNull() })
