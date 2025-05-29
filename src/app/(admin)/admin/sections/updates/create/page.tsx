'use client';

import { useState } from 'react';
import { Locale } from '@/i18n';
import { useAdminUpdates } from '@/hooks/admin/useAdminUpdates';
import UpdateForm from '../components/update-form';
import { useRouter } from 'next/navigation';

const CreateUpdatePage = () => {
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const { createUpdate, loading } = useAdminUpdates();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createUpdate(data, activeLocale);
    router.push('/admin/sections/updates');
  };

  const handleCancel = () => {
    router.push('/admin/sections/updates');
  };

  return (
    <div>
      <h1>Create New Update</h1>
      <div>
        <button onClick={() => setActiveLocale('en')}>EN</button>
        <button onClick={() => setActiveLocale('pl')}>PL</button>
      </div>
      <UpdateForm  onSubmit={handleSubmit} onCancel={handleCancel} loading={loading} />
    </div>
  );
};

export default CreateUpdatePage;