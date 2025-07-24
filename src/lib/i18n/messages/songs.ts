/**
 * Song management messages for i18n system
 * 楽曲管理メッセージの多言語化
 */

export interface SongMessages {
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
    success: string;
    validation: {
      titleRequired: string;
      artistRequired: string;
      tempoInvalid: string;
      notesMaxLength: string;
    };
  };
}

// 日本語版
export const songsJa: SongMessages = {
  title: '楽曲管理',
  description:
    '楽曲を管理・編集します。チェックボックスで楽曲を選択してセットリストを作成できます。',
  empty: {
    title: '楽曲がありません',
    description: '新しい楽曲を追加してください',
  },
  table: {
    title: 'タイトル',
    artist: 'アーティスト',
    key: 'キー',
    tempo: 'テンポ',
    notes: 'メモ',
    actions: 'アクション',
    selectAll: '全選択/全解除',
    selectSong: ' 楽曲',
    editSong: ' 楽曲',
    deleteSong: ' 楽曲',
  },
  actions: {
    addNew: '新しい楽曲を追加',
    createSetlist: 'セットリスト作成',
    deleteSelected: '選択楽曲を削除',
    songsCount: ' 曲',
  },
  form: {
    editTitle: '楽曲を編集',
    titleLabel: 'タイトル',
    artistLabel: 'アーティスト',
    keyLabel: 'キー',
    tempoLabel: 'テンポ',
    notesLabel: 'メモ',
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
    success: '楽曲を作成しました',
    validation: {
      titleRequired: '楽曲タイトルは必須です',
      artistRequired: 'アーティスト名は必須です',
      tempoInvalid: '有効な数値を入力してください',
      notesMaxLength: 'メモは20文字以内で入力してください',
    },
  },
};

// 英語版
export const songsEn: SongMessages = {
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
    createSetlist: 'Create Setlist',
    deleteSelected: 'Delete Selected',
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
    success: 'Song created successfully',
    validation: {
      titleRequired: 'Song title is required',
      artistRequired: 'Artist name is required',
      tempoInvalid: 'Please enter a valid number',
      notesMaxLength: 'Note must be 20 characters or less',
    },
  },
};
