import React from 'react';
import { BaseTheme } from './BaseTheme';
import { whiteThemeColors } from './themeColors';
import { SetlistThemeProps } from './types';

export const WhiteTheme: React.FC<SetlistThemeProps> = ({ data, className }) => {
  return <BaseTheme data={data} className={className} colors={whiteThemeColors} />;
};
