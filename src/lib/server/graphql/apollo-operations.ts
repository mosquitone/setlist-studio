import { gql } from '@apollo/client';

// GraphQL Fragments - フィールド重複解消のための共通定義
// エクスポートして他のファイルからも再利用可能にする

export const SONG_FIELDS = gql`
  fragment SongFields on Song {
    id
    title
    artist
    duration
    key
    tempo
    notes
    createdAt
    updatedAt
  }
`;

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    email
    username
    createdAt
    updatedAt
  }
`;

export const SETLIST_ITEM_FIELDS = gql`
  fragment SetlistItemFields on SetlistItem {
    id
    title
    note
    order
  }
`;

export const SETLIST_ITEM_FIELDS_WITH_SETLIST_ID = gql`
  fragment SetlistItemFieldsWithSetlistId on SetlistItem {
    id
    title
    note
    order
    setlistId
  }
`;

// 条件付きフラグメント生成関数 - より柔軟な再利用を可能にする
export const createSetlistFields = (includeUserId: boolean = false) => gql`
  fragment SetlistFields${includeUserId ? 'WithUserId' : ''} on Setlist {
    id
    title
    artistName
    eventName
    eventDate
    openTime
    startTime
    theme
    isPublic
    ${includeUserId ? 'userId' : ''}
    createdAt
    updatedAt
    items {
      ...SetlistItemFields
    }
  }
  ${SETLIST_ITEM_FIELDS}
`;

// 後方互換性のための定数
export const SETLIST_FIELDS = createSetlistFields(false);
export const SETLIST_FIELDS_WITH_USER_ID = createSetlistFields(true);

// Song operations
export const GET_SONGS = gql`
  query GetSongs {
    songs {
      ...SongFields
    }
  }
  ${SONG_FIELDS}
`;

export const GET_SONG = gql`
  query GetSong($id: ID!) {
    song(id: $id) {
      ...SongFields
    }
  }
  ${SONG_FIELDS}
`;

export const CREATE_SONG = gql`
  mutation CreateSong($input: CreateSongInput!) {
    createSong(input: $input) {
      ...SongFields
    }
  }
  ${SONG_FIELDS}
`;

export const UPDATE_SONG = gql`
  mutation UpdateSong($id: ID!, $input: UpdateSongInput!) {
    updateSong(id: $id, input: $input) {
      ...SongFields
    }
  }
  ${SONG_FIELDS}
`;

export const DELETE_SONG = gql`
  mutation DeleteSong($id: ID!) {
    deleteSong(id: $id)
  }
`;

export const DELETE_MULTIPLE_SONGS = gql`
  mutation DeleteMultipleSongs($ids: [ID!]!) {
    deleteMultipleSongs(ids: $ids)
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FIELDS}
`;

export const GET_SETLISTS = gql`
  query GetSetlists {
    setlists {
      ...SetlistFields
    }
  }
  ${SETLIST_FIELDS}
`;

export const GET_ARTIST_NAMES = gql`
  query GetArtistNames {
    artistNames
  }
`;

export const GET_SETLIST = gql`
  query GetSetlist($id: ID!) {
    setlist(id: $id) {
      ...SetlistFieldsWithUserId
    }
  }
  ${SETLIST_FIELDS_WITH_USER_ID}
`;

export const CREATE_SETLIST = gql`
  mutation CreateSetlist($input: CreateSetlistInput!) {
    createSetlist(input: $input) {
      ...SetlistFields
    }
  }
  ${SETLIST_FIELDS}
`;

export const UPDATE_SETLIST = gql`
  mutation UpdateSetlist($id: ID!, $input: UpdateSetlistInput!) {
    updateSetlist(id: $id, input: $input) {
      ...SetlistFields
    }
  }
  ${SETLIST_FIELDS}
`;

export const DELETE_SETLIST = gql`
  mutation DeleteSetlist($id: ID!) {
    deleteSetlist(id: $id)
  }
`;

export const TOGGLE_SETLIST_VISIBILITY = gql`
  mutation ToggleSetlistVisibility($id: ID!) {
    toggleSetlistVisibility(id: $id)
  }
`;

export const CREATE_SETLIST_ITEM = gql`
  mutation CreateSetlistItem($input: CreateSetlistItemInput!) {
    createSetlistItem(input: $input) {
      ...SetlistItemFieldsWithSetlistId
    }
  }
  ${SETLIST_ITEM_FIELDS_WITH_SETLIST_ID}
`;

export const UPDATE_SETLIST_ITEM = gql`
  mutation UpdateSetlistItem($id: ID!, $input: UpdateSetlistItemInput!) {
    updateSetlistItem(id: $id, input: $input) {
      ...SetlistItemFieldsWithSetlistId
    }
  }
  ${SETLIST_ITEM_FIELDS_WITH_SETLIST_ID}
`;

export const DELETE_SETLIST_ITEM = gql`
  mutation DeleteSetlistItem($id: ID!) {
    deleteSetlistItem(id: $id)
  }
`;

export const REORDER_SETLIST_ITEMS = gql`
  mutation ReorderSetlistItems($setlistId: ID!, $itemIds: [ID!]!) {
    reorderSetlistItems(setlistId: $setlistId, itemIds: $itemIds) {
      ...SetlistItemFieldsWithSetlistId
    }
  }
  ${SETLIST_ITEM_FIELDS_WITH_SETLIST_ID}
`;

export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      email
      username
      createdAt
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($username: String!) {
    updateUser(username: $username) {
      id
      email
      username
    }
  }
`;
