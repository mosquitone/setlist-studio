import { gql } from '@apollo/client'

export const GET_SONGS = gql`
  query GetSongs {
    songs {
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
  }
`

export const GET_SONG = gql`
  query GetSong($id: ID!) {
    song(id: $id) {
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
  }
`

export const CREATE_SONG = gql`
  mutation CreateSong($input: CreateSongInput!) {
    createSong(input: $input) {
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
  }
`

export const UPDATE_SONG = gql`
  mutation UpdateSong($id: ID!, $input: UpdateSongInput!) {
    updateSong(id: $id, input: $input) {
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
  }
`

export const DELETE_SONG = gql`
  mutation DeleteSong($id: ID!) {
    deleteSong(id: $id)
  }
`

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        username
        createdAt
        updatedAt
      }
    }
  }
`

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        username
        createdAt
        updatedAt
      }
    }
  }
`

export const GET_SETLISTS = gql`
  query GetSetlists {
    setlists {
      id
      title
      bandName
      eventName
      eventDate
      openTime
      startTime
      theme
      createdAt
      updatedAt
      items {
        id
        title
        note
        order
      }
    }
  }
`

export const GET_SETLIST = gql`
  query GetSetlist($id: ID!) {
    setlist(id: $id) {
      id
      title
      bandName
      eventName
      eventDate
      openTime
      startTime
      theme
      createdAt
      updatedAt
      items {
        id
        title
        note
        order
      }
    }
  }
`

export const CREATE_SETLIST = gql`
  mutation CreateSetlist($input: CreateSetlistInput!) {
    createSetlist(input: $input) {
      id
      title
      bandName
      eventName
      eventDate
      openTime
      startTime
      theme
      createdAt
      updatedAt
      items {
        id
        title
        note
        order
      }
    }
  }
`

export const UPDATE_SETLIST = gql`
  mutation UpdateSetlist($id: ID!, $input: UpdateSetlistInput!) {
    updateSetlist(id: $id, input: $input) {
      id
      title
      bandName
      eventName
      eventDate
      openTime
      startTime
      theme
      createdAt
      updatedAt
      items {
        id
        title
        note
        order
      }
    }
  }
`

export const DELETE_SETLIST = gql`
  mutation DeleteSetlist($id: ID!) {
    deleteSetlist(id: $id)
  }
`

export const CREATE_SETLIST_ITEM = gql`
  mutation CreateSetlistItem($input: CreateSetlistItemInput!) {
    createSetlistItem(input: $input) {
      id
      title
      note
      order
      setlistId
    }
  }
`

export const UPDATE_SETLIST_ITEM = gql`
  mutation UpdateSetlistItem($id: ID!, $input: UpdateSetlistItemInput!) {
    updateSetlistItem(id: $id, input: $input) {
      id
      title
      note
      order
      setlistId
    }
  }
`

export const DELETE_SETLIST_ITEM = gql`
  mutation DeleteSetlistItem($id: ID!) {
    deleteSetlistItem(id: $id)
  }
`

export const REORDER_SETLIST_ITEMS = gql`
  mutation ReorderSetlistItems($setlistId: ID!, $itemIds: [ID!]!) {
    reorderSetlistItems(setlistId: $setlistId, itemIds: $itemIds) {
      id
      title
      note
      order
      setlistId
    }
  }
`
