import {headers} from 'next/headers';
import {locales} from './index';

export async function requestLocale() {
  const headersList = await headers();
  const locale = headersList.get('X-NEXT-INTL-LOCALE') ?? locales[0];
  return locale;
}

