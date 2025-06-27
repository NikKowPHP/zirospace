import React from 'react';
import styles from './list-item-skeleton.module.css';

const ListItemSkeleton = () => {
  return (
    <div className={styles.listItem} aria-label="Loading">
      <div className={styles.image}></div>
      <div className={styles.content}>
        <div className={styles.title}></div>
        <div className={styles.description}></div>
      </div>
    </div>
  );
};

export default ListItemSkeleton;