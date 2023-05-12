import React from 'react';

class ZignsecFailed extends React.Component {
  render() {
    return (
      <div className="loginPage">
        <div className="container">
          <div className="row">
            <p
              className="text-danger"
              style={{ marginLeft: '100px', marginTop: '170px' }}
            >
              Zignsec Id verification is failed!, Please take Selfie
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ZignsecFailed;
