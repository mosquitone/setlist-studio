import React from 'react';

import { Language } from '@/lib/i18n/messages';
import { SetlistData, SetlistThemeProps } from '@/types/components';

import { BlackTheme } from './theme/BlackTheme';
import { WhiteTheme } from './theme/WhiteTheme';

interface SetlistRendererProps {
  data: SetlistData;
  className?: string;
  lang?: Language;
}

export const SetlistRenderer: React.FC<SetlistRendererProps> = ({ data, className, lang }) => {
  const props: SetlistThemeProps = { data, className, lang };

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
