/**
 * i18n Message Management System
 * メッセージの多言語管理
 */

export type Language = 'ja' | 'en';

export interface Messages {
  // 認証関連
  auth: {
    loginRequired: string;
    authenticationExpired: string;
    serverError: string;
    userAlreadyExists: string;
    invalidCredentials: string;
    emailSent: string;
    passwordResetRequested: string;
    passwordResetSuccess: string;
    invalidResetToken: string;
    emailVerified: string;
    invalidVerificationToken: string;
    emailChangedSuccess: string;
    invalidChangeToken: string;
    passwordChangeSuccess: string;
    currentPasswordIncorrect: string;
    emailAlreadyVerified: string;
    authRequired: string;
    userNotFound: string;
    rateLimitExceeded: string;
    checkingLoginStatus: string;
    redirectingToLogin: string;
  };

  // エラーメッセージ
  errors: {
    serverError: string;
    validationError: string;
    networkError: string;
    unknownError: string;
    setlistNotFound: string;
    songNotFound: string;
    unauthorized: string;
    forbidden: string;
    somethingWentWrong: string;
  };

  // UI関連
  ui: {
    // 認証
    login: string;
    register: string;
    logout: string;
    email: string;
    username: string;
    password: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    changePassword: string;
    resetPassword: string;
    forgotPassword: string;
    sendResetEmail: string;
    verifyEmail: string;
    resendVerification: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    loginToManageSetlists: string;
    createAccountToStart: string;

    // ナビゲーション
    home: string;
    setlists: string;
    songs: string;
    profile: string;
    guide: string;
    privacy: string;
    terms: string;

    // 共通アクション
    back: string;
    submit: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    create: string;
    update: string;
    confirm: string;
    loading: string;
    success: string;
    error: string;
    yes: string;
    no: string;
    close: string;

    // セットリスト関連
    setlist: string;
    newSetlist: string;
    editSetlist: string;
    deleteSetlist: string;
    duplicateSetlist: string;
    setlistTitle: string;
    setlistName: string;
    bandName: string;
    eventName: string;
    eventDate: string;
    venue: string;
    openTime: string;
    startTime: string;
    theme: string;
    isPublic: string;
    makePublic: string;
    makePrivate: string;
    shareSetlist: string;
    downloadImage: string;
    previewImage: string;
    generateImage: string;

    // 楽曲関連
    song: string;
    newSong: string;
    editSong: string;
    deleteSong: string;
    songTitle: string;
    artist: string;
    key: string;
    tempo: string;
    duration: string;
    notes: string;
    addSong: string;
    removeSong: string;

    // フォーム関連
    required: string;
    optional: string;
    pleaseEnter: string;
    pleaseSelect: string;
    invalid: string;
    tooShort: string;
    tooLong: string;

    // 状態
    draft: string;
    published: string;
    private: string;
    public: string;
    empty: string;
    noData: string;
    noResults: string;

    // 時間
    minutes: string;
    hours: string;
    days: string;
    weeks: string;
    months: string;
    years: string;
    ago: string;

    // その他
    search: string;
    filter: string;
    sort: string;
    language: string;
    settings: string;
    help: string;
    about: string;
    contact: string;
    support: string;
    version: string;
    copyright: string;
    createdAt: string;
    accountId: string;
    and: string;
    agree: string;
    effectiveDate: string;
  };

