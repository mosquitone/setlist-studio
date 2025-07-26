import { useState, useEffect, useRef } from 'react';

/**
 * コンテナの幅を監視して返すカスタムフック
 * ResizeObserverを使用してリアルタイムに幅の変更を検知
 */
export const useContainerWidth = () => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // 初期値設定
    updateWidth();

    // リサイズ監視
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { containerRef, containerWidth };
};
