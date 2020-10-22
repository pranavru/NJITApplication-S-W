import React from 'react';
import { Spinner } from 'reactstrap';

export const LoadingDivSpinner = () => {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: window.innerHeight * 0.9 }}>
    <Spinner style={{ width: '3rem', height: '3rem' }} />
  </div>;
}
