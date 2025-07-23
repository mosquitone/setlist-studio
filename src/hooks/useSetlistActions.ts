'use client';

import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import { DELETE_SETLIST } from '@/lib/server/graphql/apollo-operations';

interface UseSetlistActionsProps {
  setlistId: string;
  setlist?: {
    id: string;
    title: string;
    artistName: string;
  };
}

export function useSetlistActions({ setlistId, setlist }: UseSetlistActionsProps) {
  const router = useRouter();
  const { messages } = useI18n();
  const { showSuccess, showError } = useSnackbar();
  const [deleteSetlist, { loading: deleteLoading }] = useMutation(DELETE_SETLIST, {
    onCompleted: () => {
      showSuccess(
        `「${setlist?.title || 'セットリスト'}」${messages.notifications.setlistDeleted}`,
      );
      router.push('/');
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const handleEdit = () => {
    router.push(`/setlists/${setlistId}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteSetlist({ variables: { id: setlistId } });
    } catch (error) {
      // エラーは onError で処理されるため、ここでは再スローしない
      console.error('Failed to delete setlist:', error);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/setlists/${setlistId}`;
    try {
      await navigator.share({
        title: `${setlist?.artistName || ''} - ${setlist?.title || ''}`,
        text: `セットリスト: ${setlist?.title || ''}`,
        url: url,
      });
    } catch {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        showSuccess(messages.errors.urlCopiedToClipboard);
      } catch {
        // Handle clipboard/sharing error silently
      }
    }
  };

  const handleDuplicate = () => {
    router.push(`/setlists/new?duplicate=${setlistId}`);
  };

  return {
    handleEdit,
    handleDelete,
    handleShare,
    handleDuplicate,
    deleteLoading,
  };
}
