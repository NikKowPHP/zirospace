import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from './global-progress-bar.module.css';

const GlobalProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      setProgress(40);
    };
    const handleComplete = () => {
      setIsLoading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 400);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <div
      className={styles.progressBar}
      style={{ width: `${progress}%`, display: isLoading || progress > 0 ? 'block' : 'none' }}
    />
  );
};

export default GlobalProgressBar;