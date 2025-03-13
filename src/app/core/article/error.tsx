'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('文章组件错误:', error);
  }, [error]);

  return (
    <div className="p-4 border rounded bg-muted/20">
      <h3 className="text-sm font-medium mb-2">文章加载错误</h3>
      <p className="text-xs text-muted-foreground mb-2">
        文章组件出现了问题，但您仍可使用应用程序的其他部分。
      </p>
      <p className="text-xs bg-muted p-2 rounded mb-2 overflow-auto max-h-[80px]">
        {error.message || '未知错误'}
      </p>
      <Button onClick={reset} variant="outline" size="sm">
        重试
      </Button>
    </div>
  );
}
