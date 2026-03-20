import type { UnknownRecord } from '@mining-sdk/core'
import {
  convertUnits,
  FALLBACK,
  formatHashrateUnit,
  HASHRATE_LABEL_DIVISOR,
  UNIT_LABELS,
  UNITS,
} from '@mining-sdk/core'
import _capitalize from 'lodash/capitalize'
import _find from 'lodash/find'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import _isBoolean from 'lodash/isBoolean'
import _isEmpty from 'lodash/isEmpty'
import _isFinite from 'lodash/isFinite'
import _join from 'lodash/join'
import _last from 'lodash/last'
import _map from 'lodash/map'
import _orderBy from 'lodash/orderBy'
import _replace from 'lodash/replace'
import _round from 'lodash/round'
import _slice from 'lodash/slice'
import _split from 'lodash/split'
import _startsWith from 'lodash/startsWith'
import _toLower from 'lodash/toLower'
import _toUpper from 'lodash/toUpper'
import { SEVERITY, SEVERITY_COLORS } from '../constants/alerts'
import {
  COMPLETE_MINER_TYPES,
  MINER_MODEL_TO_TYPE_MAP,
  MINER_TYPE,
} from '../constants/device-constants'
import type { Device } from '../types/device'
import { MINER_POWER_MODE } from './status-utils'

const FLOAT_PRECISION = 2

// eslint-disable-next-line regexp/no-misleading-capturing-group
export const separateByHyphenRegExp = /([^_]+)-([^_]+)/

// eslint-disable-next-line regexp/no-misleading-capturing-group
export const separateByTwoHyphensRegExp = /([^_]+)-([^_]+)-([^_]+)/

const allUnits = _orderBy(
  _map(HASHRATE_LABEL_DIVISOR, (value, unit) => ({ unit, value })),
  ['value'],
  ['desc'],
)

export const isTransformerCabinet = (device: UnknownRecord): boolean =>
  _includes(device?.id as string, 'tr')

export const getTransformerCabinetTitle = (device: UnknownRecord): string => {
  const transformerId = _replace(device?.id as string, 'tr', 'TR')
  // eslint-disable-next-line antfu/consistent-list-newline
  const connectedContainers = _map(device?.connectedDevices as string[], (deviceName) =>
    _last(_split(deviceName, '-')),
  )
  const containerNames = _join(connectedContainers, '&')
  return `${transformerId} ${containerNames && `C${containerNames}`}`
}

export const getLvCabinetTitle = (device: UnknownRecord): string =>
  _replace(device?.id as string, 'lv', 'LV Cabinet ')

export const getCabinetTitle = (device: UnknownRecord): string => {
  if (isTransformerCabinet(device)) {
    return getTransformerCabinetTitle(device)
  }
  return getLvCabinetTitle(device)
}

export const getRootTempSensorTempValue = (device: UnknownRecord): unknown =>
  _get(device, ['rootTempSensor', 'last', 'snap', 'stats', 'temp_c'])

export const getLvCabinetTempSensorColor = (temp: number): string => {
  if (temp > 70) return SEVERITY_COLORS[SEVERITY.CRITICAL]
  if (temp > 60) return SEVERITY_COLORS[SEVERITY.HIGH]
  return ''
}

export const getMinerName = (type: string): string => {
  const [, name, id] = _slice(type.match(separateByTwoHyphensRegExp), 1)
  return `${_capitalize(MINER_MODEL_TO_TYPE_MAP[name as keyof typeof MINER_MODEL_TO_TYPE_MAP])} ${_toUpper(id)}`
}

export const getLast = (data: UnknownRecord): UnknownRecord => (data?.last as UnknownRecord) || {}

export const getSnap = (data: UnknownRecord): UnknownRecord =>
  (getLast(data)?.snap as UnknownRecord) || {}

export const getStats = (data: UnknownRecord): UnknownRecord =>
  (getSnap(data)?.stats as UnknownRecord) || {}

