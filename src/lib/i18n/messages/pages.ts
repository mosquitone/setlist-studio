// ページ関連のメッセージ定義
export const pagesJa = {
  home: {
    title: 'Setlist Studio',
    description: 'シンプルで直感的なセットリスト管理',
    subtitle: 'バンド向けセットリスト作成ツール',
    heroTitle: 'ステージで使えるセットリスト作成アプリ',
    heroSubtitle: 'ExcelやA4用紙に手書きの時代は終わりです。',
    sampleSetlists: {
      title: 'サンプルセットリスト',
      description: 'Setlist Studioで作成できるセットリストの例をご覧ください',
      blackTheme: 'ブラックテーマ',
      whiteTheme: 'ホワイトテーマ',
      blackThemeAlt: 'サンプルセットリスト - ブラックテーマ',
      whiteThemeAlt: 'サンプルセットリスト - ホワイトテーマ',
      footer: 'このようなセットリストを簡単に作成・ダウンロードできます',
    },
    dashboard: {
      title: 'あなたのセットリスト',
      loading: 'セットリストを読み込み中...',
      empty: {
        title: 'まだセットリストがありません',
        description: 'はじめてのセットリストを作成して、パフォーマンスリストを管理しましょう',
        createButton: 'セットリストを作成',
      },
      public: '公開',
      private: '非公開',
      white: 'ホワイト',
      black: 'ブラック',
      songsCount: '曲',
      edit: '編集',
      delete: {
        title: 'セットリストを削除',
        itemType: 'セットリスト',
        button: '削除',
      },
      actions: {
        view: '詳細',
        edit: '編集',
        delete: '削除',
        duplicate: '複製',
      },
    },
    authActions: {
      loginButton: 'ログイン',
      registerButton: '新規登録',
      welcomeUser: '様、お帰りなさい',
      continueManaging: '楽曲とセットリストの管理を続けましょう',
    },
  },
  profile: {
    title: 'プロフィール',
    description: 'アカウント情報を管理',
  },
  guide: {
    title: 'ガイド',
    description: 'Setlist Studioの使い方',
    subtitle: '機能と使用方法の完全ガイド',
    aboutSection: {
      title: 'Setlist Studioについて',
      description1:
        'Setlist Studioは、バンドや音楽グループ向けのセットリスト生成・管理ツールです。楽曲情報を管理し、高品質なセットリスト画像を簡単に作成できます。',
      description2:
        'セットリストは「公開」または「非公開」として管理でき、公開セットリストはアカウント登録なしでも閲覧・ダウンロードが可能です。',
      description3:
        'Setlist Studioは完全無料でご利用いただけます。アカウント登録、楽曲管理、セットリスト作成、画像生成など、すべての機能を料金なしでお使いいただけます。',
      alertInfo:
        '公開セットリストは共有URLを知っている人なら誰でもアクセスできます。非公開セットリストは所有者のみが閲覧できます。',
    },
    featureComparison: {
      title: '利用可能な機能',
      features: '機能',
      unregisteredUser: '未登録ユーザー',
      registeredUser: '登録ユーザー',
      publicSetlistView: '公開セットリスト閲覧',
      imageDownload: '画像ダウンロード（黒/白テーマ）',
      setlistShare: 'セットリスト共有（URL コピー）',
      setlistManagement: 'セットリスト作成・編集・削除',
      songDatabase: '楽曲データベース管理',
      publicitySettings: 'セットリスト公開設定変更',
      duplicateFunction: '自分のセットリスト複製機能',
      personalDashboard: '個人ダッシュボード',
      profileManagement: 'プロフィール管理',
    },
    accountBenefits: {
      title: 'アカウント作成でより便利に',
      description: '無料アカウントを作成すると、公開機能に加えて以下の機能が利用できます：',
      signUpNow: '今すぐ無料登録！',
      signUpDescription: 'アカウント作成・楽曲管理・セットリスト作成、すべて完全無料です。',
      setlistCreation: {
        title: 'セットリスト作成',
        description: '無制限にオリジナルセットリストを作成・編集',
      },
      songManagement: {
        title: '楽曲管理',
        description: '個人の楽曲データベースで楽曲情報を効率的に管理',
      },
      privateFeatures: {
        title: 'プライベート機能',
        description: '非公開セットリストや個人設定などの管理機能',
      },
    },
    authentication: {
      title: '認証・パスワード関連手順',
      emailAuth: {
        title: 'メール認証の手順',
        step1: 'アカウント作成後、登録メールアドレスに認証メールが送信されます',
        step2: 'メール内の「メールアドレスを認証」ボタンをクリック',
        step3: '認証完了後、全機能が利用可能になります',
        note: '※メール認証完了まで、セットリスト作成等の機能は利用できません',
      },
      emailVerification: {
        title: 'メール認証',
        description: 'メールアドレス認証の手順です',
        step1: 'アカウント作成後、登録メールアドレスに認証メールが送信されます',
        step2: 'メール内の「メールアドレスを認証」ボタンをクリック',
        step3: '認証完了後、全機能が利用可能になります',
        step4: '認証完了後、ログインページからログイン',
      },
      passwordReset: {
        title: 'パスワードリセットの手順',
        description: 'パスワードを忘れた場合の手順です',
        step1: 'ログインページの「パスワードを忘れた方はこちら」をクリック',
        step2: '登録済みメールアドレスを入力して送信',
        step3: 'メール内のリセットリンクから新しいパスワードを設定',
        step4: '新しいパスワードでログイン',
        note: '※リセットリンクの有効期限は1時間です',
      },
      emailChange: {
        title: 'メールアドレス変更の手順',
        step1: 'プロフィールページの「メールアドレス変更」から新しいアドレスを入力',
        step2: '新しいメールアドレスに確認メールが送信されます',
        step3: 'メール内の確認リンクをクリックして変更を確定',
        note: '※変更リンクの有効期限は24時間です',
      },
    },
    publicUsage: {
      title: '公開機能の利用方法',
      description: 'アカウント登録なしでも利用できる機能です',
      step1: {
        title: 'URLアクセス',
        description: '公開セットリストのURLにアクセス',
      },
      step2: {
        title: 'コンテンツ閲覧',
        description: 'セットリスト内容を閲覧',
      },
      step3: {
        title: '画像ダウンロード',
        description: '画像ダウンロード（黒/白テーマ選択可能）',
      },
      step4: {
        title: 'URL共有',
        description: 'URLコピーで他の人と共有',
      },
      viewPublicSetlists: 'セットリスト閲覧',
      downloadImages: '画像ダウンロード',
      shareUrls: 'URL共有',
    },
    pageDetails: {
      title: '詳細ページ機能',
      homePage: {
        title: 'ホームページ',
        unregisteredDescription: 'アプリケーションの紹介とアカウント作成への案内',
        registeredDescription:
          'あなたのセットリスト一覧を表示する個人ダッシュボード。各セットリストはカード形式で表示され、直接閲覧・編集できます。',
        feature1: 'セットリスト作成への素早いアクセス',
        feature2: 'レスポンシブグリッドレイアウト',
        feature3: 'テーマベースのカードデザイン',
      },
      setlistDetail: {
        title: 'セットリスト詳細ページ',
        description: 'セットリストの詳細表示と各種操作が可能です。',
        feature1: '楽曲リストとイベント情報表示',
        feature2: 'テーマ変更（ブラック/ホワイト）',
        feature3: '高品質画像ダウンロード',
        feature4: 'URL共有機能',
        feature5: '編集機能（所有者のみ）',
        feature6: '複製機能（ログインユーザー）',
      },
      songManagement: {
        title: '楽曲管理ページ',
        description: '個人の楽曲データベースを管理できます。',
        feature1: '楽曲の追加・編集・削除',
        feature2: 'タイトル、アーティスト、キー、テンポ管理',
        feature3: '演奏時間とメモ機能',
        feature4: 'セットリスト作成時の楽曲選択',
      },
      setlistCreation: {
        title: 'セットリスト作成ページ',
        description: '新しいセットリストを作成できます。',
        feature1: '基本情報設定（タイトル、アーティスト名）',
        feature2: 'イベント情報（会場、日時、開演時間）',
        feature3: '楽曲追加とドラッグ&ドロップ並び替え',
        feature4: '最大20曲まで追加可能',
        feature5: 'テーマ選択（ブラック/ホワイト）',
        feature6: '非公開/公開設定',
        feature7: '複製元がある場合の自動入力',
      },
      profile: {
        title: 'プロフィールページ',
        description: 'アカウント情報の確認・管理ができます。',
        feature1: 'ユーザー名の変更・メールアドレス表示',
        feature2: 'メールアドレス変更（確認メール付き）',
        feature3: 'パスワード変更（メール認証ユーザーのみ）',
        feature4: '認証方法の確認（メール/Google）',
        feature5: 'Google→メール認証への切り替え',
        feature6: 'アカウント削除機能',
      },
    },
  },
  privacy: {
    title: 'プライバシーポリシー',
  },
  terms: {
    title: '利用規約',
  },
} as const;

