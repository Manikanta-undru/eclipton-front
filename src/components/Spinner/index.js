import React from 'react';
import './styles.scss';

function Spinner(props) {
  return (
    <div className="spinner" {...props}>
      <div className="spin" />
    </div>
  );
}

export default Spinner;
