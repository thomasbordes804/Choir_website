'use client';

import { useState } from 'react';

/**
 * "La correspondance" (option 1a) — the contact form as a letter on the
 * writing desk: "Cher Michel," salutation, quill-underlined fields, ruled
 * paper for the message, a treble-clef stamp, and an "Envoyer la lettre"
 * button. Direct channels (email / WhatsApp / Facebook) sit alongside as
 * wax-seal cards.
 *
 * Submission keeps the existing mailto: behavior — swap `handleSubmit` for
 * an API route whenever you add one.
 */

const CONTACT_EMAIL = 'contact@example.com';
const WHATSAPP_URL = 'https://wa.me/33123456789';
const FACEBOOK_URL = 'https://www.facebook.com/yourpage';

const fieldLabel =
  'block text-[9.5px] uppercase tracking-[0.18em] text-zinc-400 mb-1.5';
const fieldInput =
  'w-full bg-transparent border-0 border-b border-[#cbbfae] px-0.5 py-1.5 font-[family-name:var(--font-playfair)] text-[15px] text-zinc-700 outline-none transition-colors duration-300 focus:border-[#8d1e11] placeholder:text-zinc-400/70';

export function LetterForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(String(data.get('subject') ?? ''));
    const body = encodeURIComponent(
      `${data.get('message') ?? ''}\n\n— ${data.get('name') ?? ''} (${data.get('email') ?? ''})`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="flex flex-wrap items-start justify-center gap-9">
      {/* ============ THE LETTER ============ */}
      <form
        onSubmit={handleSubmit}
        className="relative min-w-[300px] max-w-[560px] flex-[1.3] border border-[#e8ded4] bg-[#fcf8f4] px-7 py-9 sm:px-10"
        style={{
          boxShadow: '0 24px 48px -24px rgba(24,24,27,.35)',
          transform: 'rotate(-.5deg)',
        }}
      >
        {/* stamp */}
        <div
          aria-hidden="true"
          className="absolute right-5 top-4 h-16 w-[54px] border border-[#e0d5c8] bg-white p-[5px]"
          style={{ transform: 'rotate(2.5deg)', boxShadow: '0 4px 10px -4px rgba(0,0,0,.25)' }}
        >
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8d1e11, #a8433a)' }}
          >
            <span className="text-[22px] text-[#f6e9c8]" style={{ fontFamily: 'Georgia, serif' }}>
              𝄞
            </span>
          </div>
        </div>

        <div className="mb-6 font-[family-name:var(--font-playfair)] text-[15px] italic text-zinc-500">
          Cher Michel,
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-4">
            <label className="min-w-[150px] flex-1">
              <span className={fieldLabel}>Votre nom</span>
              <input type="text" name="name" required placeholder="Jeanne Moreau" className={fieldInput} />
            </label>
            <label className="min-w-[170px] flex-[1.2]">
              <span className={fieldLabel}>Votre email</span>
              <input type="email" name="email" required placeholder="jeanne@exemple.fr" className={fieldInput} />
            </label>
          </div>
          <label>
            <span className={fieldLabel}>Sujet</span>
            <input type="text" name="subject" required placeholder="À propos d'un concert…" className={fieldInput} />
          </label>
          <label>
            <span className={fieldLabel}>Votre message</span>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="J'ai assisté au concert de juin et je souhaiterais…"
              className="w-full resize-none border-0 bg-transparent px-0.5 py-1 font-[family-name:var(--font-playfair)] text-[15px] leading-[2.07] text-zinc-600 outline-none placeholder:text-zinc-400/70"
              style={{
                background:
                  'repeating-linear-gradient(180deg, transparent, transparent 30px, #ddd2c2 30px, #ddd2c2 31px)',
              }}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <span className="font-[family-name:var(--font-playfair)] text-[13px] italic text-zinc-400">
            {sent ? 'votre messagerie s’est ouverte — merci !' : '— cachet de l’atelier'}
          </span>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-[11.5px] uppercase tracking-[0.14em] text-[#f7f3ec] transition-transform duration-300 hover:scale-[1.03]"
          >
            Envoyer la lettre
            <svg viewBox="0 0 16 12" width="15" height="11" aria-hidden="true">
              <path
                d="M1 6 H14 M10 1.5 L14.5 6 L10 10.5"
                fill="none"
                stroke="#e8c99b"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* ============ WAX-SEAL DIRECT CHANNELS ============ */}
      <div className="flex min-w-[250px] max-w-[320px] flex-[0.7] flex-col gap-3.5 pt-2">
        <div className="mb-0.5 font-[family-name:var(--font-playfair)] text-sm italic text-zinc-500">
          …ou plus directement :
        </div>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="flex items-center gap-3.5 rounded border border-[#e8ded4] bg-[#fcf8f4] px-4 py-3 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8d1e11]"
        >
          <span
            className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 28%, #a8433a, #8d1e11 75%)',
              boxShadow: '0 5px 12px -5px rgba(141,30,17,.6)',
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f6e9c8" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <span>
            <span className="block font-[family-name:var(--font-playfair)] text-[15px] text-zinc-900">Par email</span>
            <span className="mt-px block text-[11px] text-zinc-400">réponse sous 2 jours</span>
          </span>
        </a>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 rounded border border-[#e8ded4] bg-[#fcf8f4] px-4 py-3 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-[#64884f]"
        >
          <span
            className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 28%, #8fae78, #64884f 75%)',
              boxShadow: '0 5px 12px -5px rgba(100,136,79,.6)',
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#f2f6ec">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </span>
          <span>
            <span className="block font-[family-name:var(--font-playfair)] text-[15px] text-zinc-900">WhatsApp</span>
            <span className="mt-px block text-[11px] text-zinc-400">message rapide</span>
          </span>
        </a>

        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 rounded border border-[#e8ded4] bg-[#fcf8f4] px-4 py-3 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-[#636098]"
        >
          <span
            className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 28%, #8b89c0, #636098 75%)',
              boxShadow: '0 5px 12px -5px rgba(99,96,152,.6)',
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#ecebf6">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </span>
          <span>
            <span className="block font-[family-name:var(--font-playfair)] text-[15px] text-zinc-900">Facebook</span>
            <span className="mt-px block text-[11px] text-zinc-400">suivre l&apos;actualité</span>
          </span>
        </a>
      </div>
    </div>
  );
}
