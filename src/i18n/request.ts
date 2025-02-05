import {getRequestConfig} from 'next-intl/server';
import {requestLocale} from './request-locale';
 
export default getRequestConfig(async () => {
  const locale = await requestLocale();
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Warsaw',
    now: new Date()
  };
});

