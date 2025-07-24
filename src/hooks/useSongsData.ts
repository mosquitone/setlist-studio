import { useQuery } from '@apollo/client';

import { GET_SONGS } from '@/lib/server/graphql/apollo-operations';
import { GetSongsResponse } from '@/types/graphql';

/**
 * 楽曲データの取得・管理を行うカスタムフック
 *
 * このフックは楽曲一覧の取得、ローディング状態の管理、エラーハンドリングを担当します。
 * GraphQLクエリを使用してサーバーから楽曲データを取得します。
 *
 * @returns {Object} フックの戻り値
 * @returns {Song[]} returns.songs - 楽曲データの配列
 * @returns {boolean} returns.loading - データ取得中のローディング状態
 * @returns {any} returns.error - エラーオブジェクト（エラーが発生した場合）
 * @returns {Function} returns.refetch - 楽曲データを再取得するための関数
 *
 * @example
 * ```tsx
 * const { songs, loading, error, refetch } = useSongsData();
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     {songs.map(song => (
 *       <div key={song.id}>{song.title}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useSongsData() {
  const { data, loading, error, refetch } = useQuery<GetSongsResponse>(GET_SONGS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    songs: data?.songs || [],
    loading,
    error,
    refetch,
  };
}
