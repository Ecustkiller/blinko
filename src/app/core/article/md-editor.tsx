'use client'
import { MdEditor as MdEditorRT } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import useArticleStore from '@/stores/article';

export function MdEditor() {
  const { currentArticle, setCurrentArticle } = useArticleStore()

  return <MdEditorRT className='flex-1 !h-screen !border-none' noImgZoomIn value={currentArticle} onChange={setCurrentArticle} />;
}