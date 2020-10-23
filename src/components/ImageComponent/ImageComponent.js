import React from 'react'
import { noImage } from '../../shared/noImage';


export default function ImageComponent({ src, alt, classes, styles, callBackFunc, idTag }) {
  const { REACT_APP_BASE_URL } = process.env;
  const [error, setErrorValue] = React.useState(false);
  const functionalities = { className: classes, style: styles, onClick: callBackFunc, id: idTag }
  return (
    <div>
      {error ? <img src={REACT_APP_BASE_URL + noImage} alt="Not Found" {...functionalities} /> :
        <img src={src} onError={() => setErrorValue(true)} alt={alt} {...functionalities} />}
    </div>
  )
};
