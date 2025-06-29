import React from 'react'
import { SetlistData, SetlistThemeProps } from './types'
import { BasicTheme } from './BasicTheme'
import { MQTNTheme } from './MQTNTheme'
import { MinimalTheme } from './MinimalTheme'
import { MQTN2Theme } from './MQTN2Theme'

interface SetlistRendererProps {
  data: SetlistData
  className?: string
}

export const SetlistRenderer: React.FC<SetlistRendererProps> = ({ data, className }) => {
  const props: SetlistThemeProps = { data, className }

  switch (data.theme) {
    case 'basic':
      return <BasicTheme {...props} />
    case 'mqtn':
      return <MQTNTheme {...props} />
    case 'minimal':
      return <MinimalTheme {...props} />
    case 'mqtn2':
      return <MQTN2Theme {...props} />
    default:
      return <BasicTheme {...props} />
  }
}

export default SetlistRenderer
