export interface Song {
  id: string
  title: string
  artist: string
  duration: number | null
  key: string | null
  tempo: number | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface SetlistItem {
  id: string
  title: string
  note: string | null
  order: number
}

export interface Setlist {
  id: string
  title: string
  bandName: string | null
  eventName: string | null
  eventDate: string | null
  openTime: string | null
  startTime: string | null
  theme: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
  items: SetlistItem[]
}

export interface User {
  id: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface AuthPayload {
  token: string
  user: User
}

export interface GetSetlistsResponse {
  setlists: Setlist[]
}

export interface GetSongsResponse {
  songs: Song[]
}

export interface GetSetlistResponse {
  setlist: Setlist
}
