import { Checkbox, Label } from '@mining-sdk/core'
import type { ContainerStats } from '@mining-sdk/foundation'
import { MinerChipsCard } from '@mining-sdk/foundation'
import type { ReactElement } from 'react'
import { useState } from 'react'
import './miner-chips-card-demo.scss'

// Demo data presets
const DEMO_PRESETS = {
  threeChips: {
    frequency_mhz: {
      chips: [
        { index: 0, current: 850 },
        { index: 1, current: 860 },
        { index: 2, current: 855 },
      ],
    },
    temperature_c: {
      chips: [
        { index: 0, avg: 65, min: 60, max: 70 },
        { index: 1, avg: 66, min: 61, max: 71 },
        { index: 2, avg: 64, min: 59, max: 69 },
      ],
    },
  },
  singleChipNormal: {
    frequency_mhz: {
      chips: [{ index: 0, current: 850 }],
    },
    temperature_c: {
      chips: [{ index: 0, avg: 65, min: 60, max: 70 }],
    },
  },
  singleChipHighTemp: {
    frequency_mhz: {
      chips: [{ index: 0, current: 920 }],
    },
    temperature_c: {
      chips: [{ index: 0, avg: 82, min: 78, max: 88 }],
    },
  },
  tenChips: {
    frequency_mhz: {
      chips: Array.from({ length: 10 }, (_, i) => ({
        index: i,
        current: 845 + Math.random() * 30,
      })),
    },
    temperature_c: {
      chips: Array.from({ length: 10 }, (_, i) => ({
        index: i,
        avg: 62 + Math.random() * 15,
        min: 58 + Math.random() * 10,
        max: 68 + Math.random() * 20,
      })),
    },
  },
  variableTemps: {
    frequency_mhz: {
      chips: [
        { index: 0, current: 850 },
        { index: 1, current: 855 },
        { index: 2, current: 860 },
        { index: 3, current: 865 },
      ],
    },
    temperature_c: {
      chips: [
        { index: 0, avg: 55, min: 50, max: 60 },
        { index: 1, avg: 70, min: 65, max: 75 },
        { index: 2, avg: 85, min: 80, max: 90 },
        { index: 3, avg: 62, min: 58, max: 66 },
      ],
    },
  },
  partialData: {
    frequency_mhz: {
      chips: [
        { index: 0, current: 850 },
        { index: 1, current: 860 },
        { index: 2, current: 855 },
      ],
    },
    temperature_c: {
      chips: [
        { index: 0, avg: 65, min: 60, max: 70 },
        { index: 2, avg: 64, min: 59, max: 69 },
      ],
    },
  },
  lowFrequency: {
    frequency_mhz: {
      chips: [
        { index: 0, current: 400 },
        { index: 1, current: 410 },
        { index: 2, current: 405 },
      ],
    },
    temperature_c: {
      chips: [
        { index: 0, avg: 45, min: 40, max: 50 },
        { index: 1, avg: 46, min: 41, max: 51 },
        { index: 2, avg: 44, min: 39, max: 49 },
      ],
    },
  },
} as const

/**
 * Miner Chips Card Demo
 *
 * Interactive demonstration of MinerChipsCard component
 */
