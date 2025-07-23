import React from 'react';

import { SetlistThemeProps } from '@/types/components';

import { BaseTheme } from './BaseTheme';
import { blackThemeColors } from './themeColors';

export const BlackTheme: React.FC<SetlistThemeProps> = ({ data, className, lang }) => {
  return <BaseTheme data={data} className={className} colors={blackThemeColors} lang={lang} />;
};
