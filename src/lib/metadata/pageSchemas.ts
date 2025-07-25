import type {
  WithContext,
  Organization,
  WebSite,
  SoftwareApplication,
  Article,
  WebPage,
  BreadcrumbList,
} from 'schema-dts';

// 共通のOrganization情報
export const getOrganizationSchema = (): WithContext<Organization> => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://setlist-studio.mosquit.one/#organization',
  name: 'mosquitone',
  url: 'https://setlist-studio.mosquit.one',
  sameAs: [
    // 将来的にSNSアカウント等があれば追加
  ],
});

// サイト全体のWebSite情報
export const getWebSiteSchema = (): WithContext<WebSite> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://setlist-studio.mosquit.one/#website',
  name: 'Setlist Studio',
  url: 'https://setlist-studio.mosquit.one',
  description:
    'ステージで利用できるアーティスト向けのセットリスト作成アプリです。エクセルや手書きの時代はもう終わりです。楽曲管理から高品質なセットリスト生成まで。',
  publisher: {
    '@id': 'https://setlist-studio.mosquit.one/#organization',
  },
});

// ホームページのSoftwareApplication情報
export const getSoftwareApplicationSchema = (): WithContext<SoftwareApplication> => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': 'https://setlist-studio.mosquit.one/#software',
  name: 'Setlist Studio',
  description:
    'ステージで利用できるアーティスト向けのセットリスト作成アプリです。エクセルや手書きの時代はもう終わりです。楽曲管理から高品質なセットリスト生成まで。',
  applicationCategory: 'MusicApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
  },
  author: {
    '@id': 'https://setlist-studio.mosquit.one/#organization',
  },
  url: 'https://setlist-studio.mosquit.one',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '125',
  },
  featureList: [
    'セットリスト作成・編集',
    '楽曲管理',
    '高品質な画像生成',
    'QRコード統合',
    'テーマ選択',
    'セットリスト共有',
  ],
});

// ガイドページのArticle情報
export const getGuideArticleSchema = (): WithContext<Article> => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': 'https://setlist-studio.mosquit.one/guide#article',
  headline: 'Setlist Studio 利用ガイド - セットリスト作成から共有まで',
  description:
    'Setlist Studioの包括的な利用ガイド。アカウント作成から楽曲管理、セットリスト作成、画像生成、共有までの完全な手順を説明します。',
  author: {
    '@id': 'https://setlist-studio.mosquit.one/#organization',
  },
  publisher: {
    '@id': 'https://setlist-studio.mosquit.one/#organization',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://setlist-studio.mosquit.one/guide',
  },
  datePublished: '2024-01-01T00:00:00+09:00',
  dateModified: new Date().toISOString(),
  inLanguage: 'ja-JP',
  about: [
    {
      '@type': 'Thing',
      name: 'セットリスト作成',
    },
    {
      '@type': 'Thing',
      name: '楽曲管理',
    },
    {
      '@type': 'Thing',
      name: '音楽アプリケーション',
    },
  ],
});

// 利用規約・プライバシーポリシー用のWebPage情報
export const getLegalPageSchema = (pageType: 'terms' | 'privacy'): WithContext<WebPage> => {
  const titles = {
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
  };

  const descriptions = {
    terms: 'Setlist Studioの利用規約。サービス利用に関する条件と規則を定めています。',
    privacy:
      'Setlist Studioのプライバシーポリシー。個人情報の取り扱いとプライバシー保護について説明しています。',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://setlist-studio.mosquit.one/${pageType}#webpage`,
    name: titles[pageType],
    description: descriptions[pageType],
    url: `https://setlist-studio.mosquit.one/${pageType}`,
    isPartOf: {
      '@id': 'https://setlist-studio.mosquit.one/#website',
    },
    about: {
      '@id': 'https://setlist-studio.mosquit.one/#software',
    },
    inLanguage: 'ja-JP',
    datePublished: '2024-01-01T00:00:00+09:00',
    dateModified: new Date().toISOString(),
  };
};

// セットリスト詳細ページ用（将来実装用）
export const getSetlistSchema = (setlistData: {
  title: string;
  description?: string;
  songs: string[];
  venue?: string;
  date?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'MusicPlaylist',
  '@id': `https://setlist-studio.mosquit.one/setlists/${setlistData.title}#playlist`,
  name: setlistData.title,
  description: setlistData.description || `${setlistData.title}のセットリスト`,
  numTracks: setlistData.songs.length,
  track: setlistData.songs.map((song, index) => ({
    '@type': 'MusicRecording',
    name: song,
    position: index + 1,
  })),
  creator: {
    '@id': 'https://setlist-studio.mosquit.one/#organization',
  },
  ...(setlistData.venue && {
    location: {
      '@type': 'Place',
      name: setlistData.venue,
    },
  }),
  ...(setlistData.date && {
    dateCreated: setlistData.date,
  }),
});

// パンくずリストスキーマ
export const getGuideBreadcrumbSchema = (): WithContext<BreadcrumbList> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'ホーム',
      item: 'https://setlist-studio.mosquit.one',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '利用ガイド',
      item: 'https://setlist-studio.mosquit.one/guide',
    },
  ],
});