export const getConfig = (data: UnknownRecord): UnknownRecord =>
  (getSnap(data)?.config as UnknownRecord) || {}

export const removeContainerPrefix = (text: string): string => _replace(text, /^container-/, '')

export const getContainerSpecificStats = (data: Device): UnknownRecord =>
  (getStats(data)?.container_specific as UnknownRecord) || {}

export const getContainerSpecificConfig = (data: Device): UnknownRecord =>
  (getConfig(data)?.config as UnknownRecord) || {}

export const getCoolingSystem = (data: Device): UnknownRecord =>
  (getContainerSpecificStats(data)?.cooling_system || {}) as UnknownRecord

export const MinerStatuses = {
  MINING: 'mining',
  OFFLINE: 'offline',
  SLEEPING: 'sleeping',
  ERROR: 'error',
  NOT_MINING: 'not_mining',
  MAINTENANCE: 'maintenance',
  ALERT: 'alert',
} as const

const MinerPowerReadingAvailability = {
  [MINER_TYPE.ANTMINER]: {
    [COMPLETE_MINER_TYPES.ANTMINER_AM_S21]: true,
    [COMPLETE_MINER_TYPES.ANTMINER_AM_S21PRO]: true,
    [COMPLETE_MINER_TYPES.ANTMINER_AM_S19XP]: false,
    [COMPLETE_MINER_TYPES.ANTMINER_AM_S19XP_H]: false,
  },
  [MINER_TYPE.AVALON]: true,
  [MINER_TYPE.WHATSMINER]: true,
}

export const isMinerOffline = (device: UnknownRecord): boolean => {
  const stats = getStats(device)
  const isEmptyStats = _isEmpty(stats)
  const isEmptyConfig = _isEmpty(getConfig(device))
  const isOffline = (stats as UnknownRecord)?.status === MinerStatuses.OFFLINE
  return (isEmptyStats && isEmptyConfig) || isOffline
}

export const PowerModeColors: Record<
  (typeof MINER_POWER_MODE)[keyof typeof MINER_POWER_MODE],
  string
> = {
  [MINER_POWER_MODE.SLEEP]: 'var(--mining-sdk-power-mode-sleep-color)',
  [MINER_POWER_MODE.LOW]: 'var(--mining-sdk-power-mode-low-color)',
  [MINER_POWER_MODE.NORMAL]: 'var(--mining-sdk-power-mode-normal-color)',
  [MINER_POWER_MODE.HIGH]: 'var(--mining-sdk-power-mode-high-color)',
} as const

export const getPowerModeColor = (powerMode: keyof typeof PowerModeColors): string =>
  PowerModeColors[powerMode]

export const formatPowerConsumption = (
  powerW: number,
  forceUnit: string | null = null,
): { value: number | null; unit: string; realValue: number } => {
  if (!_isFinite(powerW)) {
    return { value: null, unit: '', realValue: powerW }
  }

  // If a unit is forced, use it
  if (forceUnit === UNITS.ENERGY_MW) {
    return { value: powerW / 1e6, unit: UNITS.ENERGY_MW, realValue: powerW }
  }
  if (forceUnit === UNITS.POWER_KW) {
    return { value: powerW / 1e3, unit: UNITS.POWER_KW, realValue: powerW }
  }
  if (forceUnit === UNITS.POWER_W) {
    return { value: powerW, unit: UNITS.POWER_W, realValue: powerW }
  }

  // Default behavior: auto-select unit based on magnitude
  if (Math.abs(powerW) >= 1e6) {
    return { value: powerW / 1e6, unit: UNITS.ENERGY_MW, realValue: powerW }
  }
  if (Math.abs(powerW) >= 1e3) {
    return { value: powerW / 1e3, unit: UNITS.POWER_KW, realValue: powerW }
  }
  return { value: powerW, unit: UNITS.POWER_W, realValue: powerW }
}

