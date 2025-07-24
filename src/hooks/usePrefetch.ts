import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

import { GET_SETLISTS, GET_SONGS } from '@/lib/server/graphql/apollo-operations';

export const usePrefetch = () => {
  const client = useApolloClient();

  const prefetchSetlists = useCallback(() => {
    client
      .query({
        query: GET_SETLISTS,
        fetchPolicy: 'cache-only',
      })
      .catch(() => {
        // キャッシュにない場合はネットワークから取得
        client.query({
          query: GET_SETLISTS,
          fetchPolicy: 'network-only',
        });
      });
  }, [client]);

  const prefetchSongs = useCallback(() => {
    client
      .query({
        query: GET_SONGS,
        fetchPolicy: 'cache-only',
      })
      .catch(() => {
        // キャッシュにない場合はネットワークから取得
        client.query({
          query: GET_SONGS,
          fetchPolicy: 'network-only',
        });
      });
  }, [client]);

  return {
    prefetchSetlists,
    prefetchSongs,
  };
};