  // ページタイトル・説明
  pages: {
    home: {
      title: string;
      description: string;
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
        };
      };
    };
    login: {
      title: string;
      description: string;
    };
    register: {
      title: string;
      description: string;
    };
    setlists: {
      title: string;
      description: string;
      empty: string;
    };
    songs: {
      title: string;
      description: string;
      empty: string;
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
        signUpNow: string;
        signUpDescription: string;
      };
      publicUsage: {
        title: string;
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
          feature5: string;
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
        };
      };
    };
    privacy: {
      title: string;
    };
    terms: {
      title: string;
    };
  };

  // 機能説明
  features: {
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
  };

  // 通知・メッセージ
  notifications: {
    setlistCreated: string;
    setlistUpdated: string;
    setlistDeleted: string;
    songAdded: string;
    songUpdated: string;
    songDeleted: string;
    imageGenerated: string;
    copied: string;
    saved: string;
    profileUpdated: string;
    passwordChanged: string;
    emailSent: string;
    linkCopied: string;
    accountCreated: string;
  };

  // 確認メッセージ
  confirmations: {
    deleteSetlist: string;
    deleteSong: string;
    logout: string;
    unsavedChanges: string;
    makePublic: string;
    makePrivate: string;
  };

  // プレースホルダー
  placeholders: {
    setlistTitle: string;
    bandName: string;
    eventName: string;
    venue: string;
    songTitle: string;
    artist: string;
    notes: string;
    search: string;
    email: string;
    username: string;
    password: string;
  };

  // バリデーション
  validation: {
    required: string;
    emailInvalid: string;
    passwordTooShort: string;
    passwordsDoNotMatch: string;
    usernameTooShort: string;
    titleTooShort: string;
    titleTooLong: string;
    agreeToTerms: string;
  };

  footer: {
    contact: string;
  };

  // 共通のUI要素
  common: {
    loading: string;
    cancel: string;
    delete: string;
    deleteConfirmation: string;
    deleteWarning: string;
    logoOfficialSite: string;
    logoOfficialSiteTap: string;
  };

  // セットリスト詳細ページ
  setlistDetail: {
    successMessage: string;
    deleteDialog: {
      title: string;
      message: string;
      warning: string;
      cancel: string;
      delete: string;
      deleting: string;
    };
  };

  // セットリストフォーム
  setlistForm: {
    titles: {
      create: string;
      duplicate: string;
      fromSongs: string;
    };
    fields: {
      title: string;
      titlePlaceholder: string;
      titleHelperText: string;
      bandName: string;
      bandNameRequired: string;
      eventName: string;
      eventDate: string;
      openTime: string;
      startTime: string;
      theme: string;
    };
    songsList: {
      title: string;
      maxSongsWarning: string;
      songTitle: string;
      songNote: string;
      addSong: string;
    };
    buttons: {
      create: string;
      cancel: string;
    };
    validation: {
      titleMaxLength: string;
      titleInvalidChars: string;
      bandNameRequired: string;
      bandNameMaxLength: string;
      bandNameInvalidChars: string;
      eventNameMaxLength: string;
      eventNameInvalidChars: string;
      songTitleRequired: string;
      songTitleMaxLength: string;
      songTitleInvalidChars: string;
      songNoteMaxLength: string;
      songNoteInvalidChars: string;
      minSongsRequired: string;
      maxSongsExceeded: string;
    };
    copy: string;
  };

  // ナビゲーションメニュー
  navigation: {
    profile: string;
    logout: string;
    loading: string;
  };

  // 楽曲管理画面
  songs: {
    title: string;
    description: string;
    empty: {
      title: string;
      description: string;
    };
    table: {
      title: string;
      artist: string;
      key: string;
      tempo: string;
      notes: string;
      actions: string;
      selectAll: string;
      selectSong: string;
      editSong: string;
      deleteSong: string;
    };
    actions: {
      addNew: string;
      createSetlist: string;
      deleteSelected: string;
      songsCount: string;
    };
    form: {
      editTitle: string;
      titleLabel: string;
      artistLabel: string;
      keyLabel: string;
      tempoLabel: string;
      notesLabel: string;
      save: string;
      cancel: string;
    };
    chips: {
      keyPrefix: string;
      tempoPrefix: string;
    };
    newSong: {
      title: string;
      create: string;
      cancel: string;
      createError: string;
      validation: {
        titleRequired: string;
        artistRequired: string;
        tempoInvalid: string;
      };
    };
  };

  // メールテンプレート
  email: {
    verificationSubject: string;
    verificationBody: (username: string, link: string) => string;
    passwordResetSubject: string;
    passwordResetBody: (username: string, link: string) => string;
    passwordResetSuccessSubject: string;
    passwordResetSuccessBody: (username: string) => string;
    emailChangeSubject: string;
    emailChangeBody: (username: string, link: string) => string;
  };
}

// メッセージ取得関数
export function getMessages(lang: Language): Messages {
  switch (lang) {
    case 'ja':
      return jaMessages;
    case 'en':
      return enMessages;
    default:
      return jaMessages; // デフォルトは日本語
  }
}

// 言語検出関数
export function detectLanguage(acceptLanguage?: string): Language {
  if (!acceptLanguage) return 'ja';

  const lowerCase = acceptLanguage.toLowerCase();
  if (lowerCase.includes('en')) return 'en';
  return 'ja'; // デフォルトは日本語
}

