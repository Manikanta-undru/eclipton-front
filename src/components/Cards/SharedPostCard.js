import React, { useState } from 'react';
import TimeAgo from 'react-timeago';
import ReactPlayer from 'react-player';

import Truncate from 'react-truncate';
import A from '../A';
import { history } from '../../store';
import './styles.scss';
import { profilePic } from '../../globalFunctions';
import Button from '../Button';

function SharedPostCard(props) {
  const goTo = (url) => {
    history.push(url);
  };

  const htmlToText = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent; // Or return temp.innerText if you need to return only visible text. It's slower.
  };

  const [post, setPost] = useState(props.post);
  const [contents, setContents] = useState(props.contents);
  const [userinfo, setUserinfo] = useState(props.userinfo);
  const [type, setType] = useState(props.type);
  const [cardStyle, SetStyle] = useState(props.type == 'blog' ? '500px' : '');

  return (
    <div className="card leftThumbCard" key={props.k}>
      {/* {contents[0] == undefined ? null : <div className="card-thumb pointer" style={{backgroundImage: "url(" + pic(contents[0].content_url) + ")"}} onClick={() => goTo(props.url)}>
    </div> } */}
      <div className="card-body" style={{ height: cardStyle }}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <A href={`/u/${post.userid}`} className="highlight-userinfo">
            {/* <div className="highlight-profile-pic" style={{ backgroundImage: `url(${profilePic(userinfo == undefined ? '' : userinfo.avatar, userinfo == undefined ? '' : userinfo.name)})` }}> */}
            <img
              className="highlight-profile-pic"
              src={profilePic(
                userinfo == undefined ? '' : userinfo.avatar,
                userinfo == undefined ? '' : userinfo.name
              )}
            />
            {/* </div> */}
            <div className="name-block">
              <div>{userinfo == undefined ? 'Unkown' : userinfo.name}</div>
              {type != 'group' && (
                <p className="media-subheading">
                  <TimeAgo date={post.createdAt} />
                </p>
              )}
            </div>
          </A>
        </div>

        {type == 'blog' && (
          <A href={props.url}>
            <h3 className="card-title mb-1">{post.subject}</h3>
          </A>
        )}
        {type == 'group' && (
          <A href={props.url}>
            <h3 className="card-title mb-1">{post.name}</h3>
          </A>
        )}
        {type == 'product' && (
          <A href={props.url}>
            <h3 className="card-title mb-1">
              {post.title}
              &nbsp;&nbsp;<Button variant="primaryBtn">Purchase</Button>
            </h3>
          </A>
        )}

        {type == 'product' && (
          <div className="card-sub-title price-box ml-1">
            <div className="price-details">
              <i className="fa fa-rupee" />{' '}
              {(post.amount - (post.amount * post.discount) / 100).toFixed(2)}
              <span className="off"> {post.price_currency} </span>
              <span className="off"> {post.discount}% OFF </span>
              <span className="strike">
                <i className="fa fa-rupee" /> {post.amount}
              </span>
            </div>
          </div>
        )}
        <div className="card-sub-title mb-1">
          {post.category} {type == 'group' ? `-${post.privacy} group` : ''}
        </div>
        {type == 'group' && (
          <div
            className="w-100 pointer post-image-thumb"
            onClick={() => goTo(props.url)}
          >
            <div className="image-wrapper">
              <img src={post.banner} className="post-image-content" />
            </div>
          </div>
        )}
        {type == 'product' && (
          <div
            className="w-100 pointer post-image-thumb"
            onClick={() => goTo(props.url)}
          >
            <div className="image-wrapper">
              <img
                src={post.attachment[0].src}
                className="post-image-content"
              />
            </div>
          </div>
        )}
        {/* <p className="card-description">{props.description}</p> */}
        {contents &&
          contents[0] &&
          contents != undefined &&
          contents[0].contenttype == 'Image' && (
            <div
              className="w-100 pointer post-image-thumb"
              onClick={() => goTo(props.url)}
            >
              {contents?.map((content, i) =>
                i < 5 ? (
                  content.contenttype == 'Image' ? (
                    <div key={`${i}csv`} className="image-wrapper">
                      <img
                        src={content.content_url}
                        className="post-image-content"
                      />{' '}
                    </div>
                  ) : (
                    <ReactPlayer
                      key={`${i}csv`}
                      className="post-video-content"
                      controls
                      url={content.content_url}
                      width="auto"
                      height="auto"
                    />
                  )
                ) : i == 5 ? (
                  <div key={`${i}csv`} className="post-images-more">
                    <img
                      src={content.content_url}
                      className="post-image-content"
                    />
                    <div>
                      <span>+{contents.length - i} more</span>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

        {type == 'group' && <p>{post.description}</p>}
        {type == 'product' && (
          <div dangerouslySetInnerHTML={{ __html: post.description }} />
        )}

        <Truncate
          lines={2}
          className="card-description mt-2"
          ellipsis={
            <span>
              ... <a href={props.url}>Read more</a>
            </span>
          }
        >
          {post.text != undefined &&
            post.type != 'group' &&
            htmlToText(post.text)}
        </Truncate>

        <div>
          <strong>{post.tags}</strong>
        </div>
      </div>
    </div>
  );
}

export default SharedPostCard;
