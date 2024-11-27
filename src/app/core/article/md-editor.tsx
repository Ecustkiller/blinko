'use client'
import React, { useState } from 'react';
import { MdEditor as MdEditorRT } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export function MdEditor() {
  const [text, setText] = useState('# MD Editor');
  return <MdEditorRT className='flex-1 !h-screen !border-none' noImgZoomIn value={text} onChange={setText} />;
}