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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Updates</h1>
      <div className="mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => setActiveLocale('en')}>EN</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setActiveLocale('pl')}>PL</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <UpdateList updates={updates[activeLocale] || []} locale={activeLocale} />
    </div>
  );
};

export default AdminUpdatesPage;