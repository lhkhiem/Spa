'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import CKEditor to avoid SSR issues
const CKEditorWrapper = dynamic(() => import('./CKEditorWrapper'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[300px] rounded-lg border border-input bg-background p-4 flex items-center justify-center text-muted-foreground">
      <div className="flex items-center gap-2">
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        Loading editor...
      </div>
    </div>
  ),
});

export interface RichTextEditorProps {
  value?: string;
  onChange?: (data: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return <CKEditorWrapper value={value} onChange={onChange} placeholder={placeholder} />;
}


