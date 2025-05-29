'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/i18n';
import { useAdminUpdates } from '@/hooks/admin/useAdminUpdates';
import UpdateForm from '../../components/update-form';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Update } from '@/domain/models/update.model';

const EditUpdatePage = () => {
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const { getUpdateById, updateUpdate, loading, fetchUpdates } = useAdminUpdates();
  const [update, setUpdate] = useState<Update | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const updateId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchUpdate = async () => {
      if (updateId) {
        const updateData = await getUpdateById(updateId, activeLocale);
        setUpdate(updateData || null);
      }
    };

    if (updateId && activeLocale) {
      fetchUpdates(activeLocale); // Ensure updates are fetched for the active locale
      fetchUpdate();
    }
  }, [getUpdateById, updateId, activeLocale]);

  const handleSubmit = async (data: any) => {
    if (updateId) {
      await updateUpdate(updateId, data, activeLocale);
      router.push('/admin/sections/updates');
    }
  };

  const handleCancel = () => {
    router.push('/admin/sections/updates');
  };

  if (!update) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Update</h1>
      <div>
        <button onClick={() => setActiveLocale('en')}>EN</button>
        <button onClick={() => setActiveLocale('pl')}>PL</button>
      </div>
      <UpdateForm update={update}  onSubmit={handleSubmit} onCancel={handleCancel} loading={loading} />
    </div>
  );
};

export default EditUpdatePage;