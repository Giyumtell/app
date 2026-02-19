export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title?: string;
}

export interface BlogPost {
  id: number;
  image: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
}

export interface SiteContent {
  hero: {
    image: string;
  };
  gallery: {
    pregnancy: GalleryImage[];
    newborn: GalleryImage[];
    child: GalleryImage[];
    family: GalleryImage[];
  };
  blog: BlogPost[];
  contact: {
    phones: string[];
    whatsapp: string;
    email: string;
    addressFa: string;
    addressEn: string;
    hoursFa: string;
    hoursEn: string;
    instagram: string;
    telegram: string;
  };
  about: {
    textFa: string;
    textEn: string;
  };
}

const DEFAULT_CONTENT: SiteContent = {
  hero: {
    image: '/images/hero-baby.jpg',
  },
  gallery: {
    pregnancy: [
      { id: 1, src: '/images/pregnancy-1.jpg', alt: 'Pregnancy Photography', title: 'Maternity Portrait' },
      { id: 2, src: '/images/pregnancy-2.jpg', alt: 'Pregnancy Photography', title: 'Elegant Maternity' },
    ],
    newborn: [
      { id: 1, src: '/images/newborn-1.jpg', alt: 'Newborn Photography', title: 'Christmas Newborn' },
      { id: 2, src: '/images/newborn-2.jpg', alt: 'Newborn Photography', title: 'Winter Wonderland' },
    ],
    child: [
      { id: 1, src: '/images/child-1.jpg', alt: 'Child Photography', title: 'Birthday Celebration' },
      { id: 2, src: '/images/child-2.jpg', alt: 'Child Photography', title: 'Outdoor Portrait' },
    ],
    family: [
      { id: 1, src: '/images/family-1.jpg', alt: 'Family Photography', title: 'Family Christmas' },
      { id: 2, src: '/images/family-2.jpg', alt: 'Family Photography', title: 'Elegant Family' },
    ],
  },
  blog: [
    {
      id: 1,
      image: '/images/blog-1.jpg',
      title: 'لباس عکاسی نوزاد | راهنمای کامل انتخاب',
      titleEn: 'Newborn Photography Outfit | Complete Selection Guide',
      description: 'راهنمای کامل انتخاب لباس مناسب برای عکس نوزاد در آتلیه',
      descriptionEn: 'Complete guide for choosing the right outfit for newborn studio photography',
      date: '۱۴۰۳/۱۱/۱۵',
    },
    {
      id: 2,
      image: '/images/blog-2.jpg',
      title: 'عکس خانوادگی مانندکار',
      titleEn: 'Family Portrait Like a Pro',
      description: 'چگونه یک عکس خانوادگی مانندکار خلق کنیم؟',
      descriptionEn: 'How to create a professional-looking family portrait?',
      date: '۱۴۰۳/۱۱/۱۰',
    },
    {
      id: 3,
      image: '/images/blog-3.jpg',
      title: 'آماده سازی برای عکاسی نوزاد',
      titleEn: 'Preparing for Newborn Photography',
      description: 'راهنمای کامل والدین برای یک جلسه عکاسی ایده‌آل',
      descriptionEn: 'Complete parent guide for an ideal photography session',
      date: '۱۴۰۳/۱۱/۰۵',
    },
    {
      id: 4,
      image: '/images/blog-4.jpg',
      title: 'ایده عکس خانوادگی | ایده‌های خلاقانه',
      titleEn: 'Family Photo Ideas | Creative Concepts',
      description: 'ایده‌های خلاقانه عکس‌های خانوادگی در آتلیه',
      descriptionEn: 'Creative family photo ideas for studio sessions',
      date: '۱۴۰۳/۱۰/۲۸',
    },
  ],
  contact: {
    phones: ['۰۲۱-۸۶۱۹۴۳۱۶', '۰۲۱-۸۶۱۹۴۳۳۳', '۰۹۳۰-۴۸۵۸۵۸۵'],
    whatsapp: '989304858585',
    email: 'info@baharfilmstudio.com',
    addressFa: 'تهران - یوسف‌آباد - خیابان اسدآبادی - بین کوچه ۶۳ و ۶۵ - پلاک ۴۸۵ - طبقه ۹ - واحد ۹۵',
    addressEn: 'Tehran - Yousefabad - Asadabadi St - Between Alleys 63 & 65 - No 485 - 9th Floor - Unit 95',
    hoursFa: 'شنبه تا پنج‌شنبه ۱۰ الی ۱۸',
    hoursEn: 'Saturday to Thursday 10 AM - 6 PM',
    instagram: 'https://instagram.com/baharfilm',
    telegram: 'https://t.me/baharfilm',
  },
  about: {
    textFa: 'ما آتلیه تخصصی نوزاد و کودک بهارفیلم را تأسیس کردیم که سال ۹۳ زندگی حرفه‌ای ما با یک دوربین و عشقی بزرگ آغاز شد. در بهارفیلم، ما باور داریم که هر کودک داستانی منحصر به فرد دارد و ما مفتخریم که روایت‌گر این داستان‌ها هستیم. ما اینجا هستیم تا هر لحظه از زندگی کوچک شما را ثبت کنیم. از لبخندهای اولیه تا قدم‌های اول، ما اینجا هستیم تا زیباترین لحظات را برای شما ثبت کنیم.',
    textEn: "We established BaharFilm Specialized Newborn & Child Studio in 2014. At BaharFilm, we believe every child has a unique story, and we are proud to be the storytellers. We are here to capture every moment of your little one's life. From first smiles to first steps, we are here to capture your most beautiful moments.",
  },
};

const STORAGE_KEY = 'baharfilm_content';

export function loadContent(): SiteContent {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SiteContent>;
      return {
        hero: { ...DEFAULT_CONTENT.hero, ...parsed.hero },
        gallery: { ...DEFAULT_CONTENT.gallery, ...parsed.gallery },
        blog: parsed.blog ?? DEFAULT_CONTENT.blog,
        contact: { ...DEFAULT_CONTENT.contact, ...parsed.contact },
        about: { ...DEFAULT_CONTENT.about, ...parsed.about },
      };
    }
  } catch {
    // ignore corrupt storage
  }
  return DEFAULT_CONTENT;
}

export function saveContent(content: SiteContent): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function resetContent(): void {
  localStorage.removeItem(STORAGE_KEY);
}
