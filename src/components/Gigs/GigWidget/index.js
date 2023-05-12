import React, { useState, useEffect } from 'react';

import Button from '../../Button';
import './styles.scss';

function GigWidget(props) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (
      props.rating != undefined &&
      props.rating != null &&
      props.rating != ''
    ) {
      setRating(props.rating);
    }
  }, [props.rating, props.sales, props.likes]);

  const toggleBody = () => {
    const body = document.getElementById('walletWidgetBody');
    if (body.classList.contains('open')) {
      body.classList.remove('open');
    } else {
      body.classList.add('open');
    }
  };

  return (
    <div className="gig-widget widget">
      {props.authorid != props.currentUser._id && (
        <div className="blog-widget-inner container">
          {/* <div className="clapped"><img src={GetAssetImage("icons/clapped.svg")} /></div> */}

          <div className="item">
            <i className="fa fa-shopping-cart mainIcon" /> {props.sales} Sales
          </div>
          <div className="item">
            <i className="fa fa-heart mainIcon" /> {props.likes} Hearts
          </div>
          <div className="item">
            <div className="d-flex align-items-center justify-content-between rating">
              {rating >= 1 ? (
                <i className="fa fa-star" />
              ) : (
                <i className="fa fa-star-o" />
              )}
              {rating >= 2 ? (
                <i className="fa fa-star" />
              ) : (
                <i className="fa fa-star-o" />
              )}
              {rating >= 3 ? (
                <i className="fa fa-star" />
              ) : (
                <i className="fa fa-star-o" />
              )}
              {rating >= 4 ? (
                <i className="fa fa-star" />
              ) : (
                <i className="fa fa-star-o" />
              )}
              {rating >= 5 ? (
                <i className="fa fa-star" />
              ) : (
                <i className="fa fa-star-o" />
              )}

              <span className="pl-2">{rating}</span>
            </div>
          </div>
          {/*
          <div className="item">
            <img src={GetAssetImage("icons/comment.svg")} /> {props.comments} Comments
          </div>
          <div className="item">
            <img src={GetAssetImage("icons/tip.svg")} /> ${props.tips.toFixed(8)} Tipped 
            {
              !global && props.authorid != props.currentUser._id && 
              <React.Fragment>
            <p>Help grow our community send tips to keep receiving new posts from <Link to={"/u/"+props.authorid}>{props.authorname}</Link></p>
            
            <Button type="button" variant="primary" size="compact" onClick={props.sendTips}><span>Send tip</span></Button>
            </React.Fragment>
            }
          </div> */}
          <Button type="button" variant="primaryBtn" onClick={props.buyNow}>
            <span>BUY</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default GigWidget;
