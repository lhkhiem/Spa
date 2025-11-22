'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEInstance } from 'tinymce';
import MediaPicker from './MediaPicker';

export interface TinyMCEEditorProps {
  value?: string;
  onChange?: (data: string) => void;
  placeholder?: string;
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
  'fontfamily',
  'fontsize',
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
  'print',
  'quickbars',
  'save',
  'searchreplace',
  'table',
  'template',
  'textpattern',
  'visualblocks',
  'visualchars',
  'wordcount',
];

const WORD_LIKE_TOOLBAR = [
  'undo redo | save print preview fullscreen',
  'formatselect fontselect fontsizeselect | bold italic underline strikethrough superscript subscript removeformat',
  'forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist',
  'link image media customMediaLibrary | blockquote code codesample | table tabledelete | hr pagebreak nonbreaking insertdatetime',
  'charmap emoticons | searchreplace visualblocks visualchars | ltr rtl | template',
].join('\n');

export default function TinyMCEEditor({
  value = '',
  onChange,
  placeholder = 'Start writing your post content here...',
}: TinyMCEEditorProps) {
  const editorRef = useRef<TinyMCEInstance | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

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
    return () => {
      editorRef.current = null;
    };
  }, []);

  return (
    <>
      <Editor
        apiKey={TINYMCE_API_KEY || undefined}
        tinymceScriptSrc={TINYMCE_SCRIPT_SRC}
        onInit={(_, editor) => {
          editorRef.current = editor;
        }}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          placeholder,
          height: 600,
          menubar: WORD_LIKE_MENUBAR,
          toolbar: WORD_LIKE_TOOLBAR,
          plugins: WORD_LIKE_PLUGINS,
          toolbar_mode: 'sliding',
          toolbar_sticky: true,
          toolbar_sticky_offset: 64,
          autosave_interval: '30s',
          autosave_restore_when_empty: true,
          autosave_ask_before_unload: true,
          branding: false,
          browser_spellcheck: true,
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
            'Inter=Inter,sans-serif;Arial=arial,helvetica,sans-serif;Georgia=georgia,palatino;Times New Roman=times new roman,times;Courier New=courier new,courier;Roboto=Roboto,sans-serif;Lora=Lora,serif',
          font_size_formats: '12px 14px 16px 18px 20px 24px 30px 36px 48px',
          line_height_formats: '1 1.2 1.4 1.5 1.7 2',
          image_advtab: true,
          image_caption: true,
          image_title: true,
          convert_urls: false,
          quickbars_insert_toolbar: 'quickimage quicktable customMediaLibrary',
          quickbars_selection_toolbar:
            'bold italic underline | forecolor backcolor | link blockquote quicklink',
          save_enablewhendirty: true,
          save_onsavecallback: () => {
            if (editorRef.current) {
              onChange?.(editorRef.current.getContent());
            }
          },
          templates: [
            {
              title: 'Hero with image',
              description: 'Headline, paragraph and image hero section',
              content:
                '<section class="hero"><h2>Hero title</h2><p>Describe the highlight of your article.</p><figure class="image"><img src="" alt=""></figure></section>',
            },
            {
              title: 'Two column text',
              description: 'Split content into two balanced columns',
              content:
                '<div class="columns" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;"><div><h3>Left column</h3><p>Start writing...</p></div><div><h3>Right column</h3><p>Continue writing...</p></div></div>',
            },
          ],
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


