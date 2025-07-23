import React from 'react';

import { SetlistThemeProps } from '@/types/components';

import { BaseTheme } from './BaseTheme';
import { whiteThemeColors } from './themeColors';

export const WhiteTheme: React.FC<SetlistThemeProps> = ({ data, className, lang }) => {
  return <BaseTheme data={data} className={className} colors={whiteThemeColors} lang={lang} />;
};
