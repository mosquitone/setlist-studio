/**
 * Setlist-related messages for i18n system
 * セットリスト関連メッセージの多言語化
 */

export interface SetlistMessages {
  // セットリスト詳細ページ
  detail: {
    successMessage: string;
    actions: {
      download: string;
      share: string;
      duplicate: string;
      makePublic: string;
      makePrivate: string;
    };
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
  form: {
    titles: {
      create: string;
      duplicate: string;
      fromSongs: string;
    };
    fields: {
      title: string;
      titlePlaceholder: string;
      titleHelperText: string;
      artistName: string;
      artistNameRequired: string;
      artistNameHelperText: string;
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
      dragSongLabel: string;
      deleteSongLabel: string;
      dragSongKeyboardLabel: string;
    };
    buttons: {
      create: string;
      cancel: string;
      createSuccess: string;
    };
    validation: {
      titleMaxLength: string;
      titleInvalidChars: string;
      artistNameRequired: string;
      artistNameMaxLength: string;
      artistNameInvalidChars: string;
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
}

// 日本語版
export const setlistsJa: SetlistMessages = {
  detail: {
    successMessage: 'セットリストが正常に生成されました！',
    actions: {
      download: 'ダウンロード',
      share: '共有',
      duplicate: '複製',
      makePublic: '公開にする',
      makePrivate: '非公開にする',
    },
    deleteDialog: {
      title: 'セットリストを削除',
      message: '?',
      warning: 'この操作は取り消せません。',
      cancel: 'キャンセル',
      delete: '削除',
      deleting: '削除中...',
    },
  },
  form: {
    titles: {
      create: '新しいセットリストを作成',
      duplicate: 'セットリストを複製',
      fromSongs: '選択した楽曲からセットリストを作成',
    },
    fields: {
      title: 'セットリスト名',
      titlePlaceholder: '任意',
      titleHelperText: '空欄の場合、自動的に番号が付けられます',
      artistName: 'アーティスト名',
      artistNameRequired: '必須',
      artistNameHelperText: '楽曲管理に登録したアーティスト名から選択可能',
      eventName: 'イベント名',
      eventDate: 'イベント日',
      openTime: '開場時間',
      startTime: '開始時間',
      theme: 'テーマ',
    },
    songsList: {
      title: '楽曲リスト',
      maxSongsWarning: '最大20曲まで追加できます。',
      songTitle: '楽曲タイトル',
      songNote: 'メモ',
      addSong: '楽曲を追加',
      dragSongLabel: '楽曲 {number} をドラッグして移動',
      deleteSongLabel: '楽曲 {number} を削除',
      dragSongKeyboardLabel: '楽曲 {number} をドラッグして移動。Ctrl+矢印キーでキーボード操作可能',
    },
    buttons: {
      create: 'セットリストを作成',
      cancel: 'キャンセル',
      createSuccess: 'セットリストが正常に作成されました！',
    },
    validation: {
      titleMaxLength: 'セットリスト名は100文字以内で入力してください',
      titleInvalidChars: 'セットリスト名に無効な文字が含まれています',
      artistNameRequired: 'アーティスト名は必須です',
      artistNameMaxLength: 'アーティスト名は100文字以内で入力してください',
      artistNameInvalidChars: 'アーティスト名に無効な文字が含まれています',
      eventNameMaxLength: 'イベント名は200文字以内で入力してください',
      eventNameInvalidChars: 'イベント名に無効な文字が含まれています',
      songTitleRequired: '楽曲タイトルは必須です',
      songTitleMaxLength: '楽曲タイトルは200文字以内で入力してください',
      songTitleInvalidChars: '楽曲タイトルに無効な文字が含まれています',
      songNoteMaxLength: 'メモは500文字以内で入力してください',
      songNoteInvalidChars: 'メモに無効な文字が含まれています',
      minSongsRequired: '最低1曲は必要です',
      maxSongsExceeded: '最大20曲まで許可されています',
    },
    copy: 'コピー',
  },
};

// 英語版
export const setlistsEn: SetlistMessages = {
  detail: {
    successMessage: 'Setlist generated successfully!',
    actions: {
      download: 'Download',
      share: 'Share',
      duplicate: 'Duplicate',
      makePublic: 'Make Public',
      makePrivate: 'Make Private',
    },
    deleteDialog: {
      title: 'Delete Setlist',
      message: '?',
      warning: 'This action cannot be undone.',
      cancel: 'Cancel',
      delete: 'Delete',
      deleting: 'Deleting...',
    },
  },
  form: {
    titles: {
      create: 'Create New Setlist',
      duplicate: 'Duplicate Setlist',
      fromSongs: 'Create Setlist from Selected Songs',
    },
    fields: {
      title: 'Setlist Name',
      titlePlaceholder: 'Optional',
      titleHelperText: 'If left blank, will be automatically numbered',
      artistName: 'Artist Name',
      artistNameRequired: 'Required',
      artistNameHelperText: 'Choose from artist names registered in song management',
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
      dragSongLabel: 'Drag song {number} to move',
      deleteSongLabel: 'Delete song {number}',
      dragSongKeyboardLabel:
        'Drag song {number} to move. Use Ctrl+arrow keys for keyboard navigation',
    },
    buttons: {
      create: 'Create Setlist',
      cancel: 'Cancel',
      createSuccess: 'Setlist created successfully!',
    },
    validation: {
      titleMaxLength: 'Setlist name must be 100 characters or less',
      titleInvalidChars: 'Setlist name contains invalid characters',
      artistNameRequired: 'Artist name is required',
      artistNameMaxLength: 'Artist name must be 100 characters or less',
      artistNameInvalidChars: 'Artist name contains invalid characters',
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
};
