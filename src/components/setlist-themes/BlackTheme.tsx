import React from 'react';
import { BaseTheme } from './BaseTheme';
import { blackThemeColors } from './themeColors';
import { SetlistThemeProps } from './types';

export const BlackTheme: React.FC<SetlistThemeProps> = ({ data, className }) => {
  return <BaseTheme data={data} className={className} colors={blackThemeColors} />;
};