export const pagesEn = {
  home: {
    title: 'Setlist Studio',
    description: 'Setlist management app',
    subtitle: 'Setlist creation tool for bands',
    heroTitle: 'Setlist creation app for artists that can be used on stage.',
    heroSubtitle: 'The era of Excel and handwritten lists is over.',
    sampleSetlists: {
      title: 'Sample Setlists',
      description: 'See examples of setlists that can be created with Setlist Studio',
      blackTheme: 'Black Theme',
      whiteTheme: 'White Theme',
      blackThemeAlt: 'Sample Setlist - Black Theme',
      whiteThemeAlt: 'Sample Setlist - White Theme',
      footer: 'You can easily create and download setlists like these',
    },
    dashboard: {
      title: 'Your Setlists',
      loading: 'Loading setlists...',
      empty: {
        title: "You don't have any setlists yet",
        description: 'Create your first setlist to start managing your performance lists',
        createButton: 'Create Setlist',
      },
      public: 'Public',
      private: 'Private',
      white: 'White',
      black: 'Black',
      songsCount: 'songs',
      edit: 'Edit',
      delete: {
        title: 'Delete Setlist',
        itemType: 'Setlist',
        button: 'Delete',
      },
      actions: {
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        duplicate: 'Duplicate',
      },
    },
    authActions: {
      loginButton: 'Login',
      registerButton: 'Sign Up',
      welcomeUser: 'Welcome back,',
      continueManaging: 'Continue managing your songs and setlists',
    },
  },
  profile: {
    title: 'Profile',
    description: 'Manage your account information',
  },
  guide: {
    title: 'Guide',
    description: 'How to use Setlist Studio',
    subtitle: 'Complete guide to features and usage',
    aboutSection: {
      title: 'About Setlist Studio',
      description1:
        'Setlist Studio is a setlist generation and management tool for bands and music groups. You can manage song information and easily create high-quality setlist images.',
      description2:
        'Setlists can be managed as "Public" or "Private", and public setlists can be viewed and downloaded without account registration.',
      description3:
        'Setlist Studio is completely free to use. You can use all features including account registration, song management, setlist creation, and image generation without any charges.',
      alertInfo:
        'Public setlists can be accessed by anyone who knows the sharing URL. Private setlists can only be viewed by the owner.',
    },
    featureComparison: {
      title: 'Available Features',
      features: 'Features',
      unregisteredUser: 'Unregistered User',
      registeredUser: 'Registered User',
      publicSetlistView: 'Public Setlist View',
      imageDownload: 'Image Download (Black/White Theme)',
      setlistShare: 'Setlist Sharing (URL Copy)',
      setlistManagement: 'Setlist Creation/Edit/Delete',
      songDatabase: 'Song Database Management',
      publicitySettings: 'Setlist Public Setting Change',
      duplicateFunction: 'Own Setlist Duplicate Function',
      personalDashboard: 'Personal Dashboard',
      profileManagement: 'Profile Management',
    },
    accountBenefits: {
      title: 'More Convenient with Account Creation',
      description:
        'By creating a free account, you can use the following features in addition to public features:',
      signUpNow: 'Sign Up Now for Free!',
      signUpDescription:
        'Account creation, song management, and setlist creation are all completely free.',
      setlistCreation: {
        title: 'Setlist Creation',
        description: 'Create and edit unlimited original setlists',
      },
      songManagement: {
        title: 'Song Management',
        description: 'Efficiently manage song information with personal song database',
      },
      privateFeatures: {
        title: 'Private Features',
        description: 'Management functions for private setlists and personal settings',
      },
    },
    authentication: {
      title: 'Authentication & Password Procedures',
      emailAuth: {
        title: 'Email Authentication Steps',
        step1:
          'After account creation, a verification email will be sent to your registered email address',
        step2: 'Click the "Verify Email Address" button in the email',
        step3: 'After verification is complete, all features become available',
        note: '※Until email verification is complete, features like setlist creation are not available',
      },
      emailVerification: {
        title: 'Email Verification',
        description: 'Steps for email address verification',
        step1:
          'After account creation, a verification email will be sent to your registered email address',
        step2: 'Click the "Verify Email Address" button in the email',
        step3: 'After verification is complete, all features become available',
        step4: 'After verification, login from the login page',
      },
      passwordReset: {
        title: 'Password Reset Steps',
        description: 'Steps to follow when you forget your password',
        step1: 'Click "Forgot your password?" on the login page',
        step2: 'Enter your registered email address and submit',
        step3: 'Set a new password from the reset link in the email',
        step4: 'Login with your new password',
        note: '※Reset link is valid for 1 hour',
      },
      emailChange: {
        title: 'Email Address Change Steps',
        step1: 'Enter new address from "Change Email Address" on profile page',
        step2: 'A confirmation email will be sent to the new email address',
        step3: 'Click the confirmation link in the email to finalize the change',
        note: '※Change link is valid for 24 hours',
      },
    },
    publicUsage: {
      title: 'How to Use Public Features',
      description: 'Features available without account registration',
      step1: {
        title: 'Access URL',
        description: 'Access public setlist URL',
      },
      step2: {
        title: 'View Content',
        description: 'View setlist content',
      },
      step3: {
        title: 'Download Images',
        description: 'Download images (black/white theme selectable)',
      },
      step4: {
        title: 'Share URL',
        description: 'Share with others by copying URL',
      },
      viewPublicSetlists: 'View setlists',
      downloadImages: 'Download images',
      shareUrls: 'Share URLs',
    },
    pageDetails: {
      title: 'Detailed Page Features',
      homePage: {
        title: 'Home Page',
        unregisteredDescription: 'Introduction to the application and guide to account creation',
        registeredDescription:
          'Personal dashboard displaying your setlist overview. Each setlist is displayed in card format and can be directly viewed and edited.',
        feature1: 'Quick access to setlist creation',
        feature2: 'Responsive grid layout',
        feature3: 'Theme-based card design',
      },
      setlistDetail: {
        title: 'Setlist Detail Page',
        description: 'Detailed display of setlists and various operations.',
        feature1: 'Song list and event information display',
        feature2: 'Theme change (Black/White)',
        feature3: 'High-quality image download',
        feature4: 'URL sharing function',
        feature5: 'Edit function (owner only)',
        feature6: 'Duplicate function (logged in users)',
      },
      songManagement: {
        title: 'Song Management Page',
        description: 'You can manage your personal song database.',
        feature1: 'Adding, editing, and deleting songs',
        feature2: 'Title, artist, key, tempo management',
        feature3: 'Playing time and memo function',
        feature4: 'Song selection when creating setlists',
      },
      setlistCreation: {
        title: 'Setlist Creation Page',
        description: 'You can create new setlists.',
        feature1: 'Basic information setting (title, artist name)',
        feature2: 'Event information (venue, date, start time)',
        feature3: 'Song addition and drag & drop sorting',
        feature4: 'Up to 20 songs can be added',
        feature5: 'Theme selection (Black/White)',
        feature6: 'Private/Public setting',
        feature7: 'Auto-fill when there is a duplicate source',
      },
      profile: {
        title: 'Profile Page',
        description: 'You can check and manage your account information.',
        feature1: 'Username editing and email address display',
        feature2: 'Email address change (with confirmation email)',
        feature3: 'Password change (email auth users only)',
        feature4: 'Authentication method display (Email/Google)',
        feature5: 'Switch from Google to email authentication',
        feature6: 'Account deletion function',
      },
    },
  },
  privacy: {
    title: 'Privacy Policy',
  },
  terms: {
    title: 'Terms of Service',
  },
} as const;

