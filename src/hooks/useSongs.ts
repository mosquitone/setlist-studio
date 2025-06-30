import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_SONGS, DELETE_SONG, UPDATE_SONG } from '@/lib/graphql/apollo-operations'
import { Song, GetSongsResponse } from '@/types/graphql'

export function useSongs() {
  const { data, loading, error } = useQuery<GetSongsResponse>(GET_SONGS, {
    fetchPolicy: 'network-only',
  })

  const [songs, setSongs] = useState<Song[]>([])
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [updateSong] = useMutation(UPDATE_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
  })

  const [deleteSong] = useMutation(DELETE_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
  })

  useEffect(() => {
    if (data?.songs) {
      setSongs(data.songs)
    }
  }, [data])

  const handleEditSong = (song: Song) => {
    setSelectedSong(song)
    setIsEditDialogOpen(true)
  }

  const handleSaveSong = async (songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedSong) return

    try {
      await updateSong({
        variables: {
          id: selectedSong.id,
          input: songData,
        },
      })
    } catch (err) {
      console.error('Failed to update song:', err)
      throw err
    }
  }

  const handleDeleteSong = async (id: string) => {
    if (window.confirm('この楽曲を削除してもよろしいですか？')) {
      try {
        await deleteSong({ variables: { id } })
      } catch (err) {
        console.error('Failed to delete song:', err)
        throw err
      }
    }
  }

  const closeEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedSong(null)
  }

  return {
    songs,
    loading,
    error,
    selectedSong,
    isEditDialogOpen,
    handleEditSong,
    handleSaveSong,
    handleDeleteSong,
    closeEditDialog,
  }
}
