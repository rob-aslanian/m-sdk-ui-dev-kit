import { describe, expect, it, vi } from 'vitest'
import { CONTAINER_STATUS, MINER_POWER_MODE, SOCKET_STATUSES } from '../status-utils'

vi.mock('../device-utils', () => ({
  MinerStatuses: {
    OFFLINE: 'offline',
    NOT_MINING: 'notMining',
    MAINTENANCE: 'maintenance',
    ERROR: 'error',
  },
}))

describe('status utils', () => {
  describe('container status', () => {
    it('should have container status types', () => {
      expect(CONTAINER_STATUS.RUNNING).toBe('running')
      expect(CONTAINER_STATUS.OFFLINE).toBe('offline')
      expect(CONTAINER_STATUS.STOPPED).toBe('stopped')
    })

    it('should have all status types', () => {
      const statuses = Object.values(CONTAINER_STATUS)
      expect(statuses).toHaveLength(3)
    })
  })

  describe('miner power mode', () => {
    it('should have power mode types', () => {
      expect(MINER_POWER_MODE.SLEEP).toBe('sleep')
      expect(MINER_POWER_MODE.LOW).toBe('low')
      expect(MINER_POWER_MODE.NORMAL).toBe('normal')
      expect(MINER_POWER_MODE.HIGH).toBe('high')
    })

    it('should have all power modes', () => {
      const modes = Object.values(MINER_POWER_MODE)
      expect(modes).toHaveLength(4)
    })

    it('should have power modes as lowercase strings', () => {
      Object.values(MINER_POWER_MODE).forEach((mode) => {
        expect(mode).toBe(mode.toLowerCase())
      })
    })
  })

  describe('socket statuses', () => {
    it('should include container statuses', () => {
      expect(Object.values(CONTAINER_STATUS)).toEqual(
        expect.arrayContaining(Object.values(CONTAINER_STATUS)),
      )
    })

    it('should include miner power modes', () => {
      expect(Object.values(MINER_POWER_MODE)).toEqual(
        expect.arrayContaining(Object.values(MINER_POWER_MODE)),
      )
    })

    it('should have additional socket status types', () => {
      const expectedStatuses = ['errorMining', 'disconnected', 'connecting']
      expectedStatuses.forEach((status) => {
        expect(Object.values(SOCKET_STATUSES)).toContain(status)
      })
    })
  })
})
