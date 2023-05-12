import React, { useState } from 'react';
import './styles.scss';

function Button(props) {
  const [layout, setLayout] = useState(
    props.layout != undefined ? props.layout : 'default'
  );
  // const [size, setSize] = useState(props.size != undefined ? props.size : "");

  return (
    <>
      {layout == 'dropdown' ? (
        <button
          disabled={props.disabled == null ? false : props.disabled}
          type={props.type == null ? 'submit' : props.type}
          className={`button ${props.variant} ${props.size} ${props.className} dropdown`}
        >
          <span className="btn-text">{props.children}</span>
          <i className="fa fa-chevron-down" />
          <div className="dropdown-items">
            {props.dropdownOptions.map((e, i) => (
              <div className="item" onClick={() => props.onClick(i)} key={i}>
                {e}
              </div>
            ))}
          </div>
        </button>
      ) : (
        <button
          disabled={props.disabled == null ? false : props.disabled}
          onClick={props.onClick}
          type={props.type == null ? 'submit' : props.type}
          className={`button ${props.variant} ${props.size} ${props.className}`}
        >
          {props.children}
        </button>
      )}
    </>
  );
}

export default Button;
