-- Populate English case studies
INSERT INTO case_studies_en (id, slug, title, description, tags, images, cta_text, cta_text_name, cta_url) 
VALUES 
(
  'gsense',
  'gsense',
  'gSense',
  'gSense is a health platform which focuses on personalized health monitoring. It integrates various health metrics and devices to assist in managing chronic diseases.',
  ARRAY['Branding', 'Saas', 'HealthTech'],
  '[{"url": "/images/case-studies/gsense/gsense.avif", "alt": "gSense branded bag"}]',
  'View Case Study',
  'caseStudy.ctaText.viewCaseStudy',
  '#'
),
(
  'supernormal',
  'supernormal',
  'SuperNormal',
  'SuperNormal is an innovative app concept designed specifically for "Rejuvenation Athletes," individuals dedicated to slowing biological aging and enhancing their overall well-being. This project aims to integrate various features that support users in their journey toward longevity through a user-friendly interface and community engagement.',
  ARRAY['Mobile Application', 'HealthTech'],
  '[{"url": "/images/case-studies/supernormal/supernormal.avif", "alt": "SuperNormal app interface"}]',
  'View Case Study',
  'caseStudy.ctaText.viewCaseStudy',
  'https://www.nikhil.health/p/supernormal-a-longevity-app-concept'
),
(
  'iqubx',
  'iqubx',
  'IQUBX',
  'A redesigned website for Iqubx, a New Delhi leader in green building products. The project focused on enhancing user experience and showcasing eco-friendly offerings like aluminum ceiling trapdoors, featuring a responsive design and a dedicated sustainability section.',
  ARRAY['Website', 'Visual Identity', 'Sustainability'],
  '[{"url": "/images/case-studies/iqubx/iqubx.avif", "alt": "IQUBX website redesign showcasing baffle ceiling systems"}]',
  'View Case Study',
  'caseStudy.ctaText.viewCaseStudy',
  'https://iqubx.framer.website/'
);

-- Populate Polish case studies with matching slugs
INSERT INTO case_studies_pl (id, slug, title, description, tags, images, cta_text, cta_text_name, cta_url) 
VALUES 
(
  'gsense',
  'gsense',
  'gSense',
  'gSense to platforma zdrowotna skupiająca się na spersonalizowanym monitorowaniu zdrowia. Integruje różne metryki i urządzenia zdrowotne, aby pomóc w zarządzaniu chorobami przewlekłymi.',
  ARRAY['Branding', 'Saas', 'HealthTech'],
  '[{"url": "/images/case-studies/gsense/gsense.avif", "alt": "Torba z marką gSense"}]',
  'Zobacz Case Study',
  'caseStudy.ctaText.viewCaseStudy',
  '#'
),
(
  'supernormal',
  'supernormal',
  'SuperNormal',
  'SuperNormal to innowacyjna koncepcja aplikacji zaprojektowana specjalnie dla "Atletów Odmładzania" - osób zaangażowanych w spowolnienie procesu starzenia biologicznego i poprawę ogólnego samopoczucia. Projekt ma na celu integrację różnych funkcji wspierających użytkowników w ich drodze do długowieczności poprzez przyjazny interfejs i zaangażowanie społeczności.',
  ARRAY['Aplikacja Mobilna', 'HealthTech'],
  '[{"url": "/images/case-studies/supernormal/supernormal.avif", "alt": "Interfejs aplikacji SuperNormal"}]',
  'Zobacz Case Study',
  'caseStudy.ctaText.viewCaseStudy',
  'https://www.nikhil.health/p/supernormal-a-longevity-app-concept'
),
(
  'iqubx',
  'iqubx',
  'IQUBX',
  'Przeprojektowana strona internetowa dla Iqubx, lidera w Delhi w dziedzinie ekologicznych produktów budowlanych. Projekt skupił się na poprawie doświadczenia użytkownika i prezentacji przyjaznych dla środowiska produktów, takich jak aluminiowe klapy sufitowe, z responsywnym designem i dedykowaną sekcją zrównoważonego rozwoju.',
  ARRAY['Strona Internetowa', 'Tożsamość Wizualna', 'Zrównoważony Rozwój'],
  '[{"url": "/images/case-studies/iqubx/iqubx.avif", "alt": "Redesign strony IQUBX prezentujący systemy sufitowe"}]',
  'Zobacz Case Study',
  'caseStudy.ctaText.viewCaseStudy',
  'https://iqubx.framer.website/'
); 