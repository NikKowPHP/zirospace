import React from 'react';
import styles from './card-skeleton.module.css';

const CardSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.image}></div>
      <div className={styles.content}>
        <div className={styles.title}></div>
        <div className={styles.description}></div>
      </div>
    </div>
  );
};

export default CardSkeleton;