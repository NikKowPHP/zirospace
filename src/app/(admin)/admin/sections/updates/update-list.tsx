'use client';

import { Locale } from '@/i18n';
import { Update } from '@/domain/models/update.model';
import Link from 'next/link';

interface UpdateListProps {
  updates: Update[];
  locale: Locale;
}

const UpdateList: React.FC<UpdateListProps> = ({ updates, locale }) => {
  return (
    <div>
      <h2>{locale.toUpperCase()} Updates</h2>
      <Link href="/admin/sections/updates/create">Add Update</Link>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Publish Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {updates.map((update) => (
            <tr key={update.id}>
              <td>{update.title}</td>
              <td>{update.slug}</td>
              <td>{update.publish_date.toLocaleDateString()}</td>
              <td>{update.is_published ? 'Published' : 'Draft'}</td>
              <td>
                <Link href={`/admin/sections/updates/edit/${update.id}`}>Edit</Link>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateList;