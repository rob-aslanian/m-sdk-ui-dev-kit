export type DeviceLast = {
  err?: string | null
  type?: string
  snap?: Partial<ContainerSnap>
  alerts?: unknown[] | null
  [key: string]: unknown
}

export type DeviceInfo = {
  container?: string
  pos?: string
  [key: string]: unknown
}

export type Device = {
  id: string
  type: string
  tags?: string[]
  rack?: string
  last?: DeviceLast
  username?: string
  info?: DeviceInfo
  containerId?: string
  address?: string | null
  [key: string]: unknown
}

export type DeviceData = {
  id: string
  type: string
  tags?: string[]
  rack?: string
  snap: ContainerSnap
  alerts?: unknown[]
  username?: string
  info?: DeviceInfo
  containerId?: string
  address?: string
  err?: string
  [key: string]: unknown
}

export type ContainerInfo = {
  container: string
  cooling_system: Record<string, unknown>
  cdu: Record<string, unknown>
  primary_supply_temp: number
  second_supply_temp1: number
  second_supply_temp2: number
  supply_liquid_temp: number
  supply_liquid_set_temp: number
  supply_liquid_pressure: number
  return_liquid_pressure: number
}

export type ChipData = {
  index: number
  current: number
}

export type TempChipData = {
  index: number
  max?: number
  min?: number
  avg?: number
}

export type StatsTemperatureC = {
  avg: number
  min: number
  max: number
  chips: TempChipData[]
  [key: string]: unknown
}

export type StatsFrequencyMhz = {
  avg: number
  chips: ChipData[]
  [key: string]: unknown
}

export type ContainerStats = {
  status: string
  ambient_temp_c: number
  humidity_percent: number
  power_w: number
  container_specific: Record<string, unknown>
  distribution_box1_power_w: number
  distribution_box2_power_w: number
  stats: Record<string, unknown>
  hashrate_mhs: { t_5m: 90000 }
  temperature_c: Partial<StatsTemperatureC>
  frequency_mhz: Partial<StatsFrequencyMhz>
  [key: string]: unknown
}

export type ContainerLast = {
  snap: {
    stats?: Partial<ContainerStats>
  }
  alerts: unknown[] | null
  err: string | null
}

export type Container = {
  info?: Partial<ContainerInfo>
  last?: Partial<ContainerLast>
} & Device

export type PowerMeter = {
  last?: {
    snap?: {
      stats?: {
        power_w?: number
      }
    }
  }
}

export type LvCabinetRecord = {
  id: string
  powerMeters?: PowerMeter[]
}

export type ContainerSnap = {
  stats?: Partial<ContainerStats>
  config?: Record<string, unknown>
}

export type MinerHashrateMhs = {
  t_5m?: number
}

export type MinerInfo = {
  container?: string
  pos?: string
  macAddress?: string
  serialNum?: string
}

export type MinerStats = {
  status?: string
  uptime_ms?: number
  power_w?: number
  hashrate_mhs?: MinerHashrateMhs
  poolHashrate?: string
  temperature_c?: { max?: number }
}

export type MinerConfig = {
  firmware_ver?: string
  power_mode?: string
  led_status?: boolean
}

export type MinerDeviceSnapshot = {
  last?: { snap?: { config?: MinerConfig } }
}

export type MinerRecord = {
  id?: string
  shortCode?: string
  info?: MinerInfo
  address?: string
  type?: string
  alerts?: unknown[]
  stats?: MinerStats
  config?: MinerConfig
  device?: MinerDeviceSnapshot
  error?: string
  err?: string
  isPoolStatsEnabled?: boolean
}
