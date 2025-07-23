/**
 * Feature descriptions for i18n system
 * 機能説明の多言語化
 */

export interface FeatureMessages {
  title: string;
  setlistManagement: {
    title: string;
    description: string;
  };
  songLibrary: {
    title: string;
    description: string;
  };
  imageGeneration: {
    title: string;
    description: string;
  };
  sharing: {
    title: string;
    description: string;
  };
  themes: {
    title: string;
    description: string;
  };
  qrCode: {
    title: string;
    description: string;
  };
}

// 日本語版
export const featuresJa: FeatureMessages = {
  title: '主な機能',
  setlistManagement: {
    title: 'セットリスト作成',
    description: '登録した楽曲からセットリストを作成します。',
  },
  songLibrary: {
    title: '楽曲管理',
    description: '楽曲の詳細情報（タイトル、アーティスト、キー、テンポ）を登録・管理します。',
  },
  imageGeneration: {
    title: '画像生成',
    description: '美しいセットリスト画像を生成',
  },
  sharing: {
    title: '共有',
    description: 'セットリストを簡単に共有',
  },
  themes: {
    title: 'テーマ',
    description: '複数のテーマから選択',
  },
  qrCode: {
    title: 'QRコード',
    description: 'QRコード経由でアクセス',
  },
};

// 英語版
export const featuresEn: FeatureMessages = {
  title: 'Main Features',
  setlistManagement: {
    title: 'Setlist Creation',
    description: 'Create setlists from your registered songs.',
  },
  songLibrary: {
    title: 'Song Management',
    description: 'Register and manage detailed song information (title, artist, key, tempo).',
  },
  imageGeneration: {
    title: 'Image Generation',
    description: 'Generate beautiful setlist images',
  },
  sharing: {
    title: 'Sharing',
    description: 'Easily share your setlists',
  },
  themes: {
    title: 'Themes',
    description: 'Choose from multiple themes',
  },
  qrCode: {
    title: 'QR Code',
    description: 'Access via QR code',
  },
};
