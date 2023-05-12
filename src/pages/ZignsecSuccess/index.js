import React from 'react';

class ZignsecSuccess extends React.Component {
  render() {
    return (
      <div className="loginPage">
        <div className="container">
          <div className="row">
            <p
              className="text-success"
              style={{ marginLeft: '100px', marginTop: '170px' }}
            >
              Zignsec Id verification is successfully completed!
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ZignsecSuccess;
