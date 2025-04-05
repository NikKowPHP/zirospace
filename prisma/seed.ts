import { PrismaClient } from '@prisma/client'
// import prisma from '../src/lib/prisma.ts'
const prisma = new PrismaClient()

async function main() {
  // Clear existing data if needed
  // await prisma.caseStudy.deleteMany({})
  
  // Seed YouTube data
  await prisma.youtubeModel.upsert({
    where: { id: '123413123' },
    update: {},
    create: {
      id: '123413123',
      youtube_url: 'N4b3apb88Mw',
      created_at: new Date('2025-03-18T08:24:25.308Z'),
      updated_at: new Date('2025-03-18T08:24:25.308Z')
    }
  })
  
  // Consolidated Case Study seeding with locale
  await prisma.caseStudy.upsert({
    where: { id: 'gsense-1737888575884' },
    update: {},
    create: {
      id: 'gsense-1737888575884',
      title: 'gSense',
      description: 'gSense is a health platform which focuses on personalized health monitoring. It integrates various health metrics and devices to assist in managing chronic diseases.',
      tags: ['Branding', 'Saas', 'HealthTech'],
      images: JSON.parse('[{"alt":"gSense branded bag","url":"https://i.postimg.cc/28Qzxxzc/dd.png"},{"alt":"gSense book","url":"https://i.postimg.cc/NjzTzPFk/001.jpg"},{"alt":"gSense Desk a4","url":"https://i.postimg.cc/4dTKCCgV/002-2.jpg"},{"alt":"gSense Desk a4 folded","url":"https://i.postimg.cc/BQN2xvGy/005.jpg"},{"alt":"gSense totebag","url":"https://i.postimg.cc/V6BJm7fT/006-2.jpg"},{"alt":"gSense business card","url":"https://i.postimg.cc/4466x52X/011.jpg"},{"alt":"gSense book upside down","url":"https://i.postimg.cc/9QMZ1jmf/012.jpg"},{"alt":"gSense envelope","url":"https://i.postimg.cc/Prfwrk8M/013-1.jpg"}]'),
      cta_text: 'View Case Study',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'http://ziro.agency/gsense-branding',
      created_at: new Date('2025-01-06T09:25:11.086Z'),
      updated_at: new Date('2025-01-06T09:25:11.086Z'),
      slug: 'gsense-branding',
      order_index: 0,
      locale: 'en'
    }
  })

  await prisma.caseStudy.upsert({
    where: { id: 'hyperfree-1737897644018' },
    update: {},
    create: {
      id: 'hyperfree-1737897644018',
      title: 'HyperFree',
      description: 'A platform offering personalized coaching and tools to manage prehypertension effectively.',
      tags: ['Website'],
      images: JSON.parse('[{"alt":"hf 01","url":"https://i.postimg.cc/3xwHPQmr/hf-01.png"},{"alt":"hf 02","url":"https://i.postimg.cc/jdtT47j7/hf-02.png"},{"alt":"hf 03","url":"https://i.postimg.cc/dt6YHV7S/hf-03.png"},{"alt":"hf 04","url":"https://i.postimg.cc/SQWq9rm4/hf-04.png"},{"alt":"hf 05","url":"https://i.postimg.cc/BnwG37BT/hf-05.png"}]'),
      cta_text: 'Visit Website',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://hyperfree.framer.website/',
      created_at: new Date('2025-01-26T13:20:44.372Z'),
      updated_at: new Date('2025-01-26T13:20:44.372Z'),
      slug: 'hyperfree',
      order_index: 2,
      locale: 'en'
    }
  })

  // IQUBX case study
  await prisma.caseStudy.upsert({
    where: { id: 'iqubx-1737298472661' },
    update: {},
    create: {
      id: 'iqubx-1737298472661',
      title: 'IQUBX',
      description: 'A redesigned website for Iqubx, a New Delhi leader in green building products. The project focused on enhancing user experience and showcasing eco-friendly offerings like aluminum ceiling trapdoors, featuring a responsive design and a dedicated sustainability section.',
      tags: ['Website', 'Visual Identity', 'Sustainability'],
      images: JSON.parse('[{"alt":"IQUBX website redesign showcasing baffle ceiling systems","url":"https://i.postimg.cc/bJPJPFNt/Mac-Book-Air-2022.png"}]'),
      cta_text: 'View Case Study',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://iqubx.framer.website/',
      created_at: new Date('2025-01-06T09:25:11.086Z'),
      updated_at: new Date('2025-01-06T09:25:11.086Z'),
      slug: 'iqubx-website-redesign',
      order_index: 3,
      locale: 'en'
    }
  })

  // PulsePoint case study
  await prisma.caseStudy.upsert({
    where: { id: 'pulsepoint-1739618540878' },
    update: {},
    create: {
      id: 'pulsepoint-1739618540878',
      title: 'PulsePoint',
      description: 'An app for nurses to find freelance jobs.',
      tags: ['Mobile Application', 'HealthTech'],
      images: JSON.parse('[{"alt":"pp 01","url":"https://i.postimg.cc/CMN8NbNy/PP-01.png"},{"alt":"pp 02","url":"https://i.postimg.cc/Pr5wFN3C/PP-2.png"},{"alt":"pp 03","url":"https://i.postimg.cc/dtNyMvp4/PP-3.png"},{"alt":"pp 04","url":"https://i.postimg.cc/JzyBMvWm/PP-4.png"},{"alt":"pp 05","url":"https://i.postimg.cc/Hkf8xzpM/PP-5.png"},{"alt":"pp 06","url":"https://i.postimg.cc/hGTz7mj5/PP-6.png"},{"alt":"pp 07","url":"https://i.postimg.cc/V6FJKcX9/PP-7.png"},{"alt":"pp 08","url":"https://i.postimg.cc/ZRm9PqvK/PP-8.png"},{"alt":"pp 09","url":"https://i.postimg.cc/j2dL9khp/PP-9.png"},{"alt":"pp 10","url":"https://i.postimg.cc/2ycVfFcV/PP-10.png"}]'),
      cta_text: 'Linkedin Post',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://www.linkedin.com/feed/update/urn:li:activity:7252461862322094082',
      created_at: new Date('2025-01-26T14:15:38.464Z'),
      updated_at: new Date('2025-01-26T14:15:38.464Z'),
      slug: 'pulsepoint',
      order_index: 4,
      locale: 'en'
    }
  })

  // Supernormal case study
  await prisma.caseStudy.upsert({
    where: { id: 'supernormal-1737369180424' },
    update: {},
    create: {
      id: 'supernormal-1737369180424',
      title: 'Supernormal',
      description: 'Supernormal is the innovative app for longevity athletes. Through the website potential users can find more information about the app\'s offerings.',
      tags: ['Website'],
      images: JSON.parse('[{"alt":"Supernormal Website","url":"https://i.postimg.cc/BQLWHrxT/L-Mockups-010.png"},{"alt":"Hero Image","url":"https://i.postimg.cc/VvXVH84p/a1.png"},{"alt":"About SuperNormal","url":"https://i.postimg.cc/50hr3058/a2.png"},{"alt":"Features Supernormal","url":"https://i.postimg.cc/26bJhvWz/a3.png"},{"alt":"User Testimonials","url":"https://i.postimg.cc/P5TB9Pg4/a4.png"},{"alt":"Call to action","url":"https://i.postimg.cc/XvDmrxpH/a5.png"},{"alt":"Closing Explanations","url":"https://i.postimg.cc/HkzfgTHC/a6.png"},{"alt":"Bottom Call to Action","url":"https://i.postimg.cc/Gpp636hT/a7.png"}]'),
      cta_text: 'Visit Website',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://ssupernnormal.framer.website/',
      created_at: new Date('2025-01-18T16:36:38.832Z'),
      updated_at: new Date('2025-01-18T16:36:38.832Z'),
      slug: 'supernormal-website',
      order_index: 1,
      locale: 'en'
    }
  })

  // SuperNormal App case study
  await prisma.caseStudy.upsert({
    where: { id: 'supernormal-app-1739785855786' },
    update: {},
    create: {
      id: 'supernormal-app-1739785855786',
      title: 'SuperNormal App',
      description: 'SuperNormal is an innovative app concept designed specifically for "Rejuvenation Athletes," individuals dedicated to slowing biological aging and enhancing their overall well-being. This project aims to integrate various features that support users in their journey toward longevity through a user-friendly interface and community engagement.',
      tags: ['Mobile Application', 'HealthTech'],
      images: JSON.parse('[{"alt":"SuperNormal app interface","url":"https://i.postimg.cc/0NLrbykh/Instagram-Post-04-15.png"},{"alt":"Supernormal name","url":"https://i.postimg.cc/VkJTpvmr/Instagram-Post-04-29.png"},{"alt":"Supernormal intended users","url":"https://i.postimg.cc/kgLZmCgj/Instagram-Post-04-31.png"},{"alt":"Supernormal leaderboard functionality","url":"https://i.postimg.cc/yx6pPYLN/Instagram-Post-04-32.png"},{"alt":"Supernormal user progress","url":"https://i.postimg.cc/NGbz0m02/Instagram-Post-04-33.png"},{"alt":"Supernormal health agent","url":"https://i.postimg.cc/pV7KkLG1/Instagram-Post-04-34.png"},{"alt":"Supernormal challenges and gamification","url":"https://i.postimg.cc/Yq9yL04n/Instagram-Post-04-35.png"},{"alt":"Supernormal awards and badges","url":"https://i.postimg.cc/gjfR0gLP/Instagram-Post-04-36.png"},{"alt":"Supernormal font and colors","url":"https://i.postimg.cc/Dy8ByNDR/Instagram-Post-04-37.png"}]'),
      cta_text: 'Read Case Study',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://www.nikhil.health/p/supernormal-a-longevity-app-concept',
      created_at: new Date('2025-01-06T09:25:11.086Z'),
      updated_at: new Date('2025-01-06T09:25:11.086Z'),
      slug: 'supernormal-app-design',
      order_index: 6,
      locale: 'en'
    }
  })

  // Wellness Way case study
  await prisma.caseStudy.upsert({
    where: { id: 'wellness-way-1739788499366' },
    update: {},
    create: {
      id: 'wellness-way-1739788499366',
      title: 'Wellness Way',
      description: 'A therapeutic app delivering personalized exercise activities.',
      tags: ['Mobile Application', 'HealthTech'],
      images: JSON.parse('[{"alt":"ww 01","url":"https://i.postimg.cc/90sx8FND/WW-02.png"},{"alt":"ww 02","url":"https://i.postimg.cc/d12ttLGY/WW-01.png"},{"alt":"ww o3","url":"https://i.postimg.cc/cH9k3cRM/WW-3.png"},{"alt":"ww 04","url":"https://i.postimg.cc/DfxBp5bq/WW-4.png"},{"alt":"ww 05","url":"https://i.postimg.cc/nLT381Pb/WW-5.png"},{"alt":"ww 06","url":"https://i.postimg.cc/y8TNHJXC/WW-6.png"},{"alt":"ww 07","url":"https://i.postimg.cc/8cG3NCmx/WW-7.png"},{"alt":"ww 07","url":"https://i.postimg.cc/C5HKxzT8/WW-8.png"}]'),
      cta_text: 'Linkedin Post',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://www.linkedin.com/feed/update/urn:li:activity:7265740651026137089',
      created_at: new Date('2025-01-26T12:17:16.309Z'),
      updated_at: new Date('2025-01-26T12:17:16.309Z'),
      slug: 'wellnessway',
      order_index: 5,
      locale: 'en'
    }
  })
  
  // ==========================================
  // Seed Case Studies PL from SQL dump
  // ==========================================
  
  // gSense PL case study
  await prisma.caseStudy.upsert({
    where: { id: 'gsense-1737894580192' },
    update: {},
    create: {
      id: 'gsense-1737894580192',
      title: 'gSense',
      description: 'gSense to platforma zdrowotna skupiająca się na spersonalizowanym monitorowaniu zdrowia. Integruje różne metryki i urządzenia zdrowotne, aby pomóc w zarządzaniu chorobami przewlekłymi.',
      tags: ['Branding', 'Saas', 'HealthTech'],
      images: JSON.parse('[{"alt":"Torba z marką gSense","url":"https://i.postimg.cc/28Qzxxzc/dd.png"},{"alt":"Książka gSense","url":"https://i.postimg.cc/NjzTzPFk/001.jpg"},{"alt":"Biurko gSense a4","url":"https://i.postimg.cc/4dTKCCgV/002-2.jpg"},{"alt":"gSense Desk a4 składany","url":"https://i.postimg.cc/BQN2xvGy/005.jpg"},{"alt":"gSense totebag","url":"https://i.postimg.cc/V6BJm7fT/006-2.jpg"},{"alt":"Wizytówka gSense","url":"https://i.postimg.cc/4466x52X/011.jpg"},{"alt":"Książka gSense do góry nogami","url":"https://i.postimg.cc/9QMZ1jmf/012.jpg"},{"alt":"Koperta gSense","url":"https://i.postimg.cc/Prfwrk8M/013-1.jpg"}]'),
      cta_text: 'Zobacz Case Study',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'http://ziro.agency/gsense-branding',
      created_at: new Date('2025-01-06T09:25:11.086Z'),
      updated_at: new Date('2025-01-06T09:25:11.086Z'),
      slug: 'gsense-branding',
      order_index: 0,
      locale: 'pl'
    }
  })
  
  // HyperFree PL case study
  await prisma.caseStudy.upsert({
    where: { id: 'hyperfree-1737897732178' },
    update: {},
    create: {
      id: 'hyperfree-1737897732178',
      title: 'HyperFree',
      description: 'Platforma oferująca spersonalizowany coaching i narzędzia do skutecznego zarządzania stanem przednadciśnieniowym.',
      tags: ['Strona internetowa'],
      images: JSON.parse('[{"alt":"hf 01","url":"https://i.postimg.cc/3xwHPQmr/hf-01.png"},{"alt":"hf 02","url":"https://i.postimg.cc/jdtT47j7/hf-02.png"},{"alt":"hf 03","url":"https://i.postimg.cc/dt6YHV7S/hf-03.png"},{"alt":"hf 04","url":"https://i.postimg.cc/SQWq9rm4/hf-04.png"},{"alt":"hf 05","url":"https://i.postimg.cc/BnwG37BT/hf-05.png"}]'),
      cta_text: 'Odwiedź stronę',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://hyperfree.framer.website/',
      created_at: new Date('2025-01-26T13:22:12.499Z'),
      updated_at: new Date('2025-01-26T13:22:12.499Z'),
      slug: 'hyperfree',
      order_index: 2,
      locale: 'pl'
    }
  })

  // IQUBX PL case study
  await prisma.caseStudy.upsert({
    where: { id: 'iqubx-1737898062843' },
    update: {},
    create: {
      id: 'iqubx-1737898062843',
      title: 'IQUBX',
      description: 'Przebudowana strona internetowa dla Iqubx, lidera produktów ekologicznych dla budownictwa z Nowego Delhi. Projekt skupił się na poprawie doświadczeń użytkownika i prezentacji przyjaznych dla środowiska ofert, takich jak aluminiowe klapy sufitowe, z responsywnym designem i dedykowaną sekcją zrównoważonego rozwoju.',
      tags: ['Strona internetowa', 'Identyfikacja wizualna', 'Zrównoważony rozwój'],
      images: JSON.parse('[{"alt":"Redesign strony IQUBX prezentujący systemy sufitowe baffle","url":"https://i.postimg.cc/bJPJPFNt/Mac-Book-Air-2022.png"}]'),
      cta_text: 'Zobacz Case Study',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://iqubx.framer.website/',
      created_at: new Date('2025-01-26T13:27:43.206Z'),
      updated_at: new Date('2025-01-26T13:27:43.206Z'),
      slug: 'iqubx-website-redesign',
      order_index: 3,
      locale: 'pl'
    }
  })

  // PulsePoint PL case study
  await prisma.caseStudy.upsert({
    where: { id: 'pulsepoint-1739618629647' },
    update: {},
    create: {
      id: 'pulsepoint-1739618629647',
      title: 'PulsePoint',
      description: 'Aplikacja dla pielęgniarek do znajdowania pracy na zlecenie.',
      tags: ['Aplikacja mobilna', 'HealthTech'],
      images: JSON.parse('[{"alt":"pp 01","url":"https://i.postimg.cc/CMN8NbNy/PP-01.png"},{"alt":"pp 02","url":"https://i.postimg.cc/Pr5wFN3C/PP-2.png"},{"alt":"pp 03","url":"https://i.postimg.cc/dtNyMvp4/PP-3.png"},{"alt":"pp 04","url":"https://i.postimg.cc/JzyBMvWm/PP-4.png"},{"alt":"pp 05","url":"https://i.postimg.cc/qR42ycsK/PP-5.png"},{"alt":"pp 06","url":"https://i.postimg.cc/wxQZTyVb/PP-6.png"},{"alt":"pp 07","url":"https://i.postimg.cc/MGZxLLnz/PP-7.png"},{"alt":"pp 08","url":"https://i.postimg.cc/ncxBR5SK/PP-8.png"}]'),
      cta_text: 'Post na LinkedIn',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://www.linkedin.com/feed/update/urn:li:activity:7252461862322094082',
      created_at: new Date('2025-01-26T14:17:09.914Z'),
      updated_at: new Date('2025-01-26T14:17:09.914Z'),
      slug: 'pulsepoint',
      order_index: 4,
      locale: 'pl'
    }
  })

  // Supernormal PL case study
  await prisma.caseStudy.upsert({
    where: { id: 'supernormal-1737369377519' },
    update: {},
    create: {
      id: 'supernormal-1737369377519',
      title: 'Supernormal',
      description: 'Supernormal to innowacyjna aplikacja dla sportowców długowieczności. Za pośrednictwem strony internetowej potencjalni użytkownicy mogą znaleźć więcej informacji o ofertach aplikacji.',
      tags: ['Strona internetowa'],
      images: JSON.parse('[{"alt":"Strona Supernormal","url":"https://i.postimg.cc/BQLWHrxT/L-Mockups-010.png"},{"alt":"Obraz bohatera","url":"https://i.postimg.cc/VvXVH84p/a1.png"},{"alt":"O SuperNormal","url":"https://i.postimg.cc/50hr3058/a2.png"},{"alt":"Funkcje Supernormal","url":"https://i.postimg.cc/26bJhvWz/a3.png"},{"alt":"Opinie użytkowników","url":"https://i.postimg.cc/P5TB9Pg4/a4.png"},{"alt":"Wezwanie do działania","url":"https://i.postimg.cc/XvDmrxpH/a5.png"},{"alt":"Zamknięcie wyjaśnień","url":"https://i.postimg.cc/HkzfgTHC/a6.png"},{"alt":"Dolne wezwanie do działania","url":"https://i.postimg.cc/Gpp636hT/a7.png"}]'),
      cta_text: 'Odwiedź stronę',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://ssupernnormal.framer.website/',
      created_at: new Date('2025-01-18T16:42:57.836Z'),
      updated_at: new Date('2025-01-18T16:42:57.836Z'),
      slug: 'supernormal-website',
      order_index: 1,
      locale: 'pl'
    }
  })

  // SuperNormal App PL case study
  await prisma.caseStudy.upsert({
    where: { id: 'supernormal-app-1739785943582' },
    update: {},
    create: {
      id: 'supernormal-app-1739785943582',
      title: 'Aplikacja SuperNormal',
      description: 'SuperNormal to innowacyjna koncepcja aplikacji zaprojektowana specjalnie dla "Sportowców Odmładzania", osób zaangażowanych w spowolnienie biologicznego starzenia się i poprawę ogólnego samopoczucia. Projekt ten ma na celu integrację różnych funkcji, które wspierają użytkowników w ich drodze do długowieczności poprzez przyjazny dla użytkownika interfejs i zaangażowanie społeczności.',
      tags: ['Aplikacja mobilna', 'HealthTech'],
      images: JSON.parse('[{"alt":"Interfejs aplikacji SuperNormal","url":"https://i.postimg.cc/0NLrbykh/Instagram-Post-04-15.png"},{"alt":"Nazwa Supernormal","url":"https://i.postimg.cc/VkJTpvmr/Instagram-Post-04-29.png"},{"alt":"Zamierzeni użytkownicy Supernormal","url":"https://i.postimg.cc/kgLZmCgj/Instagram-Post-04-31.png"},{"alt":"Funkcja tablicy wyników Supernormal","url":"https://i.postimg.cc/yx6pPYLN/Instagram-Post-04-32.png"},{"alt":"Postęp użytkownika Supernormal","url":"https://i.postimg.cc/NGbz0m02/Instagram-Post-04-33.png"},{"alt":"Agent zdrowia Supernormal","url":"https://i.postimg.cc/pV7KkLG1/Instagram-Post-04-34.png"},{"alt":"Wyzwania i gamifikacja Supernormal","url":"https://i.postimg.cc/Yq9yL04n/Instagram-Post-04-35.png"},{"alt":"Nagrody i odznaki Supernormal","url":"https://i.postimg.cc/gjfR0gLP/Instagram-Post-04-36.png"},{"alt":"Czcionka i kolory Supernormal","url":"https://i.postimg.cc/Dy8ByNDR/Instagram-Post-04-37.png"}]'),
      cta_text: 'Przeczytaj Case Study',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://www.nikhil.health/p/supernormal-a-longevity-app-concept',
      created_at: new Date('2025-01-06T09:25:11.086Z'),
      updated_at: new Date('2025-01-06T09:25:11.086Z'),
      slug: 'supernormal-app-design',
      order_index: 6,
      locale: 'pl'
    }
  })

  // Wellness Way PL case study
  await prisma.caseStudy.upsert({
    where: { id: 'wellness-way-1739788561262' },
    update: {},
    create: {
      id: 'wellness-way-1739788561262',
      title: 'Wellness Way',
      description: 'Aplikacja terapeutyczna dostarczająca spersonalizowane ćwiczenia.',
      tags: ['Aplikacja mobilna', 'HealthTech'],
      images: JSON.parse('[{"alt":"ww 01","url":"https://i.postimg.cc/90sx8FND/WW-02.png"},{"alt":"ww 02","url":"https://i.postimg.cc/d12ttLGY/WW-01.png"},{"alt":"ww o3","url":"https://i.postimg.cc/cH9k3cRM/WW-3.png"},{"alt":"ww 04","url":"https://i.postimg.cc/DfxBp5bq/WW-4.png"},{"alt":"ww 05","url":"https://i.postimg.cc/nLT381Pb/WW-5.png"},{"alt":"ww 06","url":"https://i.postimg.cc/y8TNHJXC/WW-6.png"},{"alt":"ww 07","url":"https://i.postimg.cc/8cG3NCmx/WW-7.png"},{"alt":"ww 07","url":"https://i.postimg.cc/C5HKxzT8/WW-8.png"}]'),
      cta_text: 'Post na LinkedIn',
      cta_text_name: 'caseStudy.ctaText.viewCaseStudy',
      cta_url: 'https://www.linkedin.com/feed/update/urn:li:activity:7265740651026137089',
      created_at: new Date('2025-01-26T12:18:18.005Z'),
      updated_at: new Date('2025-01-26T12:18:18.005Z'),
      slug: 'wellnessway',
      order_index: 5,
      locale: 'pl'
    }
  })
  
  // Add this after your case study seeds and before the final console.log
  await prisma.hero.upsert({
    where: { id: 'c84cebca-91e9-4d6a-afb0-02460a838c8e' },
    update: {},
    create: {
      id: 'c84cebca-91e9-4d6a-afb0-02460a838c8e',
      title: 'Pioneering Integrated Digital Health Solutions',
      subtitle: 'Designing User-Friendly Technology for Better Patient Experiences, from Apps to Devices',
      cta_primary_text: 'Book a Call',
      cta_primary_link: '/contact',
      cta_secondary_text: 'Learn More',
      cta_secondary_link: '#process',
      background: '',
      locale: 'en',
      created_at: new Date('2025-03-30T07:43:41.645Z'),
      updated_at: new Date('2025-03-30T07:43:41.645Z')
    }
  });
  
  console.log('Database has been seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
