'use client'

import { useRouter } from 'next/navigation'
import { useMutation } from '@apollo/client'
import { DELETE_SETLIST } from '@/lib/graphql/apollo-operations'

interface UseSetlistActionsProps {
  setlistId: string
  setlist?: {
    id: string
    title: string
    bandName: string
  }
}

export function useSetlistActions({ setlistId, setlist }: UseSetlistActionsProps) {
  const router = useRouter()
  const [deleteSetlist, { loading: deleteLoading }] = useMutation(DELETE_SETLIST, {
    onCompleted: () => {
      router.push('/')
    },
  })

  const handleEdit = () => {
    router.push(`/setlists/${setlistId}/edit`)
  }

  const handleDelete = async () => {
    try {
      await deleteSetlist({ variables: { id: setlistId } })
    } catch {
      // Handle error silently or show user notification
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/setlists/${setlistId}`
    try {
      await navigator.share({
        title: `${setlist?.bandName || ''} - ${setlist?.title || ''}`,
        text: `セットリスト: ${setlist?.title || ''}`,
        url: url,
      })
    } catch {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert('URLをクリップボードにコピーしました')
      } catch {
        // Handle clipboard/sharing error silently
      }
    }
  }

  const handleDuplicate = () => {
    router.push(`/setlists/new?duplicate=${setlistId}`)
  }

  return {
    handleEdit,
    handleDelete,
    handleShare,
    handleDuplicate,
    deleteLoading,
  }
}
