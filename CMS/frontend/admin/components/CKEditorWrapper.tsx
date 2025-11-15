'use client';

import React, { useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import MediaPicker from './MediaPicker';

export interface CKEditorWrapperProps {
  value?: string; // HTML content
  onChange?: (data: string) => void;
  placeholder?: string;
}

export default function CKEditorWrapper({ value = '', onChange, placeholder = 'Start writing your post...' }: CKEditorWrapperProps) {
  const editorRef = useRef<any>(null);
  const editorInstanceRef = useRef<any>(null);
  const [editorLoaded, setEditorLoaded] = React.useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const isUpdatingRef = useRef(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
  }, []);

  // Sync editor content when value changes externally
  useEffect(() => {
    let isMounted = true;
    
    if (editorInstanceRef.current && !isUpdatingRef.current && isMounted) {
      try {
        const currentData = editorInstanceRef.current.getData();
        if (currentData !== value) {
          editorInstanceRef.current.setData(value || '');
        }
      } catch (error) {
        // Editor may have been destroyed
        console.warn('CKEditor: Error syncing content:', error);
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [value]);

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      if (editorInstanceRef.current) {
        try {
          // Mark as updating to prevent any sync operations
          isUpdatingRef.current = true;
          
          // Destroy editor instance to prevent memory leaks and DOM errors
          const editor = editorInstanceRef.current;
          if (editor && typeof editor.destroy === 'function') {
            try {
              // Check if editor is still valid before destroying
              if (editor.state && editor.model) {
                editor.destroy().catch((err: any) => {
                  // Silently ignore destroy errors - editor may already be destroyed
                  console.warn('CKEditor: Error during destroy:', err);
                });
              }
            } catch (destroyError) {
              // Silently ignore - editor may already be destroyed or DOM is gone
              console.warn('CKEditor: Error during destroy (may be already destroyed):', destroyError);
            }
          }
          
          // Clear reference
          editorInstanceRef.current = null;
        } catch (error) {
          // Silently ignore cleanup errors
          console.warn('CKEditor: Error during cleanup:', error);
        }
      }
    };
  }, []);

  const handleInsertImage = (imageUrl: string) => {
    if (editorInstanceRef.current) {
      const editor = editorInstanceRef.current;
      const viewFragment = editor.data.processor.toView(
        `<figure class="image"><img src="${imageUrl}" alt="Uploaded image"></figure>`
      );
      const modelFragment = editor.data.toModel(viewFragment);
      editor.model.insertContent(modelFragment);
    }
  };

  if (!editorLoaded) {
    return (
      <div className="w-full min-h-[300px] rounded-lg border border-input bg-background p-4 flex items-center justify-center text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="ckeditor-wrapper relative">
      {/* Custom Media Library Button - Positioned inside toolbar */}
      <button
        type="button"
        onClick={() => setIsMediaPickerOpen(true)}
        className="media-library-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm hover:bg-accent transition-colors text-xs font-medium border border-border bg-background"
        title="Insert from Media Library"
      >
        <ImageIcon className="h-3.5 w-3.5" />
        <span>Media Library</span>
      </button>

      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: 'GPL', // For open-source projects
          placeholder: placeholder,
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              '|',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'blockQuote',
              'insertTable',
              'codeBlock',
              '|',
              'undo',
              'redo'
            ]
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
            ]
          },
          image: {
            toolbar: [
              'imageTextAlternative',
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side'
            ]
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
          },
          link: {
            decorators: {
              openInNewTab: {
                mode: 'manual',
                label: 'Open in a new tab',
                attributes: {
                  target: '_blank',
                  rel: 'noopener noreferrer'
                }
              }
            }
          }
        }}
        onReady={(editor: any) => {
          try {
            editorInstanceRef.current = editor;
            console.log('CKEditor ready with initial data:', editor.getData());
          } catch (error) {
            console.warn('CKEditor: Error in onReady:', error);
          }
        }}
        onChange={(event: any, editor: any) => {
          try {
            if (!editorInstanceRef.current) return; // Editor may have been destroyed
            
            isUpdatingRef.current = true;
            const data = editor.getData();
            onChange?.(data);
            setTimeout(() => {
              isUpdatingRef.current = false;
            }, 100);
          } catch (error) {
            console.warn('CKEditor: Error in onChange:', error);
            isUpdatingRef.current = false;
          }
        }}
      />

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleInsertImage}
      />
      <style jsx global>{`
        /* Position Media Library button inside toolbar */
        .ckeditor-wrapper {
          position: relative;
        }

        .ckeditor-wrapper .media-library-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          z-index: 10;
          background-color: hsl(var(--background));
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .ckeditor-wrapper .media-library-btn:hover {
          background-color: hsl(var(--accent));
        }

        .ckeditor-wrapper .ck-editor__editable {
          min-height: 300px;
          max-height: 600px;
          overflow-y: auto;
        }

        .ckeditor-wrapper .ck.ck-editor {
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border));
        }

        .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
        }

        .ckeditor-wrapper .ck.ck-toolbar {
          background-color: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-bottom: none;
          padding: 0.5rem;
        }

        .ckeditor-wrapper .ck.ck-toolbar .ck-toolbar__items {
          gap: 0.25rem;
        }

        .ckeditor-wrapper .ck.ck-button:not(.ck-disabled):hover {
          background-color: hsl(var(--accent));
        }

        .ckeditor-wrapper .ck.ck-button.ck-on {
          background-color: hsl(var(--primary) / 0.1);
          color: hsl(var(--primary));
        }

        .ckeditor-wrapper .ck-content h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }

        .ckeditor-wrapper .ck-content h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }

        .ckeditor-wrapper .ck-content h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }

        .ckeditor-wrapper .ck-content h4 {
          font-size: 1em;
          font-weight: bold;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
        }

        .ckeditor-wrapper .ck-content p {
          margin: 1em 0;
        }

        .ckeditor-wrapper .ck-content ul,
        .ckeditor-wrapper .ck-content ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        .ckeditor-wrapper .ck-content li {
          margin: 0.5em 0;
        }

        .ckeditor-wrapper .ck-content a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }

        .ckeditor-wrapper .ck-content blockquote {
          border-left: 4px solid hsl(var(--border));
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }

        .ckeditor-wrapper .ck-content code {
          background-color: hsl(var(--muted));
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }

        .ckeditor-wrapper .ck-content pre {
          background-color: hsl(var(--muted));
          padding: 1em;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1em 0;
        }

        .ckeditor-wrapper .ck-content pre code {
          background-color: transparent;
          padding: 0;
        }

        .ckeditor-wrapper .ck-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }

        .ckeditor-wrapper .ck-content table td,
        .ckeditor-wrapper .ck-content table th {
          border: 1px solid hsl(var(--border));
          padding: 0.5em;
        }

        .ckeditor-wrapper .ck-content table th {
          background-color: hsl(var(--muted));
          font-weight: bold;
        }

        .ckeditor-wrapper .ck-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1em 0;
        }
      `}</style>
    </div>
  );
}

