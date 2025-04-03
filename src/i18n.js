import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar archivos de traducción directamente desde src/locales
import es from './locales/es.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

// Crear el objeto de recursos manualmente
const resources = {
  es: {
    translation: es
  },
  en: {
    translation: en
  },
  fr: {
    translation: fr
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: true,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: true
    }
  });

// Verificar la configuración después de la inicialización
console.log('Idioma actual después de inicializar:', i18n.language);
console.log('Recursos cargados:', i18n.options.resources);

// Reiniciar i18n
i18n.reloadResources(['es', 'en', 'fr']).then(() => {
  console.log('Recursos recargados');
  console.log('Traducción de home en español:', i18n.getFixedT('es')('home'));
  console.log('Traducción de home en inglés:', i18n.getFixedT('en')('home'));
  console.log('Traducción de home en francés:', i18n.getFixedT('fr')('home'));
});

export default i18n; 