// 日本語メッセージ
const jaMessages: Messages = {
  auth: {
    loginRequired: 'ログインが必要です',
    authenticationExpired: '認証の有効期限が切れています。再度ログインしてください',
    serverError: 'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    userAlreadyExists: '登録に失敗しました。入力内容を確認してください',
    invalidCredentials: 'メールアドレスまたはパスワードが正しくありません',
    emailSent: 'メールを送信しました',
    passwordResetRequested: 'パスワードリセットの手順をメールで送信しました。',
    passwordResetSuccess: 'パスワードが正常にリセットされました。',
    invalidResetToken: 'リセットトークンが無効または期限切れです。',
    emailVerified: 'メールアドレスが正常に認証されました。',
    invalidVerificationToken: '認証トークンが無効または期限切れです。',
    emailChangedSuccess: 'メールアドレスが正常に変更されました。',
    invalidChangeToken: '変更トークンが無効または期限切れです。',
    passwordChangeSuccess: 'パスワードが正常に変更されました。',
    currentPasswordIncorrect: '現在のパスワードが正しくありません',
    emailAlreadyVerified: 'メールアドレスは既に認証済みです。',
    authRequired: '認証ユーザーのみ利用できます。',
    userNotFound: 'ユーザーが見つかりません',
    rateLimitExceeded: 'リクエスト回数が上限に達しました。',
    checkingLoginStatus: 'ログイン状態を確認中...',
    redirectingToLogin: 'ログイン画面に移動中...',
  },
  errors: {
    serverError: 'サーバーエラーが発生しました',
    validationError: '入力内容に誤りがあります',
    networkError: 'ネットワークエラーが発生しました',
    unknownError: '予期せぬエラーが発生しました',
    setlistNotFound: 'セットリストが見つかりません',
    songNotFound: '楽曲が見つかりません',
    unauthorized: '認証が必要です',
    forbidden: 'アクセス権限がありません',
    somethingWentWrong: '何らかのエラーが発生しました',
  },
  ui: {
    // 認証
    login: 'ログイン',
    register: '新規登録',
    logout: 'ログアウト',
    email: 'メールアドレス',
    username: 'ユーザー名',
    password: 'パスワード',
    currentPassword: '現在のパスワード',
    newPassword: '新しいパスワード',
    confirmPassword: 'パスワード（確認）',
    changePassword: 'パスワードを変更',
    resetPassword: 'パスワードをリセット',
    forgotPassword: 'パスワードを忘れた方',
    sendResetEmail: 'リセットメールを送信',
    verifyEmail: 'メールアドレスを確認',
    resendVerification: '確認メールを再送信',
    alreadyHaveAccount: 'アカウントをお持ちの方',
    dontHaveAccount: 'アカウントをお持ちでないですか？',
    loginToManageSetlists: 'アカウントにログインしてセットリストを管理',
    createAccountToStart: 'アカウントを作成してセットリスト作成を開始',

    // ナビゲーション
    home: 'ホーム',
    setlists: 'セットリスト',
    songs: '楽曲',
    profile: 'プロフィール',
    guide: 'ガイド',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',

    // 共通アクション
    back: '戻る',
    submit: '送信',
    cancel: 'キャンセル',
    save: '保存',
    edit: '編集',
    delete: '削除',
    create: '作成',
    update: '更新',
    confirm: '確認',
    loading: '読み込み中...',
    success: '成功',
    error: 'エラー',
    yes: 'はい',
    no: 'いいえ',
    close: '閉じる',

    // セットリスト関連
    setlist: 'セットリスト',
    newSetlist: '新しいセットリスト',
    editSetlist: 'セットリストを編集',
    deleteSetlist: 'セットリストを削除',
    duplicateSetlist: 'セットリストを複製',
    setlistTitle: 'セットリストタイトル',
    setlistName: 'セットリスト名',
    bandName: 'バンド名',
    eventName: 'イベント名',
    eventDate: '開催日',
    venue: '会場',
    openTime: '開場時間',
    startTime: '開始時間',
    theme: 'テーマ',
    isPublic: '公開設定',
    makePublic: '公開する',
    makePrivate: '非公開にする',
    shareSetlist: 'セットリストを共有',
    downloadImage: '画像をダウンロード',
    previewImage: '画像をプレビュー',
    generateImage: '画像を生成',

    // 楽曲関連
    song: '楽曲',
    newSong: '新しい楽曲',
    editSong: '楽曲を編集',
    deleteSong: '楽曲を削除',
    songTitle: '楽曲タイトル',
    artist: 'アーティスト',
    key: 'キー',
    tempo: 'テンポ',
    duration: '演奏時間',
    notes: 'メモ',
    addSong: '楽曲を追加',
    removeSong: '楽曲を削除',

    // フォーム関連
    required: '必須',
    optional: '任意',
    pleaseEnter: '入力してください',
    pleaseSelect: '選択してください',
    invalid: '無効',
    tooShort: '短すぎます',
    tooLong: '長すぎます',

    // 状態
    draft: '下書き',
    published: '公開済み',
    private: '非公開',
    public: '公開',
    empty: '空',
    noData: 'データなし',
    noResults: '結果なし',

    // 時間
    minutes: '分',
    hours: '時間',
    days: '日',
    weeks: '週',
    months: 'ヶ月',
    years: '年',
    ago: '前',

    // その他
    search: '検索',
    filter: 'フィルター',
    sort: 'ソート',
    language: '言語',
    settings: '設定',
    help: 'ヘルプ',
    about: 'このサイトについて',
    contact: 'お問い合わせ',
    support: 'サポート',
    version: 'バージョン',
    copyright: '著作権',
    createdAt: '作成日',
    accountId: 'アカウントID',
    and: 'および',
    agree: 'に同意します',
    effectiveDate: '制定日',
  },
  pages: {
    home: {
      title: 'ホーム',
      description: 'セットリスト管理アプリ',
      heroTitle: 'ステージで利用できるアーティスト向けのセットリスト作成アプリです。',
      heroSubtitle: 'エクセルや手書きの時代はもう終わりです。',
      sampleSetlists: {
        title: 'セットリストサンプル',
        description: 'Setlist Studioで作成できるセットリストの例をご覧ください',
        blackTheme: 'ブラックテーマ',
        whiteTheme: 'ホワイトテーマ',
        blackThemeAlt: 'セットリストサンプル - ブラックテーマ',
        whiteThemeAlt: 'セットリストサンプル - ホワイトテーマ',
        footer: 'このようなセットリストを簡単に作成・ダウンロードできます',
      },
      dashboard: {
        title: 'あなたのセットリスト',
        loading: 'セットリストを読み込み中...',
        empty: {
          title: 'まだセットリストがありません',
          description: '最初のセットリストを作成して、素敵な演奏リストを管理しましょう',
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
      description: 'アカウントを作成',
    },
    setlists: {
      title: 'セットリスト',
      description: 'セットリストを管理',
      empty: 'セットリストがありません',
    },
    songs: {
      title: '楽曲',
      description: '楽曲を管理',
      empty: '楽曲がありません',
    },
    profile: {
      title: 'プロフィール',
      description: 'プロフィール設定',
    },
    guide: {
      title: 'ガイド',
      description: '使い方ガイド',
      subtitle: '機能一覧と利用方法の完全ガイド',
      aboutSection: {
        title: 'Setlist Studio とは',
        description1:
          'Setlist Studioは、バンドや音楽グループのためのセットリスト生成・管理ツールです。楽曲情報を管理し、高品質なセットリスト画像を簡単に作成できます。',
        description2:
          'セットリストは「パブリック（公開）」と「プライベート（非公開）」で管理でき、パブリックセットリストはアカウント登録なしでも閲覧・ダウンロードが可能です。',
        alertInfo:
          'パブリックセットリストは、共有URLを知っている誰でもアクセス可能です。プライベートセットリストは所有者のみが閲覧できます。',
      },
      featureComparison: {
        title: '利用可能機能一覧',
        features: '機能',
        unregisteredUser: '未登録ユーザー',
        registeredUser: '登録ユーザー',
        publicSetlistView: 'パブリックセットリスト閲覧',
        imageDownload: '画像ダウンロード（Black/White テーマ）',
        setlistShare: 'セットリスト共有（URL コピー）',
        setlistManagement: 'セットリスト作成・編集・削除',
        songDatabase: '楽曲データベース管理',
        publicitySettings: 'セットリストの公開設定変更',
        duplicateFunction: '自分のセットリスト複製機能',
        personalDashboard: '個人ダッシュボード',
        profileManagement: 'プロフィール管理',
      },
      accountBenefits: {
        title: 'アカウント作成でさらに便利に',
        description:
          '無料のアカウントを作成すると、パブリック機能に加えて以下の機能が利用できます：',
        setlistCreation: {
          title: 'セットリスト作成',
          description: '独自のセットリストを無制限に作成・編集できます',
        },
        songManagement: {
          title: '楽曲管理',
          description: '個人の楽曲データベースで曲情報を効率的に管理',
        },
        privateFeatures: {
          title: 'プライベート機能',
          description: '非公開セットリストや個人設定などの管理機能',
        },
        signUpNow: '今すぐ始める:',
        signUpDescription:
          '右上の「登録」ボタンからアカウントを作成できます。メールアドレスとパスワードのみで、すぐに全機能をご利用いただけます。',
      },
      publicUsage: {
        title: 'パブリックセットリストの使用方法',
        step1: {
          title: '共有URLにアクセス',
          description: 'パブリックセットリストの共有URLをクリックまたは入力してアクセスします',
        },
        step2: {
          title: 'セットリストを確認',
          description: '楽曲リスト、バンド情報、イベント詳細などを確認します',
        },
        step3: {
          title: 'テーマを選択',
          description: 'Black（黒）またはWhite（白）テーマから選択できます',
        },
        step4: {
          title: '画像をダウンロード',
          description: '「Download」ボタンをクリックして高品質な画像をダウンロードします',
        },
      },
      pageDetails: {
        title: '各ページの機能詳細',
        homePage: {
          title: 'ホームページ',
          unregisteredDescription: 'アプリケーションの紹介とアカウント作成への案内',
          registeredDescription:
            '個人ダッシュボードで自分のセットリスト一覧を表示。各セットリストはカード形式で表示され、直接表示・編集が可能。',
          feature1: 'セットリスト作成へのクイックアクセス',
          feature2: 'レスポンシブなグリッドレイアウト',
          feature3: 'テーマ別カードデザイン',
        },
        setlistDetail: {
          title: 'セットリスト詳細ページ',
          description: 'セットリストの詳細表示と各種操作が可能です。',
          feature1: '楽曲リスト・イベント情報表示',
          feature2: 'テーマ変更（Black/White）',
          feature3: '高品質画像ダウンロード',
          feature4: 'URL共有機能',
          feature5: '編集機能（所有者のみ）',
          feature6: '複製機能（ログインユーザー）',
        },
        songManagement: {
          title: '楽曲管理ページ',
          description: '個人の楽曲データベースを管理できます。',
          feature1: '楽曲の追加・編集・削除',
          feature2: 'タイトル・アーティスト・キー・テンポ管理',
          feature3: '演奏時間とメモ機能',
          feature4: '検索・フィルタリング機能',
          feature5: 'セットリスト作成時の楽曲選択',
        },
        setlistCreation: {
          title: 'セットリスト作成ページ',
          description: '新しいセットリストを作成できます。',
          feature1: '基本情報設定（タイトル・バンド名）',
          feature2: 'イベント情報（会場・日時・開演時間）',
          feature3: '楽曲追加とドラッグ&ドロップ並び替え',
          feature4: '楽曲追加は最大20曲まで',
          feature5: 'テーマ選択（Black/White）',
          feature6: 'プライベート／パブリック設定',
          feature7: '複製元がある場合の自動入力',
        },
        profile: {
          title: 'プロフィールページ',
          description: 'アカウント情報の確認と管理ができます。',
          feature1: 'ユーザー名・メールアドレス表示',
          feature2: 'アカウント作成日時',
          feature3: '統計情報（作成セットリスト数など）',
          feature4: 'アカウント設定',
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
  features: {
    title: '主な機能',
    setlistManagement: {
      title: 'セットリスト管理',
      description: '登録済みの楽曲からセットリストを作成できます。',
    },
    songLibrary: {
      title: '楽曲管理',
      description: '楽曲の詳細情報（タイトル、アーティスト、キー、テンポ）を登録・管理できます。',
    },
    imageGeneration: {
      title: '画像生成',
      description: '美しいセットリスト画像を生成',
    },
    sharing: {
      title: '共有機能',
      description: 'セットリストを簡単に共有',
    },
    themes: {
      title: 'テーマ',
      description: '複数のテーマから選択',
    },
    qrCode: {
      title: 'QRコード',
      description: 'QRコードでアクセス',
    },
  },
  notifications: {
    setlistCreated: 'セットリストを作成しました',
    setlistUpdated: 'セットリストを更新しました',
    setlistDeleted: 'セットリストを削除しました',
    songAdded: '楽曲を追加しました',
    songUpdated: '楽曲を更新しました',
    songDeleted: '楽曲を削除しました',
    imageGenerated: '画像を生成しました',
    copied: 'コピーしました',
    saved: '保存しました',
    profileUpdated: 'プロフィールを更新しました',
    passwordChanged: 'パスワードを変更しました',
    emailSent: 'メールを送信しました',
    linkCopied: 'リンクをコピーしました',
    accountCreated: 'アカウントが作成されました',
  },
  confirmations: {
    deleteSetlist: 'このセットリストを削除しますか？',
    deleteSong: 'この楽曲を削除しますか？',
    logout: 'ログアウトしますか？',
    unsavedChanges: '未保存の変更があります。破棄しますか？',
    makePublic: 'このセットリストを公開しますか？',
    makePrivate: 'このセットリストを非公開にしますか？',
  },
  placeholders: {
    setlistTitle: 'セットリストのタイトルを入力',
    bandName: 'バンド名を入力',
    eventName: 'イベント名を入力',
    venue: '会場名を入力',
    songTitle: '楽曲タイトルを入力',
    artist: 'アーティスト名を入力',
    notes: 'メモを入力',
    search: '検索...',
    email: 'メールアドレスを入力',
    username: 'ユーザー名を入力',
    password: 'パスワードを入力',
  },
  validation: {
    required: 'この項目は必須です',
    emailInvalid: 'メールアドレスが無効です',
    passwordTooShort: 'パスワードが短すぎます',
    passwordsDoNotMatch: 'パスワードが一致しません',
    usernameTooShort: 'ユーザー名が短すぎます',
    titleTooShort: 'タイトルが短すぎます',
    titleTooLong: 'タイトルが長すぎます',
    agreeToTerms: '利用規約およびプライバシーポリシーに同意してください',
  },
  footer: {
    contact: 'お問い合わせはこちらまで',
  },
  common: {
    loading: '読み込み中...',
    cancel: 'キャンセル',
    delete: '削除',
    deleteConfirmation: 'を削除しますか？',
    deleteWarning: 'この操作は取り消せません。',
    logoOfficialSite: '公式サイトへ',
    logoOfficialSiteTap: 'タップして公式サイトへ',
  },
  setlistDetail: {
    successMessage: 'セットリストが生成されました！',
    deleteDialog: {
      title: 'セットリストを削除',
      message: 'を削除してもよろしいですか？',
      warning: 'この操作は取り消せません。',
      cancel: 'キャンセル',
      delete: '削除',
      deleting: '削除中...',
    },
  },
  setlistForm: {
    titles: {
      create: '新しいセットリストを作成',
      duplicate: 'セットリストを複製',
      fromSongs: '選択した楽曲でセットリストを作成',
    },
    fields: {
      title: 'セットリスト名',
      titlePlaceholder: '任意',
      titleHelperText: '空欄の場合は自動でナンバリングされます',
      bandName: 'バンド名',
      bandNameRequired: '必須',
      eventName: 'イベント名',
      eventDate: '開催日',
      openTime: '開場時間',
      startTime: '開演時間',
      theme: 'テーマ',
    },
    songsList: {
      title: '楽曲リスト',
      maxSongsWarning: '楽曲の追加は最大20曲までです。',
      songTitle: '楽曲名',
      songNote: 'メモ',
      addSong: '楽曲を追加',
    },
    buttons: {
      create: 'セットリストを作成',
      cancel: 'キャンセル',
    },
    validation: {
      titleMaxLength: 'セットリスト名は100文字以下にしてください',
      titleInvalidChars: 'セットリスト名に無効な文字が含まれています',
      bandNameRequired: 'バンド名は必須です',
      bandNameMaxLength: 'バンド名は100文字以下にしてください',
      bandNameInvalidChars: 'バンド名に無効な文字が含まれています',
      eventNameMaxLength: 'イベント名は200文字以下にしてください',
      eventNameInvalidChars: 'イベント名に無効な文字が含まれています',
      songTitleRequired: '楽曲名は必須です',
      songTitleMaxLength: '楽曲名は200文字以下にしてください',
      songTitleInvalidChars: '楽曲名に無効な文字が含まれています',
      songNoteMaxLength: 'メモは500文字以下にしてください',
      songNoteInvalidChars: 'メモに無効な文字が含まれています',
      minSongsRequired: '少なくとも1曲は必要です',
      maxSongsExceeded: '楽曲は20曲以下にしてください',
    },
    copy: 'コピー',
  },
  navigation: {
    profile: 'プロフィール',
    logout: 'ログアウト',
    loading: '読込中…',
  },
  songs: {
    title: '楽曲管理',
    description:
      '楽曲の管理と編集ができます。チェックボックスで楽曲を選択してセットリストを作成できます。',
    empty: {
      title: '楽曲がありません',
      description: '新しい楽曲を追加してください',
    },
    table: {
      title: 'タイトル',
      artist: 'アーティスト',
      key: 'キー',
      tempo: 'テンポ',
      notes: 'ノート',
      actions: 'アクション',
      selectAll: '全て選択/解除',
      selectSong: 'を選択',
      editSong: 'を編集',
      deleteSong: 'を削除',
    },
    actions: {
      addNew: '新しい楽曲を追加',
      createSetlist: '選択した楽曲でセットリスト作成',
      deleteSelected: '選択した楽曲を削除',
      songsCount: '曲',
    },
    form: {
      editTitle: '楽曲を編集',
      titleLabel: 'タイトル',
      artistLabel: 'アーティスト',
      keyLabel: 'キー',
      tempoLabel: 'テンポ',
      notesLabel: 'ノート',
      save: '保存',
      cancel: 'キャンセル',
    },
    chips: {
      keyPrefix: 'キー: ',
      tempoPrefix: 'テンポ: ',
    },
    newSong: {
      title: '新しい楽曲を追加',
      create: '作成',
      cancel: 'キャンセル',
      createError: '楽曲の作成に失敗しました',
      validation: {
        titleRequired: '楽曲名は必須です',
        artistRequired: 'アーティスト名は必須です',
        tempoInvalid: '数値を入力してください',
      },
    },
  },
  email: {
    verificationSubject: 'メールアドレスの確認',
    verificationBody: (username: string, link: string) => `
こんにちは ${username} さん、

Setlist Studioへのご登録ありがとうございます。
以下のリンクをクリックしてメールアドレスを確認してください：

${link}

このリンクは24時間有効です。

よろしくお願いします。
Setlist Studio チーム
`,
    passwordResetSubject: 'パスワードリセットのご案内',
    passwordResetBody: (username: string, link: string) => `
こんにちは ${username} さん、

パスワードリセットのリクエストを受け付けました。
以下のリンクをクリックして新しいパスワードを設定してください：

${link}

このリンクは1時間有効です。
このリクエストに心当たりがない場合は、このメールを無視してください。

よろしくお願いします。
Setlist Studio チーム
`,
    passwordResetSuccessSubject: 'パスワードが変更されました',
    passwordResetSuccessBody: (username: string) => `
こんにちは ${username} さん、

パスワードが正常に変更されました。
この変更に心当たりがない場合は、直ちにサポートまでご連絡ください。

よろしくお願いします。
Setlist Studio チーム
`,
    emailChangeSubject: 'メールアドレス変更の確認',
    emailChangeBody: (username: string, link: string) => `
こんにちは ${username} さん、

メールアドレス変更のリクエストを受け付けました。
以下のリンクをクリックして変更を確認してください：

${link}

このリンクは24時間有効です。
このリクエストに心当たりがない場合は、このメールを無視してください。

よろしくお願いします。
Setlist Studio チーム
`,
  },
};

// 英語メッセージ
const enMessages: Messages = {
  auth: {
    loginRequired: 'Login required',
    authenticationExpired: 'Authentication expired. Please login again',
    serverError: 'Server error occurred. Please try again later.',
    userAlreadyExists: 'Registration failed. Please check your input',
    invalidCredentials: 'Invalid email or password',
    emailSent: 'Email sent',
    passwordResetRequested: 'Password reset instructions have been sent to your email.',
    passwordResetSuccess: 'Password has been reset successfully.',
    invalidResetToken: 'Invalid or expired reset token.',
    emailVerified: 'Email address has been verified successfully.',
    invalidVerificationToken: 'Invalid or expired verification token.',
    emailChangedSuccess: 'Email address has been changed successfully.',
    invalidChangeToken: 'Invalid or expired change token.',
    passwordChangeSuccess: 'Password has been changed successfully.',
    currentPasswordIncorrect: 'Current password is incorrect',
    emailAlreadyVerified: 'Email address is already verified.',
    authRequired: 'Authentication required.',
    userNotFound: 'User not found',
    rateLimitExceeded: 'Request limit exceeded.',
    checkingLoginStatus: 'Checking login status...',
    redirectingToLogin: 'Redirecting to login...',
  },
  errors: {
    serverError: 'Server error occurred',
    validationError: 'Validation error',
    networkError: 'Network error occurred',
    unknownError: 'Unknown error occurred',
    setlistNotFound: 'Setlist not found',
    songNotFound: 'Song not found',
    unauthorized: 'Authentication required',
    forbidden: 'Access denied',
    somethingWentWrong: 'Something went wrong',
  },
  ui: {
    // 認証
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    changePassword: 'Change Password',
    resetPassword: 'Reset Password',
    forgotPassword: 'Forgot Password?',
    sendResetEmail: 'Send Reset Email',
    verifyEmail: 'Verify Email',
    resendVerification: 'Resend Verification',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    loginToManageSetlists: 'Login to manage your setlists',
    createAccountToStart: 'Create an account to start creating setlists',

    // ナビゲーション
    home: 'Home',
    setlists: 'Setlists',
    songs: 'Songs',
    profile: 'Profile',
    guide: 'Guide',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',

    // 共通アクション
    back: 'Back',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    update: 'Update',
    confirm: 'Confirm',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    yes: 'Yes',
    no: 'No',
    close: 'Close',

    // セットリスト関連
    setlist: 'Setlist',
    newSetlist: 'New Setlist',
    editSetlist: 'Edit Setlist',
    deleteSetlist: 'Delete Setlist',
    duplicateSetlist: 'Duplicate Setlist',
    setlistTitle: 'Setlist Title',
    setlistName: 'Setlist Name',
    bandName: 'Band Name',
    eventName: 'Event Name',
    eventDate: 'Event Date',
    venue: 'Venue',
    openTime: 'Open Time',
    startTime: 'Start Time',
    theme: 'Theme',
    isPublic: 'Public Setting',
    makePublic: 'Make Public',
    makePrivate: 'Make Private',
    shareSetlist: 'Share Setlist',
    downloadImage: 'Download Image',
    previewImage: 'Preview Image',
    generateImage: 'Generate Image',

    // 楽曲関連
    song: 'Song',
    newSong: 'New Song',
    editSong: 'Edit Song',
    deleteSong: 'Delete Song',
    songTitle: 'Song Title',
    artist: 'Artist',
    key: 'Key',
    tempo: 'Tempo',
    duration: 'Duration',
    notes: 'Notes',
    addSong: 'Add Song',
    removeSong: 'Remove Song',

    // フォーム関連
    required: 'Required',
    optional: 'Optional',
    pleaseEnter: 'Please enter',
    pleaseSelect: 'Please select',
    invalid: 'Invalid',
    tooShort: 'Too short',
    tooLong: 'Too long',

    // 状態
    draft: 'Draft',
    published: 'Published',
    private: 'Private',
    public: 'Public',
    empty: 'Empty',
    noData: 'No data',
    noResults: 'No results',

    // 時間
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    years: 'years',
    ago: 'ago',

    // その他
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    language: 'Language',
    settings: 'Settings',
    help: 'Help',
    about: 'About',
    contact: 'Contact',
    support: 'Support',
    version: 'Version',
    copyright: 'Copyright',
    createdAt: 'Created At',
    accountId: 'Account ID',
    and: 'and',
    agree: 'I agree to the',
    effectiveDate: 'Effective Date',
  },
  pages: {
    home: {
      title: 'Home',
      description: 'Setlist management app',
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
    },
    songs: {
      title: 'Songs',
      description: 'Manage your songs',
      empty: 'No songs yet',
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
          'You can create an account using the "Register" button in the top right. With just an email address and password, you can immediately use all features.',
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
          unregisteredDescription: 'Introduction to the application and guide to account creation',
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
          feature4: 'Search and filtering functions',
          feature5: 'Song selection when creating setlists',
        },
        setlistCreation: {
          title: 'Setlist Creation Page',
          description: 'You can create new setlists.',
          feature1: 'Basic information setting (title, band name)',
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
          feature1: 'Username and email address display',
          feature2: 'Account creation date and time',
          feature3: 'Statistics (number of setlists created, etc.)',
          feature4: 'Account settings',
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
  features: {
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
  },
  notifications: {
    setlistCreated: 'Setlist created',
    setlistUpdated: 'Setlist updated',
    setlistDeleted: 'Setlist deleted',
    songAdded: 'Song added',
    songUpdated: 'Song updated',
    songDeleted: 'Song deleted',
    imageGenerated: 'Image generated',
    copied: 'Copied',
    saved: 'Saved',
    profileUpdated: 'Profile updated',
    passwordChanged: 'Password changed',
    emailSent: 'Email sent',
    linkCopied: 'Link copied',
    accountCreated: 'Account created successfully',
  },
  confirmations: {
    deleteSetlist: 'Are you sure you want to delete this setlist?',
    deleteSong: 'Are you sure you want to delete this song?',
    logout: 'Are you sure you want to logout?',
    unsavedChanges: 'You have unsaved changes. Are you sure you want to discard them?',
    makePublic: 'Are you sure you want to make this setlist public?',
    makePrivate: 'Are you sure you want to make this setlist private?',
  },
  placeholders: {
    setlistTitle: 'Enter setlist title',
    bandName: 'Enter band name',
    eventName: 'Enter event name',
    venue: 'Enter venue name',
    songTitle: 'Enter song title',
    artist: 'Enter artist name',
    notes: 'Enter notes',
    search: 'Search...',
    email: 'Enter email address',
    username: 'Enter username',
    password: 'Enter password',
  },
  validation: {
    required: 'This field is required',
    emailInvalid: 'Invalid email address',
    passwordTooShort: 'Password is too short',
    passwordsDoNotMatch: 'Passwords do not match',
    usernameTooShort: 'Username is too short',
    titleTooShort: 'Title is too short',
    titleTooLong: 'Title is too long',
    agreeToTerms: 'Please agree to the terms and privacy policy',
  },
  footer: {
    contact: 'Contact us here',
  },
  common: {
    loading: 'Loading...',
    cancel: 'Cancel',
    delete: 'Delete',
    deleteConfirmation: '?',
    deleteWarning: 'This action cannot be undone.',
    logoOfficialSite: 'Official Site',
    logoOfficialSiteTap: 'Tap to visit official site',
  },
  setlistDetail: {
    successMessage: 'Setlist generated successfully!',
    deleteDialog: {
      title: 'Delete Setlist',
      message: '?',
      warning: 'This action cannot be undone.',
      cancel: 'Cancel',
      delete: 'Delete',
      deleting: 'Deleting...',
    },
  },
  setlistForm: {
    titles: {
      create: 'Create New Setlist',
      duplicate: 'Duplicate Setlist',
      fromSongs: 'Create Setlist from Selected Songs',
    },
    fields: {
      title: 'Setlist Name',
      titlePlaceholder: 'Optional',
      titleHelperText: 'If left blank, will be automatically numbered',
      bandName: 'Band Name',
      bandNameRequired: 'Required',
      eventName: 'Event Name',
      eventDate: 'Event Date',
      openTime: 'Open Time',
      startTime: 'Start Time',
      theme: 'Theme',
    },
    songsList: {
      title: 'Song List',
      maxSongsWarning: 'You can add up to 20 songs.',
      songTitle: 'Song Title',
      songNote: 'Note',
      addSong: 'Add Song',
    },
    buttons: {
      create: 'Create Setlist',
      cancel: 'Cancel',
    },
    validation: {
      titleMaxLength: 'Setlist name must be 100 characters or less',
      titleInvalidChars: 'Setlist name contains invalid characters',
      bandNameRequired: 'Band name is required',
      bandNameMaxLength: 'Band name must be 100 characters or less',
      bandNameInvalidChars: 'Band name contains invalid characters',
      eventNameMaxLength: 'Event name must be 200 characters or less',
      eventNameInvalidChars: 'Event name contains invalid characters',
      songTitleRequired: 'Song title is required',
      songTitleMaxLength: 'Song title must be 200 characters or less',
      songTitleInvalidChars: 'Song title contains invalid characters',
      songNoteMaxLength: 'Note must be 500 characters or less',
      songNoteInvalidChars: 'Note contains invalid characters',
      minSongsRequired: 'At least 1 song is required',
      maxSongsExceeded: 'Maximum 20 songs allowed',
    },
    copy: 'Copy',
  },
  navigation: {
    profile: 'Profile',
    logout: 'Logout',
    loading: 'Loading...',
  },
  songs: {
    title: 'Song Management',
    description: 'Manage and edit songs. Select songs with checkboxes to create setlists.',
    empty: {
      title: 'No songs available',
      description: 'Please add a new song',
    },
    table: {
      title: 'Title',
      artist: 'Artist',
      key: 'Key',
      tempo: 'Tempo',
      notes: 'Notes',
      actions: 'Actions',
      selectAll: 'Select/Deselect All',
      selectSong: ' song',
      editSong: ' song',
      deleteSong: ' song',
    },
    actions: {
      addNew: 'Add New Song',
      createSetlist: 'Create Setlist with Selected Songs',
      deleteSelected: 'Delete Selected Songs',
      songsCount: ' songs',
    },
    form: {
      editTitle: 'Edit Song',
      titleLabel: 'Title',
      artistLabel: 'Artist',
      keyLabel: 'Key',
      tempoLabel: 'Tempo',
      notesLabel: 'Notes',
      save: 'Save',
      cancel: 'Cancel',
    },
    chips: {
      keyPrefix: 'Key: ',
      tempoPrefix: 'Tempo: ',
    },
    newSong: {
      title: 'Add New Song',
      create: 'Create',
      cancel: 'Cancel',
      createError: 'Failed to create song',
      validation: {
        titleRequired: 'Song title is required',
        artistRequired: 'Artist name is required',
        tempoInvalid: 'Please enter a valid number',
      },
    },
  },
  email: {
    verificationSubject: 'Verify your email address',
    verificationBody: (username: string, link: string) => `
Hello ${username},

Thank you for registering with Setlist Studio.
Please click the link below to verify your email address:

${link}

This link will expire in 24 hours.

Best regards,
Setlist Studio Team
`,
    passwordResetSubject: 'Password Reset Request',
    passwordResetBody: (username: string, link: string) => `
Hello ${username},

We received a request to reset your password.
Please click the link below to set a new password:

${link}

This link will expire in 1 hour.
If you didn't request this, please ignore this email.

Best regards,
Setlist Studio Team
`,
    passwordResetSuccessSubject: 'Password Changed',
    passwordResetSuccessBody: (username: string) => `
Hello ${username},

Your password has been changed successfully.
If you didn't make this change, please contact support immediately.

Best regards,
Setlist Studio Team
`,
    emailChangeSubject: 'Confirm Email Change',
    emailChangeBody: (username: string, link: string) => `
Hello ${username},

We received a request to change your email address.
Please click the link below to confirm this change:

${link}

This link will expire in 24 hours.
If you didn't request this, please ignore this email.

Best regards,
Setlist Studio Team
`,
  },
};
