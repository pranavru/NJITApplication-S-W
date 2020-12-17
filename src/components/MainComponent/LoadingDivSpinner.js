import React from 'react';
import { Spinner } from 'reactstrap';

export const LoadingDivSpinner = () => {
  const styles = {
    loadingDiv: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: window.innerHeight * 0.9
    },
    spinnerDiv: {
      width: '3rem',
      height: '3rem'
    }
  };
  return <div style={styles.loadingDiv}>
    <Spinner style={styles.spinnerDiv} />
  </div>;
}
