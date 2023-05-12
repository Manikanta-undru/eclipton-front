import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../../../assets/images/market-place/avatar7.png';
import AvatarThumb from '../../../../assets/images/market-place/avatar-thumb.png';

require('./inbox.scss');

class Inbox extends Component {
  render() {
    return (
      <div className="inbox-wrapper">
        {/* BEGIN :: HEADER */}
        <div className="head">
          <h3> Inbox </h3>
        </div>
        {/* END :: HEADER */}

        {/* BEGIN :: BODY */}
        <div className="body">
          {/* BEGIN :: INBOX */}
          <div className="inbox active">
            <div className="avatar">
              <img src={Avatar} alt="" />
              <span className="thumb">
                <img src={AvatarThumb} alt="" />
              </span>
            </div>

            <div className="content">
              <h4> Versatile Marketing </h4>
              <p> Please make an offer first to ... </p>

              <span className="date"> 7:03 AM </span>
            </div>
          </div>
          {/* END :: INBOX */}

          {/* BEGIN :: INBOX */}
          <div className="inbox">
            <div className="avatar">
              <img src={Avatar} alt="" />
              <span className="thumb">
                <img src={AvatarThumb} alt="" />
              </span>
            </div>
            <div className="content">
              <h4> Versatile Marketing </h4>
              <p> Please make an offer first to ... </p>

              <span className="date"> 7:03 AM </span>
            </div>
          </div>
          {/* END :: INBOX */}

          {/* BEGIN :: INBOX */}
          <div className="inbox">
            <div className="avatar">
              <img src={Avatar} alt="" />
              <span className="thumb">
                <img src={AvatarThumb} alt="" />
              </span>
            </div>
            <div className="content">
              <h4> Versatile Marketing </h4>
              <p> Please make an offer first to ... </p>

              <span className="date"> 7:03 AM </span>
            </div>
          </div>
          {/* END :: INBOX */}

          {/* BEGIN :: INBOX */}
          <div className="inbox">
            <div className="avatar">
              <img src={Avatar} alt="" />
              <span className="thumb">
                <img src={AvatarThumb} alt="" />
              </span>
            </div>
            <div className="content">
              <h4> Versatile Marketing </h4>
              <p> Please make an offer first to ... </p>

              <span className="date"> 7:03 AM </span>
            </div>
          </div>
          {/* END :: INBOX */}
        </div>
        {/* END :: BODY */}

        {/* BEGIN :: FOOTER */}
        <div className="foot">
          <Link to="\"> See All </Link>
        </div>
        {/* END :: FOOTER */}
      </div>
    );
  }
}

export default Inbox;
