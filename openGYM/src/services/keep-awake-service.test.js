import { beforeEach, expect, it, jest } from '@jest/globals'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import { keepAwakeService } from './keep-awake-service.js'

jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn(() => Promise.resolve()),
  deactivateKeepAwake: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
  keepAwakeService.disable()
  jest.clearAllMocks()
})

it('starts inactive', () => expect(keepAwakeService.isActive()).toBe(false))
it('activates with a stable tag', async () => { await keepAwakeService.enable(); expect(activateKeepAwakeAsync).toHaveBeenCalledWith('opengym-active-workout') })
it('tracks an active lock', async () => { await keepAwakeService.enable(); expect(keepAwakeService.isActive()).toBe(true) })
it('does not stack locks', async () => { await keepAwakeService.enable(); await keepAwakeService.enable(); expect(activateKeepAwakeAsync).toHaveBeenCalledTimes(1) })
it('deactivates the same tag', async () => { await keepAwakeService.enable(); keepAwakeService.disable(); expect(deactivateKeepAwake).toHaveBeenCalledWith('opengym-active-workout') })
it('ignores duplicate release', () => { keepAwakeService.disable(); expect(deactivateKeepAwake).not.toHaveBeenCalled() })
it('sync enables', async () => { await keepAwakeService.sync(true); expect(keepAwakeService.isActive()).toBe(true) })
it('sync disables', async () => { await keepAwakeService.enable(); keepAwakeService.sync(false); expect(keepAwakeService.isActive()).toBe(false) })
it('recovers when native activation rejects', async () => { activateKeepAwakeAsync.mockRejectedValueOnce(new Error('denied')); await keepAwakeService.enable(); expect(keepAwakeService.isActive()).toBe(false) })
