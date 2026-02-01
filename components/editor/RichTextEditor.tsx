'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  Heading1, Heading2, 
  List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, 
  Link as LinkIcon, Image as ImageIcon, 
  Quote, Undo, Redo, 
  Copy, Trash, Check, X, Upload, ExternalLink, 
  Eraser, Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback, useState, useEffect, useRef } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  className?: string;
  placeholder?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children, 
  title,
  className
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean; 
  children: React.ReactNode;
  title?: string;
  className?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    type="button"
    className={cn(
      "p-2 rounded-md transition-colors hover:bg-stone-100 text-stone-600",
      isActive && "bg-stone-100 text-red-600 font-medium",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
);

export default function RichTextEditor({ content, onChange, className, placeholder }: RichTextEditorProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [linkPopover, setLinkPopover] = useState<{ x: number; y: number; visible: boolean; url: string }>({ x: 0, y: 0, visible: false, url: '' });
  const [imagePopover, setImagePopover] = useState<{ x: number; y: number; visible: boolean; tab: 'url' | 'upload'; url: string }>({ x: 0, y: 0, visible: false, tab: 'upload', url: '' });
  
  // Force update for toolbar sync
  const [, forceUpdate] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'border-t border-stone-300 my-8',
          },
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'w-full rounded-xl my-6', // Default full width
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-red-600 underline cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-stone prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onTransaction: () => {
      // Force re-render on every transaction (selection change, etc.)
      // This ensures toolbar buttons light up immediately on keypress
      forceUpdate((n) => n + 1);
    },
  });

  // Close menus on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.link-popover') && !target.closest('.image-popover') && !target.closest('.menu-button-interactive')) {
        setLinkPopover(prev => ({ ...prev, visible: false }));
        setImagePopover(prev => ({ ...prev, visible: false }));
      }
      setContextMenu(prev => ({ ...prev, visible: false }));
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setLinkPopover(prev => ({ ...prev, visible: false }));
    setImagePopover(prev => ({ ...prev, visible: false }));
    
    const rect = editorRef.current?.getBoundingClientRect();
    if (rect) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        visible: true,
      });
    }
  };

  const openImagePopover = useCallback(() => {
    if (!editor) return;
    const toolbar = editorRef.current?.querySelector('.editor-toolbar');
    const rect = toolbar?.getBoundingClientRect();
    
    setImagePopover({
      x: rect ? rect.left + 400 : 300, 
      y: rect ? rect.bottom + 10 : 200,
      visible: true,
      tab: 'upload',
      url: ''
    });
  }, [editor]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const formData = new FormData();
      formData.append('file', file);

      fetch('/api/upload/blog', {
        method: 'POST',
        body: formData,
      })
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url, alt: data.filename }).run();
          setImagePopover(prev => ({ ...prev, visible: false }));
        } else {
          alert('Failed to upload: ' + data.error);
        }
      })
      .catch(err => alert('Error uploading image'));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const insertImageUrl = () => {
    if (imagePopover.url && editor) {
      editor.chain().focus().setImage({ src: imagePopover.url }).run();
      setImagePopover(prev => ({ ...prev, visible: false }));
    }
  };

  const openLinkPopover = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    const toolbar = editorRef.current?.querySelector('.editor-toolbar');
    const rect = toolbar?.getBoundingClientRect();
    
    setLinkPopover({
      x: rect ? rect.left + 300 : 200,
      y: rect ? rect.bottom + 10 : 200,
      visible: true,
      url: previousUrl
    });
  }, [editor]);

  const applyLink = () => {
    if (!editor) return;
    if (linkPopover.url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkPopover.url }).run();
    }
    setLinkPopover(prev => ({ ...prev, visible: false }));
  };

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkPopover(prev => ({ ...prev, visible: false, url: '' }));
  };

  const handleCopy = () => {
    const selection = window.getSelection();
    if (selection) {
      navigator.clipboard.writeText(selection.toString());
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div 
      ref={editorRef}
      onContextMenu={handleContextMenu}
      className={cn("bg-white border border-stone-200 rounded-xl shadow-sm flex flex-col relative", className)}
    >
      <style jsx global>{`
        .ProseMirror-selectednode {
          outline: 3px solid #ef4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
          transition: all 0.2s;
        }
      `}</style>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Toolbar */}
      <div className="editor-toolbar border-b border-stone-200 bg-white p-2 sticky top-[72px] z-10 flex flex-wrap gap-1 items-center rounded-t-xl transition-all">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-r border-stone-200 pr-2 mr-2">
          <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={18} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={18} /></MenuButton>
        </div>

        {/* Text Style */}
        <div className="flex items-center gap-1 border-r border-stone-200 pr-2 mr-2">
          <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (Ctrl+B)"><Bold size={18} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic (Ctrl+I)"><Italic size={18} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline (Ctrl+U)"><UnderlineIcon size={18} /></MenuButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-stone-200 pr-2 mr-2">
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 size={18} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={18} /></MenuButton>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-stone-200 pr-2 mr-2">
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft size={18} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter size={18} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight size={18} /></MenuButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 mr-2">
          <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List"><List size={18} /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List"><ListOrdered size={18} /></MenuButton>
        </div>

        {/* Insert */}
        <div className="flex items-center gap-1">
           <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote"><Quote size={18} /></MenuButton>
           <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={18} /></MenuButton>
          <MenuButton onClick={openLinkPopover} isActive={editor.isActive('link')} title="Link" className="menu-button-interactive"><LinkIcon size={18} /></MenuButton>
          <MenuButton onClick={openImagePopover} isActive={imagePopover.visible} title="Image" className="menu-button-interactive"><ImageIcon size={18} /></MenuButton>
        </div>
      </div>

      {/* Content */}
      <EditorContent editor={editor} className="bg-stone-50 min-h-[500px]" />

      {/* Image Popover (Unified) */}
      {imagePopover.visible && (
        <div 
           className="image-popover fixed z-50 bg-white rounded-xl shadow-xl border border-stone-200 p-4 min-w-[320px] animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-3"
           style={{ top: imagePopover.y, left: imagePopover.x }}
           onClick={(e) => e.stopPropagation()}
        >
           <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex gap-4">
                 <button onClick={() => setImagePopover({...imagePopover, tab: 'upload'})} className={cn("text-xs font-semibold uppercase tracking-wider pb-1", imagePopover.tab === 'upload' ? "text-red-600 border-b-2 border-red-600" : "text-stone-400 hover:text-stone-600")}>Upload</button>
                 <button onClick={() => setImagePopover({...imagePopover, tab: 'url'})} className={cn("text-xs font-semibold uppercase tracking-wider pb-1", imagePopover.tab === 'url' ? "text-red-600 border-b-2 border-red-600" : "text-stone-400 hover:text-stone-600")}>Link</button>
              </div>
              <button onClick={() => setImagePopover({...imagePopover, visible: false})} className="text-stone-400 hover:text-stone-600"><X size={16} /></button>
           </div>

           {imagePopover.tab === 'upload' ? (
              <div className="py-4 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <Upload className="w-8 h-8 text-stone-300 mb-2" />
                 <span className="text-sm font-medium text-stone-600">Click to upload image</span>
                 <span className="text-xs text-stone-400">or drag and drop</span>
              </div>
           ) : (
              <div className="flex gap-2">
                 <input 
                    type="text" 
                    value={imagePopover.url}
                    onChange={(e) => setImagePopover({...imagePopover, url: e.target.value})}
                    placeholder="Paste image URL..."
                    className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && insertImageUrl()}
                 />
                 <button onClick={insertImageUrl} className="p-2 bg-stone-900 text-white rounded-lg hover:bg-black">
                    <Check size={18} />
                 </button>
              </div>
           )}
        </div>
      )}

      {/* Link Popover */}
      {linkPopover.visible && (
         <div 
          className="link-popover fixed z-50 bg-white rounded-xl shadow-xl border border-stone-200 p-3 min-w-[300px] animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-2"
          style={{ top: linkPopover.y, left: linkPopover.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-stone-500 uppercase">Edit Link</label> 
            <button onClick={() => setLinkPopover({...linkPopover, visible: false})} className="text-stone-400 hover:text-stone-600"><X size={14} /></button>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={linkPopover.url}
              onChange={(e) => setLinkPopover({...linkPopover, url: e.target.value})}
              placeholder="https://example.com"
              className="flex-1 px-3 py-1.5 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && applyLink()}
            />
            <button onClick={applyLink} className="p-1.5 bg-stone-900 text-white rounded-md hover:bg-black">
              <Check size={16} />
            </button>
          </div>
          <div className="flex justify-between items-center pt-1">
            <button onClick={removeLink} className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              <Eraser size={12} /> Remove Link
            </button>
             <button onClick={() => window.open(linkPopover.url, '_blank')} className="text-xs text-stone-400 hover:text-stone-600 flex items-center gap-1" disabled={!linkPopover.url}>
              <ExternalLink size={12} /> Test Link
            </button>
          </div>
        </div>
      )}

       {/* Simple Context Menu */}
      {contextMenu.visible && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-stone-200 py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-widest">Format</div>
          <button onClick={() => { editor.chain().focus().toggleBold().run(); setContextMenu({ ...contextMenu, visible: false }); }} className="w-full text-left px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
            <Bold size={14} /> Bold
          </button>
          <button onClick={() => { editor.chain().focus().toggleItalic().run(); setContextMenu({ ...contextMenu, visible: false }); }} className="w-full text-left px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
            <Italic size={14} /> Italic
          </button>
           <button onClick={() => { editor.chain().focus().toggleUnderline().run(); setContextMenu({ ...contextMenu, visible: false }); }} className="w-full text-left px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
            <UnderlineIcon size={14} /> Underline
          </button>
          
          <div className="my-1 border-t border-stone-100" />
           <button onClick={handleCopy} className="w-full text-left px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
            <Copy size={14} /> Copy
          </button>
          
          <div className="px-2 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-widest mt-1">Actions</div>
          <button onClick={() => { editor.chain().focus().unsetAllMarks().run(); setContextMenu({ ...contextMenu, visible: false }); }} className="w-full text-left px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2">
            <Eraser size={14} /> Clear Format
          </button>
          <button onClick={() => { editor.chain().focus().deleteSelection().run(); setContextMenu({ ...contextMenu, visible: false }); }} className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
            <Trash size={14} /> Delete Selection
          </button>
        </div>
      )}
    </div>
  );
}
