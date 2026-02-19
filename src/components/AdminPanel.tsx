import { useState, useEffect } from 'react';
import {
  LogOut, Save, Plus, Trash2, Image, FileText, Phone, Info,
  Lock, Eye, EyeOff, X, Shield, RotateCcw, Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminLogout, changeAdminCredentials } from '@/lib/auth';
import { saveContent, resetContent, type SiteContent, type GalleryImage, type BlogPost } from '@/lib/content';

interface Props {
  content: SiteContent;
  onContentChange: (next: SiteContent) => void;
  onClose: () => void;
}

type Tab = 'hero' | 'gallery' | 'blog' | 'contact' | 'about' | 'security';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'hero', label: 'Hero', icon: <Camera className="w-4 h-4" /> },
  { id: 'gallery', label: 'Gallery', icon: <Image className="w-4 h-4" /> },
  { id: 'blog', label: 'Blog', icon: <FileText className="w-4 h-4" /> },
  { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
  { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
];

type GalleryCategory = 'pregnancy' | 'newborn' | 'child' | 'family';

export function AdminPanel({ content, onContentChange, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('hero');
  const [draft, setDraft] = useState<SiteContent>(structuredClone(content));
  const [saved, setSaved] = useState(false);

  // Security tab state
  const [unameCurrent, setUnameCurrent] = useState('');
  const [pwCurrent, setPwCurrent] = useState('');
  const [unameNew, setUnameNew] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [showPw, setShowPw] = useState(false);

  // Gallery tab state
  const [galCat, setGalCat] = useState<GalleryCategory>('pregnancy');
  const [newImgSrc, setNewImgSrc] = useState('');
  const [newImgTitle, setNewImgTitle] = useState('');

  // Blog state
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    setDraft(structuredClone(content));
  }, [content]);

  const save = () => {
    saveContent(draft);
    onContentChange(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    adminLogout();
    onClose();
  };

  const handleReset = () => {
    if (!confirm('این کار تمام تغییرات شما را پاک می‌کند. مطمئن هستید؟\nThis will reset all content to defaults. Are you sure?')) return;
    resetContent();
    window.location.reload();
  };

  // --- Hero ---
  const updateHeroImage = (val: string) =>
    setDraft((d) => ({ ...d, hero: { ...d.hero, image: val } }));

  // --- Gallery ---
  const addImage = () => {
    if (!newImgSrc.trim()) return;
    const imgs = draft.gallery[galCat];
    const nextId = imgs.length ? Math.max(...imgs.map((i) => i.id)) + 1 : 1;
    const newImg: GalleryImage = {
      id: nextId,
      src: newImgSrc.trim(),
      alt: galCat.charAt(0).toUpperCase() + galCat.slice(1) + ' Photography',
      title: newImgTitle.trim() || undefined,
    };
    setDraft((d) => ({
      ...d,
      gallery: { ...d.gallery, [galCat]: [...d.gallery[galCat], newImg] },
    }));
    setNewImgSrc('');
    setNewImgTitle('');
  };

  const removeImage = (cat: GalleryCategory, id: number) => {
    setDraft((d) => ({
      ...d,
      gallery: { ...d.gallery, [cat]: d.gallery[cat].filter((i) => i.id !== id) },
    }));
  };

  // --- Blog ---
  const startEditPost = (post: BlogPost) => setEditingPost(structuredClone(post));

  const savePost = () => {
    if (!editingPost) return;
    if (editingPost.id === -1) {
      // new post
      const nextId = draft.blog.length ? Math.max(...draft.blog.map((p) => p.id)) + 1 : 1;
      setDraft((d) => ({ ...d, blog: [...d.blog, { ...editingPost, id: nextId }] }));
    } else {
      setDraft((d) => ({
        ...d,
        blog: d.blog.map((p) => (p.id === editingPost.id ? editingPost : p)),
      }));
    }
    setEditingPost(null);
  };

  const deletePost = (id: number) => {
    if (!confirm('Delete this post?')) return;
    setDraft((d) => ({ ...d, blog: d.blog.filter((p) => p.id !== id) }));
  };

  const newPost = (): BlogPost => ({
    id: -1,
    image: '',
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    date: new Date().toLocaleDateString('fa-IR'),
  });

  // --- Contact ---
  const updatePhone = (idx: number, val: string) => {
    const phones = [...draft.contact.phones];
    phones[idx] = val;
    setDraft((d) => ({ ...d, contact: { ...d.contact, phones } }));
  };
  const addPhone = () =>
    setDraft((d) => ({ ...d, contact: { ...d.contact, phones: [...d.contact.phones, ''] } }));
  const removePhone = (idx: number) =>
    setDraft((d) => ({
      ...d,
      contact: { ...d.contact, phones: d.contact.phones.filter((_, i) => i !== idx) },
    }));

  // --- Security ---
  const handleChangePassword = async () => {
    setPwError('');
    setPwSuccess('');
    if (pwNew !== pwConfirm) {
      setPwError('New passwords do not match.');
      return;
    }
    const result = await changeAdminCredentials(unameCurrent, pwCurrent, unameNew.trim(), pwNew);
    if (result.ok) {
      setPwSuccess('Credentials updated successfully.');
      setUnameCurrent('');
      setPwCurrent('');
      setUnameNew('');
      setPwNew('');
      setPwConfirm('');
    } else {
      setPwError(result.error ?? 'Failed to update credentials.');
    }
  };

  // Shared input style
  const inp = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all';
  const label = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="bg-navy text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gold" />
          <span className="font-bold text-base">BaharFilm Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={save}
            className={`text-xs px-4 py-2 h-auto rounded-lg font-bold transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-gold text-navy hover:bg-gold-dark'
            }`}
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-xs px-4 py-2 h-auto border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Logout
          </Button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
            title="Close without saving"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r border-gray-100 flex-shrink-0 py-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-gold-light text-navy border-r-2 border-gold-dark'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-navy'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
          <div className="border-t border-gray-100 mt-4 pt-4 px-4">
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Content
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* HERO TAB */}
          {tab === 'hero' && (
            <div className="max-w-lg space-y-6">
              <h2 className="text-lg font-bold text-navy">Hero Section</h2>
              <div>
                <label className={label}>Hero Image URL</label>
                <input
                  className={inp}
                  value={draft.hero.image}
                  onChange={(e) => updateHeroImage(e.target.value)}
                  placeholder="/images/hero-baby.jpg or https://..."
                />
                {draft.hero.image && (
                  <div className="mt-3 rounded-xl overflow-hidden h-40 bg-gray-100">
                    <img
                      src={draft.hero.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {tab === 'gallery' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-navy">Gallery Management</h2>

              {/* Category selector */}
              <div className="flex gap-2 flex-wrap">
                {(['pregnancy', 'newborn', 'child', 'family'] as GalleryCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalCat(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                      galCat === cat ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat} ({draft.gallery[cat].length})
                  </button>
                ))}
              </div>

              {/* Current images */}
              <div className="space-y-3">
                {draft.gallery[galCat].map((img) => (
                  <div key={img.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{img.title || img.alt}</p>
                      <p className="text-xs text-gray-400 truncate">{img.src}</p>
                    </div>
                    <button
                      onClick={() => removeImage(galCat, img.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {draft.gallery[galCat].length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">No images in this category.</p>
                )}
              </div>

              {/* Add new image */}
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-navy">Add New Image</p>
                <div>
                  <label className={label}>Image URL *</label>
                  <input
                    className={inp}
                    value={newImgSrc}
                    onChange={(e) => setNewImgSrc(e.target.value)}
                    placeholder="/images/photo.jpg or https://..."
                  />
                </div>
                <div>
                  <label className={label}>Title (optional)</label>
                  <input
                    className={inp}
                    value={newImgTitle}
                    onChange={(e) => setNewImgTitle(e.target.value)}
                    placeholder="e.g. Spring Session"
                  />
                </div>
                <Button
                  onClick={addImage}
                  disabled={!newImgSrc.trim()}
                  className="bg-navy text-white rounded-xl px-5 py-2 h-auto text-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Image
                </Button>
              </div>
            </div>
          )}

          {/* BLOG TAB */}
          {tab === 'blog' && (
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy">Blog Posts</h2>
                <Button
                  onClick={() => startEditPost(newPost())}
                  className="bg-navy text-white rounded-xl px-4 py-2 h-auto text-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  New Post
                </Button>
              </div>

              {/* Post list */}
              <div className="space-y-3">
                {draft.blog.map((post) => (
                  <div key={post.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={post.image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{post.titleEn}</p>
                      <p className="text-xs text-gray-400">{post.date}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => startEditPost(post)}
                        className="p-1.5 text-navy hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit post modal */}
              {editingPost && (
                <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-navy">{editingPost.id === -1 ? 'New Post' : 'Edit Post'}</h3>
                      <button onClick={() => setEditingPost(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {[
                      { key: 'titleEn', label: 'Title (EN)', placeholder: 'English title' },
                      { key: 'title', label: 'Title (FA)', placeholder: 'عنوان فارسی' },
                      { key: 'descriptionEn', label: 'Description (EN)', placeholder: 'English description' },
                      { key: 'description', label: 'Description (FA)', placeholder: 'توضیح فارسی' },
                      { key: 'image', label: 'Image URL', placeholder: '/images/blog.jpg' },
                      { key: 'date', label: 'Date', placeholder: '۱۴۰۳/۱۱/۱۵' },
                    ].map(({ key, label: lbl, placeholder }) => (
                      <div key={key}>
                        <label className={label}>{lbl}</label>
                        <input
                          className={inp}
                          value={(editingPost as unknown as Record<string, string>)[key]}
                          onChange={(e) =>
                            setEditingPost((p) => p ? { ...p, [key]: e.target.value } : p)
                          }
                          placeholder={placeholder}
                          dir={key === 'title' || key === 'description' ? 'rtl' : 'ltr'}
                        />
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <Button onClick={savePost} className="flex-1 bg-navy text-white rounded-xl py-2.5 h-auto">
                        <Save className="w-4 h-4 mr-1.5" />
                        Save Post
                      </Button>
                      <Button onClick={() => setEditingPost(null)} variant="outline" className="flex-1 rounded-xl py-2.5 h-auto">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONTACT TAB */}
          {tab === 'contact' && (
            <div className="max-w-lg space-y-6">
              <h2 className="text-lg font-bold text-navy">Contact Information</h2>

              {/* Phone numbers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-navy">Phone Numbers</label>
                  <button onClick={addPhone} className="text-xs text-teal hover:text-teal/80 flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                {draft.contact.phones.map((ph, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className={inp}
                      value={ph}
                      dir="ltr"
                      onChange={(e) => updatePhone(idx, e.target.value)}
                      placeholder="۰۲۱-XXXXXXXX"
                    />
                    <button onClick={() => removePhone(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {[
                { key: 'whatsapp', label: 'WhatsApp Number (digits only, with country code)', placeholder: '989301234567' },
                { key: 'email', label: 'Email', placeholder: 'info@baharfilmstudio.com' },
                { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
                { key: 'telegram', label: 'Telegram URL', placeholder: 'https://t.me/...' },
              ].map(({ key, label: lbl, placeholder }) => (
                <div key={key}>
                  <label className={label}>{lbl}</label>
                  <input
                    className={inp}
                    value={(draft.contact as unknown as Record<string, string>)[key]}
                    dir="ltr"
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, contact: { ...d.contact, [key]: e.target.value } }))
                    }
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div>
                <label className={label}>Address (Farsi)</label>
                <textarea
                  className={inp + ' resize-none'}
                  rows={2}
                  dir="rtl"
                  value={draft.contact.addressFa}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, contact: { ...d.contact, addressFa: e.target.value } }))
                  }
                />
              </div>
              <div>
                <label className={label}>Address (English)</label>
                <textarea
                  className={inp + ' resize-none'}
                  rows={2}
                  value={draft.contact.addressEn}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, contact: { ...d.contact, addressEn: e.target.value } }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Working Hours (FA)</label>
                  <input className={inp} dir="rtl" value={draft.contact.hoursFa}
                    onChange={(e) => setDraft((d) => ({ ...d, contact: { ...d.contact, hoursFa: e.target.value } }))} />
                </div>
                <div>
                  <label className={label}>Working Hours (EN)</label>
                  <input className={inp} value={draft.contact.hoursEn}
                    onChange={(e) => setDraft((d) => ({ ...d, contact: { ...d.contact, hoursEn: e.target.value } }))} />
                </div>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {tab === 'about' && (
            <div className="max-w-lg space-y-6">
              <h2 className="text-lg font-bold text-navy">About Section</h2>
              <div>
                <label className={label}>About Text (Farsi)</label>
                <textarea
                  className={inp + ' resize-none'}
                  rows={6}
                  dir="rtl"
                  value={draft.about.textFa}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, about: { ...d.about, textFa: e.target.value } }))
                  }
                />
              </div>
              <div>
                <label className={label}>About Text (English)</label>
                <textarea
                  className={inp + ' resize-none'}
                  rows={6}
                  value={draft.about.textEn}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, about: { ...d.about, textEn: e.target.value } }))
                  }
                />
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {tab === 'security' && (
            <div className="max-w-md space-y-6">
              <h2 className="text-lg font-bold text-navy">Security Settings</h2>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                Default credentials — username: <code className="font-mono bg-amber-100 px-1 rounded">admin</code>, password: <code className="font-mono bg-amber-100 px-1 rounded">BaharFilm2024</code>. Change both after first login.
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
                <h3 className="font-medium text-navy">Update Credentials</h3>
                <p className="text-xs text-gray-400">Only the hash of username+password is stored — neither is saved in plain text.</p>

                {/* Current credentials */}
                <div className="space-y-3 pb-4 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current</p>
                  <div>
                    <label className={label}>Username</label>
                    <input
                      type="text"
                      className={inp}
                      value={unameCurrent}
                      onChange={(e) => setUnameCurrent(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className={label}>Password</label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        className={inp + ' pr-10'}
                        value={pwCurrent}
                        onChange={(e) => setPwCurrent(e.target.value)}
                      />
                      <button type="button" onClick={() => setShowPw((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* New credentials */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">New</p>
                  <div>
                    <label className={label}>New Username</label>
                    <input
                      type="text"
                      className={inp}
                      value={unameNew}
                      onChange={(e) => setUnameNew(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className={label}>New Password (min 8 chars)</label>
                    <input
                      type={showPw ? 'text' : 'password'}
                      className={inp}
                      value={pwNew}
                      onChange={(e) => setPwNew(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={label}>Confirm New Password</label>
                    <input
                      type={showPw ? 'text' : 'password'}
                      className={inp}
                      value={pwConfirm}
                      onChange={(e) => setPwConfirm(e.target.value)}
                    />
                  </div>
                </div>

                {pwError && <p className="text-sm text-red-500">{pwError}</p>}
                {pwSuccess && <p className="text-sm text-green-600">{pwSuccess}</p>}

                <Button
                  onClick={handleChangePassword}
                  className="bg-navy text-white rounded-xl px-6 py-2.5 h-auto text-sm w-full"
                >
                  <Lock className="w-4 h-4 mr-1.5" />
                  Update Credentials
                </Button>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-3">
                <h3 className="font-medium text-navy">Session</h3>
                <p className="text-sm text-gray-500">Admin sessions expire after 2 hours of inactivity.</p>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-200 text-red-500 hover:bg-red-50 rounded-xl px-5 py-2 h-auto text-sm"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout Now
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
