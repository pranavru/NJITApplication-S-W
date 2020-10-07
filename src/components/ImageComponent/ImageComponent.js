import React from 'react'
import { baseUrl } from '../../shared/baseUrl';
import { noImage } from '../../shared/noImage';


export default function ImageComponent({ src, alt, classes, styles, callBackFunc, idTag }) {
  const [error, setErrorValue] = React.useState(false);
  console.log({ src, alt, classes, error })
  const functionalities = { className: classes, style: styles, onClick: callBackFunc, id: idTag }
  return (
    <div>
      {error ? <img src={baseUrl + noImage} alt="No Image Found" {...functionalities} /> :
        <img src={src} onError={() => setErrorValue(true)} alt={alt} {...functionalities} />}
    </div>
  )
};
