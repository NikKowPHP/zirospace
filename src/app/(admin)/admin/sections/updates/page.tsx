'use client';

import { Locale } from '@/i18n';
import { useAdminUpdates } from '@/hooks/admin/useAdminUpdates';
import UpdateList from './update-list';
import { useEffect, useState } from 'react';

const AdminUpdatesPage = () => {
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const { updates, loading, error, fetchUpdates } = useAdminUpdates();

  useEffect(() => {
    fetchUpdates(activeLocale);
  }, [fetchUpdates, activeLocale]);

  return (
    <div>
      <h1>Updates</h1>
      <div>
        <button onClick={() => setActiveLocale('en')}>EN</button>
        <button onClick={() => setActiveLocale('pl')}>PL</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <UpdateList updates={updates[activeLocale] || []} locale={activeLocale} />
    </div>
  );
};

export default AdminUpdatesPage;