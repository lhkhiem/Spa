'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEInstance } from 'tinymce';
import MediaPicker from './MediaPicker';

export interface TinyMCEEditorProps {
  value?: string;
  onChange?: (data: string) => void;
  placeholder?: string;
  id?: string;
}

const TINYMCE_API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY?.trim();
const LOCAL_TINYMCE_SCRIPT = '/tinymce/tinymce.min.js';
const TINYMCE_SCRIPT_SRC =
  process.env.NEXT_PUBLIC_TINYMCE_SCRIPT_SRC?.trim() ||
  (TINYMCE_API_KEY ? `https://cdn.tiny.cloud/1/${TINYMCE_API_KEY}/tinymce/7/tinymce.min.js` : LOCAL_TINYMCE_SCRIPT);

const WORD_LIKE_MENUBAR = 'file edit view insert format tools table help';

const WORD_LIKE_PLUGINS = [
  'advlist',
  'anchor',
  'autolink',
  'autosave',
  'charmap',
  'code',
  'codesample',
  'directionality',
  'emoticons',
  'fullscreen',
  'help',
  'image',
  'importcss',
  'insertdatetime',
  'link',
  'lists',
  'media',
  'nonbreaking',
  'pagebreak',
  'preview',
  'quickbars',
  'save',
  'searchreplace',
  'table',
  'visualblocks',
  'visualchars',
  'wordcount',
];

const WORD_LIKE_TOOLBAR = [
  'undo redo | save preview fullscreen | code | visualblocks',
  'blocks formatselect | bold italic underline strikethrough | forecolor backcolor | superscript subscript  | removeformat',
  'alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist',
  'link image media customMediaLibrary | table tabledelete | blockquote | hr pagebreak insertdatetime',
  'charmap emoticons | searchreplace | ltr rtl',
].join('\n');

export default function TinyMCEEditor({
  value = '',
  onChange,
  placeholder = 'Start writing your post content here...',
  id,
}: TinyMCEEditorProps) {
  const editorRef = useRef<TinyMCEInstance | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const editorIdRef = useRef(id || `tinymce-editor-${Math.random().toString(36).substring(2, 9)}`);
  const editorId = editorIdRef.current;

  const handleEditorChange = useCallback(
    (next: string) => {
      onChange?.(next);
    },
    [onChange],
  );

  const handleInsertFromMediaLibrary = useCallback(
    (imageUrl: string) => {
      if (editorRef.current) {
        editorRef.current.insertContent(
          `<figure class="image"><img src="${imageUrl}" alt="" /></figure>`,
        );
      }
      setMediaPickerOpen(false);
    },
    [],
  );

  useEffect(() => {
    // Delay initialization slightly to avoid conflicts with multiple editors
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (editorRef.current) {
        editorRef.current.remove();
        editorRef.current = null;
      }
    };
  }, []);

  if (!isReady) {
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
    <>
      <div 
        id={editorId} 
        style={{ 
          width: '100%', 
          minWidth: 0,
          overflow: 'visible',
          position: 'relative'
        }} 
      />
      <style jsx global>{`
        #${editorId} .tox-tinymce {
          width: 100% !important;
          min-width: 0 !important;
          overflow: visible !important;
        }
        #${editorId} .tox-editor-header {
          width: 100% !important;
          min-width: 0 !important;
          overflow-x: auto !important;
          overflow-y: visible !important;
        }
        #${editorId} .tox-toolbar {
          width: 100% !important;
          min-width: 0 !important;
          flex-wrap: wrap !important;
        }
      `}</style>
      <Editor
        id={editorId}
        key={editorId}
        apiKey={TINYMCE_API_KEY || undefined}
        tinymceScriptSrc={TINYMCE_SCRIPT_SRC}
        onInit={(_, editor) => {
          editorRef.current = editor;
          console.log(`[TinyMCE] Editor initialized: ${editorId}`, editor);
          // Force toolbar to render and fix width
          setTimeout(() => {
            if (editor && editor.ui) {
              const container = document.getElementById(editorId);
              if (container) {
                const editorElement = container.querySelector('.tox-tinymce') as HTMLElement;
                if (editorElement) {
                  editorElement.style.width = '100%';
                  editorElement.style.minWidth = '0';
                  editorElement.style.overflow = 'visible';
                }
                const toolbar = container.querySelector('.tox-toolbar') as HTMLElement;
                if (toolbar) {
                  toolbar.style.width = '100%';
                  toolbar.style.minWidth = '0';
                  toolbar.style.flexWrap = 'wrap';
                }
              }
            }
          }, 300);
        }}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          selector: `#${editorId}`,
          target: document.getElementById(editorId) || undefined,
          placeholder,
          height: 600,
          license_key: 'gpl',
          menubar: WORD_LIKE_MENUBAR,
          toolbar: WORD_LIKE_TOOLBAR,
          plugins: WORD_LIKE_PLUGINS,
          toolbar_mode: 'wrap',
          toolbar_sticky: false,
          toolbar_sticky_offset: 0,
          autosave_interval: '30s',
          autosave_restore_when_empty: true,
          autosave_ask_before_unload: true,
          branding: false,
          browser_spellcheck: true,
          promotion: false,
          contextmenu: 'undo redo | copy paste | link image table',
          content_style: `
            body {
              font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
              font-size: 16px;
              line-height: 1.7;
              color: #0f172a;
            }
            h1, h2, h3, h4, h5, h6 {
              font-weight: 700;
              margin-top: 1.5em;
              margin-bottom: 0.75em;
            }
            figure.image {
              display: inline-block;
              margin: 1.5em auto;
              text-align: center;
            }
            figure.image img {
              border-radius: 0.5rem;
              max-width: 100%;
              height: auto;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            table td, table th {
              border: 1px solid #cbd5f5;
              padding: 8px;
            }
            blockquote {
              border-left: 4px solid #1d4ed8;
              padding-left: 1rem;
              margin-left: 0;
              color: #475569;
              font-style: italic;
            }
            code {
              background: #f1f5f9;
              padding: 0.2rem 0.4rem;
              border-radius: 0.25rem;
              font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
              font-size: 0.9em;
            }
            pre code {
              display: block;
              padding: 1rem;
              overflow-x: auto;
            }
          `,
          font_family_formats:
            'Inter=Inter,sans-serif;Arial=arial,helvetica,sans-serif;Georgia=georgia,palatino;Times New Roman=times new roman,times;Courier New=courier new,courier;Roboto=Roboto,sans-serif;Lora=Lora,serif;Open Sans=Open Sans,sans-serif;Montserrat=Montserrat,sans-serif',
          font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 48pt',
          line_height_formats: '1 1.2 1.4 1.5 1.7 2',
          block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre',
          image_advtab: true,
          image_caption: true,
          image_title: true,
          convert_urls: false,
          quickbars_insert_toolbar: false,
          quickbars_selection_toolbar: false,
          save_enablewhendirty: true,
          save_onsavecallback: () => {
            if (editorRef.current) {
              onChange?.(editorRef.current.getContent());
            }
          },
          setup: (editor) => {
            editor.ui.registry.addButton('customMediaLibrary', {
              icon: 'gallery',
              tooltip: 'Insert from Media Library',
              onAction: () => {
                editorRef.current = editor;
                setMediaPickerOpen(true);
              },
            });
          },
        }}
      />

      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleInsertFromMediaLibrary}
        modalOnly
      />
    </>
  );
}


