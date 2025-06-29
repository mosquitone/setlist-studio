import { gql } from '@apollo/client';

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
`;

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
`;

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
`;

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
`;

export const DELETE_SONG = gql`
  mutation DeleteSong($id: ID!) {
    deleteSong(id: $id)
  }
`;

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
`;

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
`;