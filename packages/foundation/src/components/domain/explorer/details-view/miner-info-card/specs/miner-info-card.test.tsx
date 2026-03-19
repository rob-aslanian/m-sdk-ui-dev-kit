import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MinerInfoCard } from '../miner-info-card'

vi.mock('@mining-sdk/core', () => ({
  cn: (...args: unknown[]) =>
    args
      .flatMap((a) =>
        typeof a === 'string'
          ? a
          : typeof a === 'object' && a !== null
            ? Object.entries(a)
                .filter(([, v]) => Boolean(v))
                .map(([k]) => k)
            : [],
      )
      .join(' '),
}))

vi.mock('../../../../info-container/info-container', () => ({
  DeviceInfo: vi.fn(({ data }) => <div data-testid="device-info">{JSON.stringify(data)}</div>),
}))

describe('MinerInfoCard', () => {
  describe('rendering', () => {
    it('renders the wrapper with correct class', () => {
      const { container } = render(<MinerInfoCard />)

      expect(container.querySelector('.mining-sdk-miner-info-card')).toBeInTheDocument()
    })

    it('renders the label element', () => {
      render(<MinerInfoCard />)

      expect(document.querySelector('.mining-sdk-miner-info-card__label')).toBeInTheDocument()
    })

    it('renders DeviceInfo', () => {
      render(<MinerInfoCard />)

      expect(screen.getByTestId('device-info')).toBeInTheDocument()
    })
  })

  describe('label', () => {
    it('displays the default label', () => {
      render(<MinerInfoCard />)

      expect(screen.getByText('Miner info')).toBeInTheDocument()
    })

    it('displays a custom label', () => {
      render(<MinerInfoCard label="Device details" />)

      expect(screen.getByText('Device details')).toBeInTheDocument()
    })
  })

  describe('dark mode', () => {
    it('does not apply dark class by default', () => {
      const { container } = render(<MinerInfoCard />)

      expect(container.querySelector('.mining-sdk-miner-info-card--dark')).not.toBeInTheDocument()
    })

    it('applies dark class when isDark is true', () => {
      const { container } = render(<MinerInfoCard isDark />)

      expect(container.querySelector('.mining-sdk-miner-info-card--dark')).toBeInTheDocument()
    })

    it('does not apply dark class when isDark is false', () => {
      const { container } = render(<MinerInfoCard isDark={false} />)

      expect(container.querySelector('.mining-sdk-miner-info-card--dark')).not.toBeInTheDocument()
    })
  })

  describe('data', () => {
    it('passes undefined data to DeviceInfo when not provided', () => {
      render(<MinerInfoCard />)

      expect(screen.getByTestId('device-info').textContent).toBe('')
    })

    it('passes data to DeviceInfo', () => {
      const data = [
        { title: 'Model', value: 'S19' },
        { title: 'IP', value: '192.168.1.1' },
      ]
      render(<MinerInfoCard data={data} />)

      const deviceInfo = screen.getByTestId('device-info')
      expect(deviceInfo.textContent).toContain('Model')
      expect(deviceInfo.textContent).toContain('S19')
      expect(deviceInfo.textContent).toContain('IP')
      expect(deviceInfo.textContent).toContain('192.168.1.1')
    })

    it('passes array value data to DeviceInfo', () => {
      const data = [{ title: 'Tags', value: ['a', 'b', 'c'] }]
      render(<MinerInfoCard data={data} />)

      const deviceInfo = screen.getByTestId('device-info')
      expect(deviceInfo.textContent).toContain('Tags')
      expect(deviceInfo.textContent).toContain('a')
    })

    it('passes empty array to DeviceInfo', () => {
      render(<MinerInfoCard data={[]} />)

      expect(screen.getByTestId('device-info').textContent).toBe('[]')
    })
  })
})
