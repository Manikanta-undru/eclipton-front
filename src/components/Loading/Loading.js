import React from 'react';
import Spinner from '../Spinner';

function Loading() {
  const styles = {
    'loading-widget': {
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      background: '#fff',
      'border-radius': '0.3rem',
      padding: '10px',
    },
    span: {
      'font-size': '16px',
      'font-weight': '500',
      color: '#5832E0',
      display: 'block',
      'margin-inline': '10px',
    },
    spinner: {
      width: '30px',
      height: '30px',
    },
  };
  return (
    <div style={styles['loading-widget']}>
      <Spinner style={styles.spinner} />
      <span style={styles.span}>Loading...</span>
    </div>
  );
}

export default Loading;
