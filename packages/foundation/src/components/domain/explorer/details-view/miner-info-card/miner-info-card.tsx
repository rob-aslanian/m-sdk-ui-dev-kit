import type { InfoContainerProps } from '../../../info-container/info-container'
import { DeviceInfo } from '../../../info-container/info-container'
import './miner-info-card.scss'

type MinerInfoCardProps = {
  data: InfoContainerProps[]
  label: string
}

export const MinerInfoCard = ({ data, label = 'Miner info' }: Partial<MinerInfoCardProps>) => {
  return (
    <div className="mining-sdk-miner-info-card">
      <span className="mining-sdk-miner-info-card__label">{label}</span>
      <DeviceInfo data={data} />
    </div>
  )
}
