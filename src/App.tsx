import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  Instagram,
  Send,
  MapPin,
  Mail,
  Clock,
  Globe,
  ChevronLeft,
  ChevronRight,
  Camera,
  Baby,
  Heart,
  Users,
  Sparkles,
  Calendar,
  BookOpen,
  Info,
  PhoneCall
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Types
interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title?: string;
}

interface BlogPost {
  id: number;
  image: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
}

interface NavItem {
  label: string;
  labelEn: string;
  href: string;
  icon?: React.ReactNode;
  children?: { label: string; labelEn: string; href: string }[];
}

// Translations
const translations = {
  fa: {
    welcome: 'به استودیو',
    studioName: 'بهارفیلم',
    welcomeSuffix: 'خوش آمدید',
    subtitle: 'استودیو عکاسی نوزاد، کودک، بارداری و خانوادگی. همه چیز درمورد گرفتن تعدادی عکس نیست، هدف ما جشن گرفتن به افتخار زندگی است.',
    getConsultation: 'دریافت مشاوره',
    callUs: 'تماس با ما',
    springDecorations: 'دکورهای فصل بهار',
    new: 'جدید',
    pregnancy: 'عکاسی بارداری',
    newborn: 'عکاسی نوزادی',
    child: 'عکاسی کودک',
    family: 'عکاسی خانوادگی',
    seeMore: 'مشاهده بیشتر',
    latestPosts: 'آخرین مطالب',
    aboutTitle: 'درباره ما',
    aboutText: 'ما آتلیه تخصصی نوزاد و کودک بهارفیلم را تأسیس کردیم که سال ۹۳ زندگی حرفه‌ای ما با یک دوربین و عشقی بزرگ آغاز شد. در بهارفیلم، ما باور داریم که هر کودک داستانی منحصر به فرد دارد و ما مفتخریم که روایت‌گر این داستان‌ها هستیم. ما اینجا هستیم تا هر لحظه از زندگی کوچک شما را ثبت کنیم. از لبخندهای اولیه تا قدم‌های اول، ما اینجا هستیم تا زیباترین لحظات را برای شما ثبت کنیم.',
    contactInfo: 'اطلاعات تماس',
    address: 'تهران - یوسف‌آباد - خیابان اسدآبادی - بین کوچه ۶۳ و ۶۵ - پلاک ۴۸۵ - طبقه ۹ - واحد ۹۵',
    email: 'info@baharfilmstudio.com',
    workingHours: 'شنبه تا پنج‌شنبه ۱۰ الی ۱۸',
    menu: 'فهرست',
    home: 'صفحه اصلی',
    gallery: 'گالری',
    blog: 'بلاگ',
    workshop: 'ورکشاپ',
    collaboration: 'همکاری با ما',
    about: 'درباره ما',
    contact: 'ارتباط با ما',
    locations: 'شعبه‌ها',
    iran: 'ایران (تهران)',
    uae: 'امارات متحده عربی (دبی)',
    copyright: '© ۱۴۰۴ تمامی حقوق برای استودیو بهارفیلم محفوظ می‌باشد.',
    responseHours: 'پاسخگوی شما عزیزان ۱۰ الی ۱۸',
    decorSpring: 'دکور نوروز',
    decorBunny: 'دکور خانه خرگوشی',
    decorDream: 'دکور رویا سپید',
    decorTeddy: 'دکور تدی‌های عاشق',
  },
  en: {
    welcome: 'Welcome to',
    studioName: 'BaharFilm',
    welcomeSuffix: 'Studio',
    subtitle: 'Newborn, Child, Pregnancy & Family Photography Studio. It\'s not just about taking photos, our goal is to celebrate life.',
    getConsultation: 'Get Consultation',
    callUs: 'Call Us',
    springDecorations: 'Spring Season Decorations',
    new: 'NEW',
    pregnancy: 'Pregnancy Photography',
    newborn: 'Newborn Photography',
    child: 'Child Photography',
    family: 'Family Photography',
    seeMore: 'See More',
    latestPosts: 'Latest Posts',
    aboutTitle: 'About Us',
    aboutText: 'We established BaharFilm Specialized Newborn & Child Studio in 2014. At BaharFilm, we believe every child has a unique story, and we are proud to be the storytellers. We are here to capture every moment of your little one\'s life. From first smiles to first steps, we are here to capture your most beautiful moments.',
    contactInfo: 'Contact Information',
    address: 'Tehran - Yousefabad - Asadabadi St - Between Alleys 63 & 65 - No 485 - 9th Floor - Unit 95',
    email: 'info@baharfilmstudio.com',
    workingHours: 'Saturday to Thursday 10 AM - 6 PM',
    menu: 'Menu',
    home: 'Home',
    gallery: 'Gallery',
    blog: 'Blog',
    workshop: 'Workshop',
    collaboration: 'Collaboration',
    about: 'About Us',
    contact: 'Contact Us',
    locations: 'Locations',
    iran: 'Iran (Tehran)',
    uae: 'United Arab Emirates (Dubai)',
    copyright: '© 2025 All rights reserved for BaharFilm Studio.',
    responseHours: 'Available for you 10 AM - 6 PM',
    decorSpring: 'Nowruz Decor',
    decorBunny: 'Bunny House Decor',
    decorDream: 'White Dream Decor',
    decorTeddy: 'Lovely Teddy Decor',
  }
};

