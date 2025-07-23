// ページ関連のメッセージ定義
export const pagesMessages = {
  // 日本語
  ja: {
    pages: {
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
          },
        },
      },
      login: {
        title: 'ログイン',
        description: 'アカウントにログイン',
      },
      register: {
        title: '新規登録',
        description: '新しいアカウントを作成',
      },
      setlists: {
        title: 'セットリスト一覧',
        description: 'あなたのセットリストを管理',
        empty: 'まだセットリストがありません',
        createFirst: '最初のセットリストを作成しましょう',
      },
      songs: {
        title: '楽曲一覧',
        description: 'あなたの楽曲ライブラリー',
        empty: 'まだ楽曲がありません',
        createFirst: '最初の楽曲を追加しましょう',
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
          signUpNow: '今すぐ始める：',
          signUpDescription:
            '右上の「新規登録」ボタンからアカウントを作成できます。メールアドレスとパスワードを入力し、送信される確認メールでアカウントを有効化するとすぐに全機能をご利用いただけます。',
        },
        authentication: {
          title: '認証・パスワード関連',
          emailVerification: {
            title: 'メール認証',
            description: 'アカウント登録後、メールアドレスの確認が必要です',
            step1: '新規登録フォームに入力',
            step2: '確認メールを受信',
            step3: 'メール内のリンクをクリック',
            step4: 'アカウント有効化完了',
          },
          passwordReset: {
            title: 'パスワードリセット',
            description: 'パスワードを忘れた場合の復旧手順です',
            step1: 'ログイン画面で「パスワードを忘れた」をクリック',
            step2: '登録済みメールアドレスを入力',
            step3: 'パスワードリセットメールを受信',
            step4: 'メール内のリンクから新しいパスワードを設定',
          },
        },
        publicUsage: {
          title: '公開セットリストの使い方',
          step1: {
            title: '共有URLにアクセス',
            description: '公開セットリストの共有URLをクリックまたは入力してアクセスします',
          },
          step2: {
            title: 'セットリストを確認',
            description: '楽曲リスト、バンド情報、イベント詳細などを確認できます',
          },
          step3: {
            title: 'テーマ選択',
            description: 'ブラックまたはホワイトテーマから選択できます',
          },
          step4: {
            title: '画像ダウンロード',
            description: '「ダウンロード」ボタンをクリックして高品質画像をダウンロードします',
          },
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
            feature3: 'パスワード変更機能',
            feature4: 'アカウント作成日時・ID表示',
          },
        },
      },
      privacy: {
        title: 'プライバシーポリシー',
      },
      terms: {
        title: '利用規約',
      },
    },
  },

  // 英語
  en: {
    pages: {
      home: {
        title: 'Home',
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
            title: 'No setlists yet',
            description: 'Create your first setlist to manage your performance lists',
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
          },
        },
      },
      login: {
        title: 'Login',
        description: 'Login to your account',
      },
      register: {
        title: 'Register',
        description: 'Create a new account',
      },
      setlists: {
        title: 'Setlists',
        description: 'Manage your setlists',
        empty: 'No setlists yet',
        createFirst: 'Create your first setlist',
      },
      songs: {
        title: 'Songs',
        description: 'Manage your songs',
        empty: 'No songs yet',
        createFirst: 'Add your first song',
      },
      profile: {
        title: 'Profile',
        description: 'Profile settings',
      },
      guide: {
        title: 'Guide',
        description: 'How to use guide',
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
            'Creating a free account gives you access to the following features in addition to public features:',
          setlistCreation: {
            title: 'Setlist Creation',
            description: 'Create and edit unlimited original setlists',
          },
          songManagement: {
            title: 'Song Management',
            description: 'Efficiently manage song information with your personal song database',
          },
          privateFeatures: {
            title: 'Private Features',
            description: 'Management features such as private setlists and personal settings',
          },
          signUpNow: 'Get Started Now:',
          signUpDescription:
            'You can create an account using the "Register" button in the top right. Enter your email address and password, then activate your account via the confirmation email sent to you to immediately use all features.',
        },
        authentication: {
          title: 'Authentication & Password',
          emailVerification: {
            title: 'Email Verification',
            description: 'Email address confirmation is required after account registration',
            step1: 'Fill out the registration form',
            step2: 'Receive confirmation email',
            step3: 'Click the link in the email',
            step4: 'Account activation completed',
          },
          passwordReset: {
            title: 'Password Reset',
            description: 'Recovery procedure when you forget your password',
            step1: 'Click "Forgot Password" on the login screen',
            step2: 'Enter your registered email address',
            step3: 'Receive password reset email',
            step4: 'Set a new password via the link in the email',
          },
        },
        publicUsage: {
          title: 'How to Use Public Setlists',
          step1: {
            title: 'Access Sharing URL',
            description: 'Click or enter the sharing URL of the public setlist to access it',
          },
          step2: {
            title: 'Check Setlist',
            description: 'Review song list, band information, event details, etc.',
          },
          step3: {
            title: 'Select Theme',
            description: 'Choose from Black or White theme',
          },
          step4: {
            title: 'Download Image',
            description: 'Click the "Download" button to download high-quality images',
          },
        },
        pageDetails: {
          title: 'Detailed Page Features',
          homePage: {
            title: 'Home Page',
            unregisteredDescription:
              'Introduction to the application and guide to account creation',
            registeredDescription:
              'Personal dashboard displaying your setlist overview. Each setlist is displayed in card format and can be directly viewed and edited.',
            feature1: 'Quick access to setlist creation',
            feature2: 'Responsive grid layout',
            feature3: 'Theme-based card design',
          },
          setlistDetail: {
            title: 'Setlist Detail Page',
            description: 'Detailed display of setlists and various operations are possible.',
            feature1: 'Song list and event information display',
            feature2: 'Theme change (Black/White)',
            feature3: 'High-quality image download',
            feature4: 'URL sharing function',
            feature5: 'Edit function (owner only)',
            feature6: 'Duplicate function (logged-in users)',
          },
          songManagement: {
            title: 'Song Management Page',
            description: 'You can manage your personal song database.',
            feature1: 'Add, edit, and delete songs',
            feature2: 'Title, artist, key, tempo management',
            feature3: 'Play time and memo function',
            feature4: 'Song selection when creating setlists',
          },
          setlistCreation: {
            title: 'Setlist Creation Page',
            description: 'You can create new setlists.',
            feature1: 'Basic information setting (title, artist name)',
            feature2: 'Event information (venue, date, show time)',
            feature3: 'Song addition and drag & drop reordering',
            feature4: 'Up to 20 songs can be added',
            feature5: 'Theme selection (Black/White)',
            feature6: 'Private/Public settings',
            feature7: 'Auto-fill when there is a duplicate source',
          },
          profile: {
            title: 'Profile Page',
            description: 'You can check and manage your account information.',
            feature1: 'Username editing and email address display',
            feature2: 'Email address change (with confirmation email)',
            feature3: 'Password change function',
            feature4: 'Account creation date and ID display',
          },
        },
      },
      privacy: {
        title: 'Privacy Policy',
      },
      terms: {
        title: 'Terms of Service',
      },
    },
  },
} as const;
