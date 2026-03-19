import { cn } from '@mining-sdk/core'
import type { InfoContainerProps } from '../../../info-container/info-container'
import { DeviceInfo } from '../../../info-container/info-container'
import './miner-info-card.scss'

type MinerInfoCardProps = {
  data?: InfoContainerProps[]
  isDark?: boolean
  label?: string
}

export const MinerInfoCard = ({ data, isDark, label = 'Miner info' }: MinerInfoCardProps) => {
  return (
    <div
      className={cn('mining-sdk-miner-info-card', { 'mining-sdk-miner-info-card--dark': isDark })}
    >
      <span className="mining-sdk-miner-info-card__label">{label}</span>
      <DeviceInfo data={data} />
    </div>
  )
}
