import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SONGS, DELETE_SONG, UPDATE_SONG } from '@/lib/server/graphql/apollo-operations';
import { Song, GetSongsResponse } from '@/types/graphql';
import { useRouter } from 'next/navigation';

export function useSongs() {
  const router = useRouter();
  const { data, loading, error } = useQuery<GetSongsResponse>(GET_SONGS, {
    fetchPolicy: 'network-only',
  });

  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  const [updateSong, { loading: updateLoading }] = useMutation(UPDATE_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
  });

  const [deleteSong, { loading: deleteLoading }] = useMutation(DELETE_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
    onCompleted: () => {
      setIsDeleteDialogOpen(false);
      setSongToDelete(null);
    },
  });

  useEffect(() => {
    if (data?.songs) {
      setSongs(data.songs);
    }
  }, [data]);

  const handleEditSong = (song: Song) => {
    setSelectedSong(song);
    setIsEditDialogOpen(true);
  };

  const handleSaveSong = async (songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedSong) return;

    try {
      await updateSong({
        variables: {
          id: selectedSong.id,
          input: songData,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteClick = (song: Song) => {
    setSongToDelete(song);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (songToDelete) {
      try {
        await deleteSong({ variables: { id: songToDelete.id } });
      } catch (error) {
        console.error('Failed to delete song:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSongToDelete(null);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedSong(null);
  };

  const handleToggleSelection = (songId: string) => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId],
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedSongs(selected ? songs.map((song) => song.id) : []);
  };

  const handleCreateSetlist = () => {
    const selectedSongTitles: Array<{ title: string; note: string }> = songs
      .filter((song) => selectedSongs.includes(song.id))
      .map((song) => ({ title: song.title, note: song.notes || '' }));

    const queryParams = new URLSearchParams();
    queryParams.set('selectedSongs', JSON.stringify(selectedSongTitles));

    router.push(`/setlists/new?${queryParams.toString()}`);
  };

  return {
    songs,
    loading,
    error,
    selectedSong,
    isEditDialogOpen,
    songToDelete,
    isDeleteDialogOpen,
    deleteLoading,
    updateLoading,
    selectedSongs,
    handleEditSong,
    handleSaveSong,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    closeEditDialog,
    handleToggleSelection,
    handleSelectAll,
    handleCreateSetlist,
  };
}
