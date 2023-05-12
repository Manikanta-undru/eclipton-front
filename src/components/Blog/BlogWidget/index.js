import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GetAssetImage } from '../../../globalFunctions';

import Button from '../../Button';
import './styles.scss';

function BlogWidget(props) {
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {}, []);

  const toggleBody = () => {
    const body = document.getElementById('walletWidgetBody');
    if (body.classList.contains('open')) {
      body.classList.remove('open');
    } else {
      body.classList.add('open');
    }
  };

  return (
    <div className="blog-widget widget">
      <div className="blog-widget-inner container">
        {/* <div className="clapped"><img src={GetAssetImage("icons/clapped.svg")} /></div> */}
        <div
          className="item"
          onClick={props.clap}
          data-toggle="tooltip"
          data-placement="top"
          title="Claps"
        >
          <img
            src={
              props.clapped == 1
                ? GetAssetImage('icons/clapped.svg')
                : GetAssetImage('icons/clap.svg')
            }
          />{' '}
          {props.claps} Claps
        </div>
        <div
          className="item"
          data-toggle="tooltip"
          data-placement="top"
          title="Likes"
        >
          <img src={GetAssetImage('icons/like.svg')} /> {props.likes} Likes
        </div>
        <div
          className="item"
          onClick={props.share}
          data-toggle="tooltip"
          data-placement="top"
          title="Shares"
        >
          <img src={GetAssetImage('icons/share.svg')} /> {props.shares} Shares
        </div>
        <div
          className="item"
          data-toggle="tooltip"
          data-placement="top"
          title="Comments"
        >
          <img src={GetAssetImage('icons/comment.svg')} /> {props.comments}{' '}
          Comments
        </div>
        <div
          className="item"
          data-toggle="tooltip"
          data-placement="top"
          title="Tipped"
        >
          <img src={GetAssetImage('icons/tip.svg')} /> ${props.tips} Tipped
          {props.currentUser != null &&
            props.authorid != props.currentUser._id && (
              <>
                <p>
                  Help grow our community send tips to keep receiving new posts
                  from{' '}
                  <Link to={`/u/${props.authorid}`}>{props.authorname}</Link>
                </p>
                <div className="sendtipBtn_align">
                  <Button
                    type="button"
                    variant="primaryBtn"
                    onClick={props.sendTips}
                  >
                    <span>Send tip</span>
                  </Button>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default BlogWidget;
