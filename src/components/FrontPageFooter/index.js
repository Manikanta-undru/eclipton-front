import React, { useState } from 'react';
import './styles.scss';

function FrontPageFooter(props) {
  const [layout, setLayout] = useState(
    props.layout != undefined ? props.layout : 'default'
  );
  // const [size, setSize] = useState(props.size != undefined ? props.size : "");

  return (
    <div className="row footerText">
      <div className="col-md-4">
        <p>
          <span className="padNone">Activity License</span> FVT000294
        </p>
      </div>

      <div className="col-md-4">
        <p>
          <span className="padNone">Copyright</span> © 2022 Eclipton
        </p>
      </div>

      <div className="col-md-4">
        <p>
          <a href={`${process.env.REACT_APP_FRONTEND}terms-and-conditions.pdf`}>
            T<span className="padNone">erms</span> & C
            <span className="padNone">onditions</span>
          </a>{' '}
          |{' '}
          <a href="/contact-us">
            Contact <span className="padNone">Us</span>
          </a>
        </p>
      </div>
    </div>
  );
}

export default FrontPageFooter;