// 共通の型定義インターフェース
export interface PageMessages {
  home: {
    title: string;
    description: string;
    subtitle: string;
    heroTitle: string;
    heroSubtitle: string;
    sampleSetlists: {
      title: string;
      description: string;
      blackTheme: string;
      whiteTheme: string;
      blackThemeAlt: string;
      whiteThemeAlt: string;
      footer: string;
    };
    dashboard: {
      title: string;
      loading: string;
      empty: {
        title: string;
        description: string;
        createButton: string;
      };
      public: string;
      private: string;
      white: string;
      black: string;
      songsCount: string;
      edit: string;
      delete: {
        title: string;
        itemType: string;
        button: string;
      };
      actions: {
        view: string;
        edit: string;
        delete: string;
        duplicate: string;
      };
    };
    authActions: {
      loginButton: string;
      registerButton: string;
      welcomeUser: string;
      continueManaging: string;
    };
  };
  profile: {
    title: string;
    description: string;
  };
  guide: {
    title: string;
    description: string;
    subtitle: string;
    aboutSection: {
      title: string;
      description1: string;
      description2: string;
      description3: string;
      alertInfo: string;
    };
    featureComparison: {
      title: string;
      features: string;
      unregisteredUser: string;
      registeredUser: string;
      publicSetlistView: string;
      imageDownload: string;
      setlistShare: string;
      setlistManagement: string;
      songDatabase: string;
      publicitySettings: string;
      duplicateFunction: string;
      personalDashboard: string;
      profileManagement: string;
    };
    accountBenefits: {
      title: string;
      description: string;
      signUpNow: string;
      signUpDescription: string;
      setlistCreation: {
        title: string;
        description: string;
      };
      songManagement: {
        title: string;
        description: string;
      };
      privateFeatures: {
        title: string;
        description: string;
      };
    };
    authentication: {
      title: string;
      emailAuth: {
        title: string;
        step1: string;
        step2: string;
        step3: string;
        note: string;
      };
      emailVerification: {
        title: string;
        description: string;
        step1: string;
        step2: string;
        step3: string;
        step4: string;
      };
      passwordReset: {
        title: string;
        description: string;
        step1: string;
        step2: string;
        step3: string;
        step4: string;
        note: string;
      };
      emailChange: {
        title: string;
        step1: string;
        step2: string;
        step3: string;
        note: string;
      };
    };
    publicUsage: {
      title: string;
      description: string;
      step1: {
        title: string;
        description: string;
      };
      step2: {
        title: string;
        description: string;
      };
      step3: {
        title: string;
        description: string;
      };
      step4: {
        title: string;
        description: string;
      };
      viewPublicSetlists: string;
      downloadImages: string;
      shareUrls: string;
    };
    pageDetails: {
      title: string;
      homePage: {
        title: string;
        unregisteredDescription: string;
        registeredDescription: string;
        feature1: string;
        feature2: string;
        feature3: string;
      };
      setlistDetail: {
        title: string;
        description: string;
        feature1: string;
        feature2: string;
        feature3: string;
        feature4: string;
        feature5: string;
        feature6: string;
      };
      songManagement: {
        title: string;
        description: string;
        feature1: string;
        feature2: string;
        feature3: string;
        feature4: string;
      };
      setlistCreation: {
        title: string;
        description: string;
        feature1: string;
        feature2: string;
        feature3: string;
        feature4: string;
        feature5: string;
        feature6: string;
        feature7: string;
      };
      profile: {
        title: string;
        description: string;
        feature1: string;
        feature2: string;
        feature3: string;
        feature4: string;
        feature5: string;
        feature6: string;
      };
    };
  };
  privacy: {
    title: string;
  };
  terms: {
    title: string;
  };
}
