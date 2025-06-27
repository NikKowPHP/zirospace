import React from 'react'

import styles from './page-loader.module.css'

const PageLoader = () => {
  return (
    <div className={styles.spinner} aria-busy="true" aria-label="Loading">
      <div className={styles.bounce1}></div>
      <div className={styles.bounce2}></div>
      <div className={styles.bounce3}></div>
    </div>
  )
}

export default PageLoader
