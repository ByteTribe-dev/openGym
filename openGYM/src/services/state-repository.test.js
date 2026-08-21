import { afterEach, beforeEach, expect, it, jest } from '@jest/globals'
import { storageService } from './storage-service.js'
import { normalizeState, stateRepository, STATE_KEY, STORAGE_SCHEMA } from './state-repository.js'

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'))

const defaults = { unit: 'kg', routines: [], workouts: [], bodyweight: [], customEx: [], reminder: { on: false, time: '08:00' }, active: null }

beforeEach(() => jest.restoreAllMocks())
afterEach(() => jest.restoreAllMocks())

it('fills missing old-backup fields from defaults', () => expect(normalizeState({ unit: 'lb' }, defaults)).toMatchObject({ unit: 'lb', routines: [], reminder: { on: false, time: '08:00' } }))
it('rejects invalid collection shapes safely', () => expect(normalizeState({ routines: {}, workouts: null }, defaults)).toMatchObject({ routines: [], workouts: [] }))
it('stamps the native storage schema', () => expect(normalizeState({}, defaults)._schema).toBe(STORAGE_SCHEMA))
it('loads a legacy raw state', async () => { jest.spyOn(storageService, 'get').mockResolvedValue(JSON.stringify({ unit: 'lb' })); await expect(stateRepository.load(defaults)).resolves.toMatchObject({ unit: 'lb' }) })
it('falls back after corrupt JSON', async () => { jest.spyOn(storageService, 'get').mockResolvedValue('{bad'); await expect(stateRepository.load(defaults)).resolves.toMatchObject({ unit: 'kg', routines: [] }) })
it('imports wrapped backups', () => expect(stateRepository.importBackup({ state: { unit: 'lb' } }, defaults).unit).toBe('lb'))
it('round trips exported backups', () => { const state = { ...defaults, routines: [{ id: 'r1' }] }; expect(stateRepository.importBackup(stateRepository.exportBackup(state), defaults).routines).toEqual(state.routines) })
it('flushes the newest pending snapshot', async () => { const write = jest.spyOn(storageService, 'set').mockResolvedValue(); stateRepository.save({ ...defaults, unit: 'lb' }, 10000); await stateRepository.flush(); expect(write).toHaveBeenCalledWith(STATE_KEY, expect.stringContaining('"unit":"lb"')) })
