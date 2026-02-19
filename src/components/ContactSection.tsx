import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageCircle, Send, CheckCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SiteContent } from '@/lib/content';

const schema = z.object({
  name: z.string().min(2, { message: 'نام باید حداقل ۲ کاراکتر باشد / Name must be at least 2 characters' }),
  phone: z.string().min(8, { message: 'شماره تماس معتبر نیست / Invalid phone number' }),
  service: z.enum(['pregnancy', 'newborn', 'child', 'family', 'other']),
  message: z.string().min(5, { message: 'پیام باید حداقل ۵ کاراکتر باشد / Message too short' }),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  content: SiteContent;
  lang: 'fa' | 'en';
}

const serviceLabels = {
  fa: {
    pregnancy: 'عکاسی بارداری',
    newborn: 'عکاسی نوزادی',
    child: 'عکاسی کودک',
    family: 'عکاسی خانوادگی',
    other: 'سایر',
  },
  en: {
    pregnancy: 'Pregnancy Photography',
    newborn: 'Newborn Photography',
    child: 'Child Photography',
    family: 'Family Photography',
    other: 'Other',
  },
};

export function ContactSection({ content, lang }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const isRTL = lang === 'fa';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { service: 'newborn' },
  });

  const onSubmit = (data: FormValues) => {
    const serviceLabel = serviceLabels[lang][data.service];
    const msgText = lang === 'fa'
      ? `سلام، من ${data.name} هستم.\nشماره تماس: ${data.phone}\nنوع عکاسی: ${serviceLabel}\n\n${data.message}`
      : `Hello, I'm ${data.name}.\nPhone: ${data.phone}\nService: ${serviceLabel}\n\n${data.message}`;

    const waNumber = content.contact.whatsapp.replace(/\D/g, '');
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msgText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const handleTelegramContact = () => {
    if (content.contact.telegram) {
      window.open(content.contact.telegram, '_blank', 'noopener,noreferrer');
    }
  };

  const t = {
    fa: {
      title: 'ارتباط با ما',
      subtitle: 'برای رزرو وقت یا دریافت اطلاعات بیشتر با ما در تماس باشید',
      name: 'نام و نام خانوادگی',
      phone: 'شماره تماس',
      service: 'نوع عکاسی',
      message: 'پیام شما',
      messagePlaceholder: 'توضیحات بیشتر درباره جلسه عکاسی مورد نظرتان...',
      submit: 'ارسال از طریق واتساپ',
      telegram: 'ارتباط از طریق تلگرام',
      successTitle: 'پیام شما آماده شد!',
      successText: 'صفحه واتساپ باز شد. پیام را ارسال کنید تا در اسرع وقت پاسخ دهیم.',
      sendAnother: 'ارسال پیام دیگر',
      contactInfo: 'اطلاعات تماس',
    },
    en: {
      title: 'Contact Us',
      subtitle: 'Reach out to book a session or get more information',
      name: 'Full Name',
      phone: 'Phone Number',
      service: 'Photography Type',
      message: 'Your Message',
      messagePlaceholder: 'Tell us more about the session you have in mind...',
      submit: 'Send via WhatsApp',
      telegram: 'Contact via Telegram',
      successTitle: 'Message Ready!',
      successText: 'WhatsApp has opened. Send the message and we\'ll reply as soon as possible.',
      sendAnother: 'Send Another Message',
      contactInfo: 'Contact Information',
    },
  }[lang];

  return (
    <section id="contact-form" className="px-4 py-12 bg-gradient-to-b from-cream to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{t.title}</h2>
          <p className="text-gray-500 text-sm md:text-base">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info Panel */}
          <div className="md:col-span-2 bg-navy rounded-[2rem] p-8 text-white flex flex-col gap-6">
            <h3 className="font-bold text-lg text-gold">{t.contactInfo}</h3>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <p className="text-gray-300 text-sm leading-relaxed">
                {lang === 'fa' ? content.contact.addressFa : content.contact.addressEn}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold flex-shrink-0" />
              <a
                href={`mailto:${content.contact.email}`}
                className="text-gray-300 text-sm hover:text-gold transition-colors"
              >
                {content.contact.email}
              </a>
            </div>

            <div className="space-y-2">
              {content.contact.phones.map((phone) => (
                <div key={phone} className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-gray-300 text-sm" dir="ltr">{phone}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gold flex-shrink-0" />
              <span className="text-gray-300 text-sm">
                {lang === 'fa' ? content.contact.hoursFa : content.contact.hoursEn}
              </span>
            </div>

            {/* Quick contact buttons */}
            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-700">
              <a
                href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <button
                onClick={handleTelegramContact}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                Telegram
              </button>
            </div>
          </div>

          {/* Form Panel */}
          <div className="md:col-span-3 bg-white rounded-[2rem] p-8 shadow-card">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-navy">{t.successTitle}</h3>
                <p className="text-gray-500 text-sm max-w-sm">{t.successText}</p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="mt-4 border-2 border-gold text-navy hover:bg-gold-light rounded-xl px-6"
                >
                  {t.sendAnother}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">{t.name}</label>
                  <input
                    {...register('name')}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder={lang === 'fa' ? 'مثال: علی رضایی' : 'e.g. John Smith'}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">{t.phone}</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    dir="ltr"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="09XX-XXXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">{t.service}</label>
                  <select
                    {...register('service')}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white transition-all"
                  >
                    {(Object.keys(serviceLabels[lang]) as Array<keyof typeof serviceLabels['fa']>).map((key) => (
                      <option key={key} value={key}>
                        {serviceLabels[lang][key]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">{t.message}</label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                    placeholder={t.messagePlaceholder}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-6 h-auto rounded-xl font-bold text-sm shadow-lg transition-all"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t.submit}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleTelegramContact}
                    variant="outline"
                    className="flex-1 border-2 border-blue-400 text-blue-500 hover:bg-blue-50 py-6 h-auto rounded-xl font-bold text-sm transition-all"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {t.telegram}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