// Data
const pregnancyImages: GalleryImage[] = [
  { id: 1, src: '/images/pregnancy-1.jpg', alt: 'Pregnancy Photography', title: 'Maternity Portrait' },
  { id: 2, src: '/images/pregnancy-2.jpg', alt: 'Pregnancy Photography', title: 'Elegant Maternity' },
];

const newbornImages: GalleryImage[] = [
  { id: 1, src: '/images/newborn-1.jpg', alt: 'Newborn Photography', title: 'Christmas Newborn' },
  { id: 2, src: '/images/newborn-2.jpg', alt: 'Newborn Photography', title: 'Winter Wonderland' },
];

const childImages: GalleryImage[] = [
  { id: 1, src: '/images/child-1.jpg', alt: 'Child Photography', title: 'Birthday Celebration' },
  { id: 2, src: '/images/child-2.jpg', alt: 'Child Photography', title: 'Outdoor Portrait' },
];

const familyImages: GalleryImage[] = [
  { id: 1, src: '/images/family-1.jpg', alt: 'Family Photography', title: 'Family Christmas' },
  { id: 2, src: '/images/family-2.jpg', alt: 'Family Photography', title: 'Elegant Family' },
];

const blogPosts: BlogPost[] = [
  {
    id: 1,
    image: '/images/blog-1.jpg',
    title: 'لباس عکاسی نوزاد | راهنمای کامل انتخاب',
    titleEn: 'Newborn Photography Outfit | Complete Selection Guide',
    description: 'راهنمای کامل انتخاب لباس مناسب برای عکس نوزاد در آتلیه',
    descriptionEn: 'Complete guide for choosing the right outfit for newborn studio photography',
    date: '۱۴۰۳/۱۱/۱۵'
  },
  {
    id: 2,
    image: '/images/blog-2.jpg',
    title: 'عکس خانوادگی مانندکار',
    titleEn: 'Family Portrait Like a Pro',
    description: 'چگونه یک عکس خانوادگی مانندکار خلق کنیم؟',
    descriptionEn: 'How to create a professional-looking family portrait?',
    date: '۱۴۰۳/۱۱/۱۰'
  },
  {
    id: 3,
    image: '/images/blog-3.jpg',
    title: 'آماده سازی برای عکاسی نوزاد',
    titleEn: 'Preparing for Newborn Photography',
    description: 'راهنمای کامل والدین برای یک جلسه عکاسی ایده‌آل',
    descriptionEn: 'Complete parent guide for an ideal photography session',
    date: '۱۴۰۳/۱۱/۰۵'
  },
  {
    id: 4,
    image: '/images/blog-4.jpg',
    title: 'ایده عکس خانوادگی | ایده‌های خلاقانه',
    titleEn: 'Family Photo Ideas | Creative Concepts',
    description: 'ایده‌های خلاقانه عکس‌های خانوادگی در آتلیه',
    descriptionEn: 'Creative family photo ideas for studio sessions',
    date: '۱۴۰۳/۱۰/۲۸'
  },
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'pregnancy' | 'newborn' | 'child' | 'family'>('pregnancy');
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [, setCurrentImageIndex] = useState(0);

  const t = translations[lang];
  const isRTL = lang === 'fa';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [isRTL, lang]);

  const getCategoryImages = () => {
    switch (activeCategory) {
      case 'pregnancy': return pregnancyImages;
      case 'newborn': return newbornImages;
      case 'child': return childImages;
      case 'family': return familyImages;
      default: return pregnancyImages;
    }
  };

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'pregnancy': return t.pregnancy;
      case 'newborn': return t.newborn;
      case 'child': return t.child;
      case 'family': return t.family;
      default: return t.pregnancy;
    }
  };

  const navItems: NavItem[] = [
    { label: t.home, labelEn: 'Home', href: '#home', icon: <Camera className="w-5 h-5" /> },
    { 
      label: t.gallery, 
      labelEn: 'Gallery', 
      href: '#gallery',
      icon: <Sparkles className="w-5 h-5" />,
      children: [
        { label: t.pregnancy, labelEn: 'Pregnancy', href: '#gallery' },
        { label: t.newborn, labelEn: 'Newborn', href: '#gallery' },
        { label: t.child, labelEn: 'Child', href: '#gallery' },
        { label: t.family, labelEn: 'Family', href: '#gallery' },
      ]
    },
    { label: t.blog, labelEn: 'Blog', href: '#blog', icon: <BookOpen className="w-5 h-5" /> },
    { label: t.workshop, labelEn: 'Workshop', href: '#workshop', icon: <Calendar className="w-5 h-5" /> },
    { label: t.collaboration, labelEn: 'Collaboration', href: '#collaboration', icon: <Users className="w-5 h-5" /> },
    { label: t.about, labelEn: 'About', href: '#about', icon: <Info className="w-5 h-5" /> },
    { label: t.contact, labelEn: 'Contact', href: '#contact', icon: <PhoneCall className="w-5 h-5" /> },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % getCategoryImages().length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + getCategoryImages().length) % getCategoryImages().length);
  };

  return (
    <div className={`min-h-screen bg-white font-vazirmatn ${isRTL ? '' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo - Right side in RTL */}
            <a href="#home" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-navy" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal rounded-full flex items-center justify-center">
                  <Baby className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-navy leading-tight">BaharFilm</span>
                <span className="text-xs text-gold-dark font-medium">{lang === 'fa' ? 'استودیو بهارفیلم' : 'Pregnancy & Newborn Studio'}</span>
              </div>
            </a>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gold-dark hover:bg-gold-light/50 rounded-xl transition-all flex items-center gap-2"
                >
                  {item.icon}
                  {lang === 'fa' ? item.label : item.labelEn}
                </a>
              ))}
            </nav>

            {/* Right Side - Language & Menu */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative group">
                <button 
                  onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{lang === 'fa' ? 'فارسی' : 'English'}</span>
                  <span className="text-lg">{lang === 'fa' ? '🇮🇷' : '🇬🇧'}</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side={isRTL ? 'right' : 'left'} className="w-[320px] p-0 bg-white">
                  <div className="flex flex-col h-full">
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-gold-light to-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                          <Camera className="w-5 h-5 text-navy" />
                        </div>
                        <div>
                          <span className="font-bold text-navy">BaharFilm</span>
                          <p className="text-xs text-gray-500">{lang === 'fa' ? 'استودیو بهارفیلم' : 'BaharFilm Studio'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-auto p-4">
                      <nav className="space-y-1">
                        {navItems.map((item) => (
                          <div key={item.href}>
                            {item.children ? (
                              <Accordion type="single" collapsible>
                                <AccordionItem value={item.href} className="border-0">
                                  <AccordionTrigger className="hover:no-underline py-3 px-3 hover:bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                      <span className="text-gold">{item.icon}</span>
                                      <span className="font-medium">{lang === 'fa' ? item.label : item.labelEn}</span>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pr-4">
                                    <div className="flex flex-col gap-1 mt-2">
                                      {item.children.map((child) => (
                                        <button
                                          key={child.href}
                                          onClick={() => {
                                            setActiveCategory(child.labelEn.toLowerCase() as any);
                                            setIsMenuOpen(false);
                                          }}
                                          className="text-right py-2 px-3 text-gray-600 hover:text-gold-dark hover:bg-gold-light/30 rounded-lg transition-all text-sm"
                                        >
                                          {lang === 'fa' ? child.label : child.labelEn}
                                        </button>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ) : (
                              <a
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 py-3 px-3 hover:bg-gray-50 rounded-xl transition-colors"
                              >
                                <span className="text-gold">{item.icon}</span>
                                <span className="font-medium">{lang === 'fa' ? item.label : item.labelEn}</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </nav>

                      {/* Language Switch in Menu */}
                      <div className="mt-6 pt-6 border-t">
                        <p className="text-sm text-gray-500 mb-3">{lang === 'fa' ? 'زبان / Language' : 'Language / زبان'}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLang('fa')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-colors ${
                              lang === 'fa' ? 'bg-gold text-navy font-medium' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <span>🇮🇷</span>
                            <span>فارسی</span>
                          </button>
                          <button
                            onClick={() => setLang('en')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-colors ${
                              lang === 'en' ? 'bg-gold text-navy font-medium' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <span>🇬🇧</span>
                            <span>English</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`pt-20 ${isRTL ? 'pb-36' : 'pb-36'}`}>
        {/* Hero Section */}
        <section id="home" className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl mb-8 group">
              <img 
                src="/images/hero-baby.jpg" 
                alt="BaharFilm Studio" 
                className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full">{t.new}</span>
                  <span className="text-white/80 text-sm">{lang === 'fa' ? 'استودیو تخصصی عکاسی' : 'Specialized Photography Studio'}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                {t.welcome} <span className="text-gold-dark">{t.studioName}</span> {t.welcomeSuffix}
              </h1>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                {t.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-navy hover:bg-navy/90 text-white px-8 py-6 rounded-2xl text-base font-medium shadow-lg hover:shadow-xl transition-all">
                  <Phone className="w-5 h-5 ml-2" />
                  {t.getConsultation}
                </Button>
                <Button variant="outline" className="border-2 border-gold text-navy hover:bg-gold-light px-8 py-6 rounded-2xl text-base font-medium">
                  <Heart className="w-5 h-5 ml-2" />
                  {t.seeMore}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Tabs Section */}
        <section id="gallery" className="px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-gold to-gold-light rounded-[2rem] p-6 md:p-8 relative overflow-hidden shadow-xl">
              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
              <div className="absolute bottom-4 right-4 w-32 h-32 bg-teal/20 rounded-full blur-3xl" />
              
              {/* NEW Badge */}
              <div className="absolute top-4 left-4 bg-teal text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-6">
                {t.new}
              </div>
              
              <h2 className="text-center text-navy font-bold text-xl md:text-2xl mb-6">{t.springDecorations}</h2>
              
              {/* Category Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {(['pregnancy', 'newborn', 'child', 'family'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setCurrentImageIndex(0);
                    }}
                    className={`py-4 px-4 rounded-xl text-sm font-medium transition-all shadow-md ${
                      activeCategory === cat 
                        ? 'bg-navy text-white shadow-lg scale-105' 
                        : 'bg-white/80 text-navy hover:bg-white hover:shadow-lg'
                    }`}
                  >
                    {cat === 'pregnancy' && <Heart className="w-4 h-4 mx-auto mb-1" />}
                    {cat === 'newborn' && <Baby className="w-4 h-4 mx-auto mb-1" />}
                    {cat === 'child' && <Sparkles className="w-4 h-4 mx-auto mb-1" />}
                    {cat === 'family' && <Users className="w-4 h-4 mx-auto mb-1" />}
                    {t[cat]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-navy rounded-[2rem] p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-navy" />
                  </div>
                  <h3 className="text-white font-bold text-lg md:text-xl">{getCategoryTitle()}</h3>
                </div>
                <button className="bg-gold hover:bg-gold-dark text-navy px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg">
                  {t.seeMore}
                </button>
              </div>
              
              {/* Image Gallery */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {getCategoryImages().map((image) => (
                    <div 
                      key={image.id} 
                      className="relative rounded-2xl overflow-hidden group cursor-pointer"
                    >
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="w-full h-56 md:h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-white font-medium text-sm">{lang === 'fa' ? image.title : image.alt}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevImage}
                  className="absolute top-1/2 -translate-y-1/2 -right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gold transition-colors"
                >
                  {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gold transition-colors"
                >
                  {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((dot) => (
                  <div 
                    key={dot} 
                    className={`w-2.5 h-2.5 rounded-full transition-all ${dot === 2 ? 'bg-gold w-6' : 'bg-gray-600 hover:bg-gray-500'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-navy" />
                </div>
                <h3 className="text-navy font-bold text-xl md:text-2xl">{t.latestPosts}</h3>
              </div>
              <button className="bg-navy hover:bg-navy/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                {t.seeMore}
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-cream rounded-[2rem] overflow-hidden shadow-card hover:shadow-card-hover transition-shadow group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={lang === 'fa' ? post.title : post.titleEn}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-navy">
                      {post.date}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-navy font-bold text-base mb-2 line-clamp-2 group-hover:text-gold-dark transition-colors">
                      {lang === 'fa' ? post.title : post.titleEn}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {lang === 'fa' ? post.description : post.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-4 py-12 bg-gradient-to-b from-white to-cream">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-8 h-8 text-navy" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-navy">BaharFilm</h2>
                <p className="text-gold-dark text-sm">{lang === 'fa' ? 'استودیو بهارفیلم' : 'BaharFilm Studio'}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-[2rem] p-8 shadow-card">
              <h3 className="text-navy font-bold text-xl mb-4">{t.aboutTitle}</h3>
              <p className="text-gray-600 leading-loose text-sm md:text-base">
                {t.aboutText}
              </p>
              
              <div className="flex justify-center gap-6 mt-8">
                <div className="text-center">
                  <div className="w-14 h-14 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 text-gold-dark" />
                  </div>
                  <span className="text-xs text-gray-500">{lang === 'fa' ? 'عشق به هنر' : 'Love for Art'}</span>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-2">
                    <Camera className="w-6 h-6 text-gold-dark" />
                  </div>
                  <span className="text-xs text-gray-500">{lang === 'fa' ? 'تجربه ۱۰ ساله' : '10 Years Experience'}</span>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-gold-dark" />
                  </div>
                  <span className="text-xs text-gray-500">{lang === 'fa' ? 'هزاران مشتری' : 'Thousands of Clients'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-navy text-white pt-12 pb-36">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {/* Contact Info */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 text-navy" />
                  </div>
                  <h4 className="font-bold text-lg">{t.contactInfo}</h4>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 leading-relaxed">{t.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-gray-300">{t.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-gray-300" dir="ltr">۰۲۱-۸۶۱۹۴۳۱۶</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-gray-300" dir="ltr">۰۲۱-۸۶۱۹۴۳۳۳</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-gray-300" dir="ltr">۰۹۳۰-۴۸۵۸۵۸۵</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                    <Menu className="w-5 h-5 text-navy" />
                  </div>
                  <h4 className="font-bold text-lg">{t.menu}</h4>
                </div>
                <div className="space-y-3 text-sm">
                  {navItems.map((item) => (
                    <a 
                      key={item.href} 
                      href={item.href}
                      className="flex items-center gap-2 text-gray-300 hover:text-gold transition-colors"
                    >
                      <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                      {lang === 'fa' ? item.label : item.labelEn}
                    </a>
                  ))}
                </div>
              </div>

              {/* Locations & Hours */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-navy" />
                  </div>
                  <h4 className="font-bold text-lg">{t.locations}</h4>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇮🇷</span>
                    <span className="text-gray-300">{t.iran}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇦🇪</span>
                    <span className="text-gray-300">{t.uae}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                    <Clock className="w-5 h-5 text-gold" />
                    <span className="text-gray-300">{t.workingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex justify-center gap-4 mb-8">
              <a href="#" className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all">
                <MessageCircle className="w-6 h-6" />
              </a>
              <a href="#" className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all">
                <Send className="w-6 h-6" />
              </a>
            </div>

            {/* eNAMAD Badge */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-3xl">e</span>
                </div>
                <div>
                  <p className="text-navy font-bold">eNAMAD.ir</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-400 text-sm py-6 border-t border-gray-700">
              {t.copyright}
            </div>
          </div>
        </footer>
      </main>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gold via-gold-light to-gold p-4 z-40 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-navy text-sm font-bold mb-3">
            {t.responseHours}
          </p>
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-navy hover:bg-navy/90 text-white rounded-xl py-6 h-auto text-base font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Phone className="w-5 h-5 ml-2" />
              {t.getConsultation}
            </Button>
            <Button 
              className="flex-1 bg-black hover:bg-gray-900 text-white rounded-xl py-6 h-auto text-base font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Phone className="w-5 h-5 ml-2" />
              <span dir="ltr">۰۲۱-۸۶۱۹۴۳۱۶</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
