import React from 'react';
import { SetlistData, SetlistThemeProps } from './types';
import { BlackTheme } from './BlackTheme';
import { WhiteTheme } from './WhiteTheme';

interface SetlistRendererProps {
  data: SetlistData;
  className?: string;
}

export const SetlistRenderer: React.FC<SetlistRendererProps> = ({ data, className }) => {
  const props: SetlistThemeProps = { data, className };

  switch (data.theme) {
    case 'black':
      return <BlackTheme {...props} />;
    case 'white':
      return <WhiteTheme {...props} />;
    default:
      return <BlackTheme {...props} />;
  }
};

export default SetlistRenderer;
