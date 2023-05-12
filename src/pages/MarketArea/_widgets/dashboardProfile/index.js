import React, { Component } from 'react';

import profileImg from '../../../../assets/images/market-place/dashboard/profile6.png';
import chartImg from '../../../../assets/images/market-place/dashboard/chart.png';

require('./dashboard-profile.scss');

class AdBox extends Component {
  render() {
    return (
      <div className="dashboard-profile">
        <div className="db-profile-box">
          {/* BEGIN :: TOP */}
          <div className="top">
            <div className="profile-img-box">
              <img src={profileImg} alt="" />
              <span className="status" />
            </div>
            <div className="profile-detail-box">
              <h4> Ameer Hamza </h4>
              <p>
                {' '}
                <i className="fa fa-mobile" /> Mobile Store{' '}
              </p>

              <span className="abs star-rating">
                <i className="fa fa-star" /> 4.5
              </span>
            </div>
          </div>
          {/* END :: TOP */}

          {/* BEGIN :: BOTTOM */}
          <div className="bottom">
            {/* BEGIN :: PROFILE REVIEW BOX */}
            <div className="profile-review-box">
              <div className="left">
                <p> Seller Rating </p>
                <h4>
                  83%
                  <span className="star-rating">
                    <i className="fa fa-star" /> 4.3
                  </span>
                </h4>
              </div>

              <div className="right">
                <p> Buyer Rating</p>
                <h4> 75% </h4>
              </div>
            </div>
            {/* END :: PROFILE REVIEW BOX */}

            {/* BEGIN :: PROFILE REVIEW BOX */}
            <div className="profile-review-box">
              <div className="left">
                <p>
                  {' '}
                  Earned in February <i className="fa fa-clock-o" />{' '}
                </p>
                <h4> $200 </h4>
              </div>

              <div className="right">
                <p> Inbox Response </p>
                <h4> 1 hr </h4>
              </div>
            </div>
            {/* END :: PROFILE REVIEW BOX */}
          </div>
          {/* END :: BOTTOM */}
        </div>

        <div className="rating-chart-holder">
          {/* BEGIN :: RATING BOX HOLDER */}
          <div className="rating-box-holder">
            {/* BEGIN :: RATING BOX */}
            <div className="rating-box">
              <p> Order Response Rate </p>
              <h3>
                <div> 93% </div>
                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: '93%' }}
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </h3>
            </div>
            {/* END :: RATING BOX */}

            {/* BEGIN :: RATING BOX */}
            <div className="rating-box">
              <p> Inbox Response Rate </p>
              <h3>
                <div> 83% </div>
                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: '83%' }}
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </h3>
            </div>
            {/* END :: RATING BOX */}

            {/* BEGIN :: RATING BOX */}
            <div className="rating-box">
              <p> Return Rate </p>
              <h3>
                <div> 15% </div>
                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: '15%' }}
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </h3>
            </div>
            {/* END :: RATING BOX */}
          </div>
          {/* END :: RATING BOX HOLDER */}

          {/* BEGIN :: RATING BOX HOLDER */}
          <div className="rating-box-holder">
            {/* BEGIN :: RATING BOX */}
            <div className="rating-box">
              <p> Order Completion </p>
              <h3>
                <div> 90% </div>
                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: '90%' }}
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </h3>
            </div>
            {/* END :: RATING BOX */}

            {/* BEGIN :: RATING BOX */}
            <div className="rating-box">
              <p> Delivered on Time </p>
              <h3>
                <div> 90% </div>
                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: '90%' }}
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </h3>
            </div>
            {/* END :: RATING BOX */}

            {/* BEGIN :: RATING BOX */}
            <div className="rating-box">
              <p> Delivered on Time </p>
              <h3>
                <div> 90% </div>
                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: '90%' }}
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </h3>
            </div>
            {/* END :: RATING BOX */}
          </div>
          {/* END :: RATING BOX HOLDER */}

          <div className="chart-holder">
            <img src={chartImg} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default AdBox;
