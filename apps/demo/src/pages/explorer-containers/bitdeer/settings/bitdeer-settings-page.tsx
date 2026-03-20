import type { ReactElement } from 'react'

import { BitdeerSettings } from '@mining-sdk/foundation'
import './bitdeer-settings-page.scss'

/**
 * Bitdeer Settings Demo Component
 *
 * Demonstrates various usage scenarios of the BitdeerSettings component
 * with different data configurations and states.
 */
export const BitdeerSettingsPage = (): ReactElement => {
  // Normal Operation
  const normalData = {
    id: 'container-bd-d40-001',
    type: 'container-bd-d40',
    status: 'online',
    name: 'Bitdeer Container D40',
    macAddress: '00:1B:44:11:3A:B7',
    serialNumber: 'BD-D40-2024-001',

    // Current readings
    oilTemperature: 42,
    tankPressure: 2.3,
    flowRate: 150,

    // Thresholds
    thresholds: {
      oilTemperature: {
        criticalLow: 33,
        alert: 39,
        normal: 42,
        alarm: 46,
        criticalHigh: 48,
      },
      tankPressure: {
        criticalLow: 2.0,
        alarmLow: 2.2,
        normal: 2.3,
        alarmHigh: 2.4,
        criticalHigh: 2.5,
      },
    },

    // Alarms configuration
    alarms: {
      oil_temp: { low_c: 33, high_c: 48 },
      water_temp: { low_c: 30, high_c: 45 },
      pressure_bar: 2.5,
    },

    // Set temperatures
    set_temps: {
      cold_oil_temp_c: 35,
      exhaust_fan_temp_c: 40,
    },
  }

  return (
    <div className="bitdeer-settings-demo">
      {/* Component Demo */}
      <section className="bitdeer-settings-demo__component">
        <h2>Component Output</h2>
        <div className="bitdeer-settings-demo__component-wrapper">
          <BitdeerSettings data={normalData} />
        </div>
      </section>
    </div>
  )
}