export const getHashrateUnit = (
  hashRateMHS: number,
  decimal = FLOAT_PRECISION,
  forceUnit: string | null = null,
  treatZeroAsNoData = false,
): {
  value: number | null
  unit: string
  realValue: number
} => {
  if (!_isFinite(hashRateMHS) || (treatZeroAsNoData && hashRateMHS === 0)) {
    return { value: null, unit: '', realValue: hashRateMHS }
  }

  // If a unit is forced, use it
  if (forceUnit) {
    const divisor = HASHRATE_LABEL_DIVISOR[forceUnit as keyof typeof HASHRATE_LABEL_DIVISOR]
    if (divisor !== undefined) {
      return {
        value: _round(hashRateMHS / divisor, decimal),
        unit: forceUnit,
        realValue: hashRateMHS,
      }
    }
  }

  // Default behavior: auto-select unit based on magnitude
  const absHash = Math.abs(hashRateMHS)
  const unitToUse = _find(allUnits, (item) => absHash >= item.value) || { unit: 'MH/s', value: 1 }

  return {
    value: _round(hashRateMHS / unitToUse.value, decimal),
    unit: unitToUse.unit,
    realValue: hashRateMHS,
  }
}

export const getHashrateString = (value: number, treatZeroAsNoData = false): string =>
  formatHashrateUnit(getHashrateUnit(value, FLOAT_PRECISION, null, treatZeroAsNoData))

export const megaToTera = (mega: number): number =>
  convertUnits(mega, UNIT_LABELS.MEGA, UNIT_LABELS.TERA)

export const getOnOffText = (isOn: unknown, fallback = FALLBACK): string => {
  if (!_isBoolean(isOn)) {
    return fallback
  }
  if (isOn) {
    return 'On'
  }
  return 'Off'
}

/**
 * Extract and normalize device data from a Device object
 *
 * @param device - Device object to extract data from
 * @returns Tuple of [error, deviceData]
 *
 * @example
 * ```ts
 * const [error, deviceData] = getDeviceData(device)
 * if (error) {
 *   console.error('Device error:', error)
 * }
 * if (deviceData) {
 *   console.log('Device stats:', deviceData.snap.stats)
 * }
 * ```
 */
export const getDeviceData = (
  device: Device | null | undefined,
): [error: string | undefined | null, data: Device | undefined] => {
  if (!device) {
    return ['Device Not Found', undefined]
  }

  const { id, type, tags, rack, last, username, info, containerId, address } = device

  // If no last data, return error with empty snap
  if (!last) {
    return [
      undefined,
      {
        id,
        type,
        tags,
        rack,
        last,
        username,
        info,
        containerId,
        address,
        snap: { stats: {}, config: {} },
        err: 'Last Device info not found',
      },
    ]
  }

  const { err, snap, alerts } = last

  return [
    err,
    {
      id,
      type,
      tags,
      rack,
      snap: snap ?? { stats: {}, config: {} },
      alerts,
      username,
      info,
      containerId,
      address,
      err,
    },
  ]
}

export const appendContainerToTag = (deviceId: string): string => `container-${deviceId}`

export const getIsMinerPowerReadingAvailable = (model: string | undefined): boolean | undefined => {
  // COMPLETE_MINER_TYPES.ANTMINER_AM_S21 also covers s21pro
  if (model && _includes(_toLower(model), MINER_TYPE.WHATSMINER)) {
    return MinerPowerReadingAvailability[MINER_TYPE.WHATSMINER]
  }
  if (model && _includes(_toLower(model), MINER_TYPE.ANTMINER)) {
    const antminerMap = MinerPowerReadingAvailability[MINER_TYPE.ANTMINER] as Record<
      string,
      boolean
    >
    return antminerMap[model]
  }
  if (model && _includes(_toLower(model), MINER_TYPE.AVALON)) {
    return MinerPowerReadingAvailability[MINER_TYPE.AVALON]
  }
  return undefined
}

export const isMiner = (type: string | undefined): boolean => _startsWith(type, 'miner-')
