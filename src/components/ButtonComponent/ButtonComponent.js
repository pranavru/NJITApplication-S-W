import React from 'react';
import { Button, CardText } from 'reactstrap'

import '../ButtonComponent/ButtonComponent.css';

const buttonContainer = {
  position: "absolute",
  font: "0.9em monospace",
  backgroundColor: "#2C4870",
  color: "#ffffff",
};

export const ButtonComponent = (props) => {

  const parameters = {
    type: props.type,
    value: props.name,
    onClick: props.callBackFunc,
    className: props.class,
    style: buttonContainer
  };
  const buttonLabel = <CardText>{props.name}</CardText>;
  
  return <Button {...parameters}>{buttonLabel}</Button>;
};