export const MinerChipsCardDemo = (): ReactElement => {
  const [customChipCount, setCustomChipCount] = useState(3)
  const [useCustom, setUseCustom] = useState(false)

  const generateCustomData = (): ContainerStats => {
    return {
      frequency_mhz: {
        chips: Array.from({ length: customChipCount }, (_, i) => ({
          index: i,
          current: 800 + Math.random() * 100,
        })),
      },
      temperature_c: {
        chips: Array.from({ length: customChipCount }, (_, i) => ({
          index: i,
          avg: 60 + Math.random() * 20,
          min: 55 + Math.random() * 10,
          max: 65 + Math.random() * 25,
        })),
      },
    } as ContainerStats
  }

  const getCurrentData = (): ContainerStats => {
    if (useCustom) {
      return generateCustomData()
    }
    return DEMO_PRESETS.threeChips as unknown as ContainerStats
  }

  const currentData = getCurrentData()

  const getChipCount = (): number => {
    return currentData?.frequency_mhz?.chips?.length || 0
  }

  const getAvgFrequency = (): number => {
    const chips = currentData?.frequency_mhz?.chips || []
    if (chips.length === 0) return 0
    const sum = chips.reduce((acc, chip) => acc + chip.current, 0)
    return sum / chips.length
  }

  const getAvgTemperature = (): number => {
    const chips = currentData?.temperature_c?.chips || []
    if (chips.length === 0) return 0
    const sum = chips.reduce((acc, chip) => acc + (chip.avg || 0), 0)
    return sum / chips.length
  }

  const getMaxTemperature = (): number => {
    const chips = currentData?.temperature_c?.chips || []
    if (chips.length === 0) return 0
    return Math.max(...chips.map((chip) => chip.max || 0))
  }

  return (
    <div className="miner-chips-card-demo">
      <div className="miner-chips-card-demo__header">
        <h1>Miner Chips Card Demo</h1>
        <p>Display individual chip frequencies and temperatures</p>
      </div>

      <div className="miner-chips-card-demo__controls">
        <div className="miner-chips-card-demo__section">
          <h3>Configuration</h3>

          <div className="miner-chips-card-demo__toggles">
            <label className="miner-chips-card-demo__checkbox">
              <Label htmlFor="customGenerator">Use Custom Generator</Label>
              <Checkbox
                id="customGenerator"
                defaultChecked={useCustom}
                onCheckedChange={(e) => setUseCustom(e as boolean)}
              />
            </label>
          </div>

          {useCustom && (
            <div className="miner-chips-card-demo__control-group">
              <label>
                <span>Number of Chips: {customChipCount}</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={customChipCount}
                  onChange={(e) => setCustomChipCount(Number(e.target.value))}
                />
              </label>
            </div>
          )}
        </div>

        <div className="miner-chips-card-demo__section">
          <h3>Current Stats</h3>
          <div className="miner-chips-card-demo__summary">
            <div className="miner-chips-card-demo__summary-item">
              <span className="label">Total Chips:</span>
              <span className="value">{getChipCount()}</span>
            </div>
            <div className="miner-chips-card-demo__summary-item">
              <span className="label">Avg Frequency:</span>
              <span className="value">{getAvgFrequency().toFixed(2)} MHz</span>
            </div>
            <div className="miner-chips-card-demo__summary-item">
              <span className="label">Avg Temperature:</span>
              <span className="value">{getAvgTemperature().toFixed(2)}°C</span>
            </div>
            <div className="miner-chips-card-demo__summary-item">
              <span className="label">Max Temperature:</span>
              <span className="value">{getMaxTemperature().toFixed(2)}°C</span>
            </div>
          </div>
        </div>
      </div>

      <div className="miner-chips-card-demo__preview">
        <h3>Live Preview</h3>
        <div className="miner-chips-card-demo__card-wrapper">
          <MinerChipsCard data={currentData} />
        </div>
      </div>

      <div className="miner-chips-card-demo__examples">
        <h2>Preset Examples</h2>

        <div className="miner-chips-card-demo__grid">
          <div className="miner-chips-card-demo__example">
            <h4>3 Chips - Normal Operation</h4>
            <MinerChipsCard data={DEMO_PRESETS.threeChips as unknown as ContainerStats} />
          </div>

          <div className="miner-chips-card-demo__example">
            <h4>Single Chip - High Temperature</h4>
            <MinerChipsCard data={DEMO_PRESETS.singleChipHighTemp as unknown as ContainerStats} />
          </div>

          <div className="miner-chips-card-demo__example">
            <h4>Variable Temperatures</h4>
            <MinerChipsCard data={DEMO_PRESETS.variableTemps as unknown as ContainerStats} />
          </div>

          <div className="miner-chips-card-demo__example">
            <h4>Low Frequency Mode</h4>
            <MinerChipsCard data={DEMO_PRESETS.lowFrequency as unknown as ContainerStats} />
          </div>
        </div>

        <div className="miner-chips-card-demo__section">
          <h3>Large Scale Example</h3>
          <div className="miner-chips-card-demo__full-width">
            <h4>10 Chips</h4>
            <MinerChipsCard data={DEMO_PRESETS.tenChips as ContainerStats} />
          </div>
        </div>

        <div className="miner-chips-card-demo__section">
          <h3>Edge Case: Partial Data</h3>
          <div className="miner-chips-card-demo__full-width">
            <p className="miner-chips-card-demo__note">
              Only displays chips with complete frequency and temperature data. Chip 1 is missing
              temperature data and won't be displayed.
            </p>
            <MinerChipsCard data={DEMO_PRESETS.partialData as unknown as ContainerStats} />
          </div>
        </div>
      </div>
    </div>
  )
}
