import React from 'react';
import { history } from '../store';

function A(props) {
  const open = (href) => {
    if (href == 'goBack') {
      history.goBack();
    } else if (props.target == '_BLANK' || props.target == '_blank') {
      window.open(href);
    } else {
      history.push(href);
    }
  };
  return (
    <span
      className={`pointer link ${props.className != null && props.className}`}
      onClick={(e) => {
        open(props.href);
      }}
    >
      {props.children}
    </span>
  );
}

export default A;
