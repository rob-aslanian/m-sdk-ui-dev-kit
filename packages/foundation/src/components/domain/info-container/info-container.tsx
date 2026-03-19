import type { ReactNode } from 'react'
import './info-container.scss'

// ---------------------------------------------------------------------------
// InfoContainer
// ---------------------------------------------------------------------------

export type InfoContainerProps = {
  title?: string
  value?: string | string[] | number
}

export const InfoContainer = ({ title, value }: InfoContainerProps): ReactNode => {
  const items: (string | number | undefined)[] = Array.isArray(value) ? value : [value]

  return (
    <div className="mining-sdk-info-container">
      <span className="mining-sdk-info-container__title">{title}</span>
      <div className="mining-sdk-info-container__value">
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DeviceInfo
// ---------------------------------------------------------------------------

type InfoItemForContainer = {
  title?: string
  value?: string | string[] | number
  [key: string]: unknown
}

type DeviceInfoProps = {
  data?: InfoItemForContainer[]
}

const normalizeValue = (
  value: string | string[] | number | undefined,
): string | string[] | undefined => {
  if (value === undefined || value === null) return
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(String)

  return String(value)
}

export const DeviceInfo = ({ data }: DeviceInfoProps): ReactNode => (
  <div className="mining-sdk-device-info">
    {data?.map((item, index) => (
      <InfoContainer
        key={index}
        title={item.title !== undefined ? String(item.title) : undefined}
        value={normalizeValue(item.value)}
      />
    ))}
  </div>
)
