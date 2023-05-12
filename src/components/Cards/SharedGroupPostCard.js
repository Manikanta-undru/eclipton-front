import React, { useState } from 'react';
import A from '../A';
import TimeAgo from 'react-timeago';
import ReactPlayer from 'react-player';

import Truncate from 'react-truncate';
import { history } from '../../store';
import './styles.scss';
import { profilePic } from '../../globalFunctions';

const SharedGroupPostCard = (props) => {
  const goTo = (url) => {
    history.push(url);
  };

  const htmlToText = (html) => {
    var temp = document.createElement('div');
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
          <A href={'/u/' + post.userid} className="highlight-userinfo">
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

        {type == 'group' && (
          <>
            <A href={'/tribesfeeds/' + post.groupsdata._id}>
              <h3 className="card-title mb-1">{post.groupsdata.name}</h3>
            </A>

            <div className="card-sub-title mb-1">
              {post.groupsdata.category}{' '}
              {type == 'group' ? '-' + post.groupsdata.privacy + ' group' : ''}
            </div>

            <div
              className="w-100 pointer post-image-thumb"
              onClick={() => goTo('/tribesfeeds/' + post.groupsdata._id)}
            >
              <div className="image-wrapper">
                <img
                  src={post.groupsdata.banner}
                  className="post-image-content"
                />
              </div>
            </div>

            <p className="card-description">{post.groupsdata.description}</p>
          </>
        )}
        {contents &&
          contents[0] &&
          contents != undefined &&
          contents[0].contenttype == 'Image' && (
            <div
              className="w-100 pointer post-image-thumb"
              onClick={() => goTo(props.url)}
            >
              {contents?.map((content, i) => {
                return i < 5 ? (
                  content.contenttype == 'Image' ? (
                    <div key={i + 'csv'} className="image-wrapper">
                      <img
                        src={content.content_url}
                        className="post-image-content"
                      />{' '}
                    </div>
                  ) : (
                    <ReactPlayer
                      key={i + 'csv'}
                      className="post-video-content"
                      controls={true}
                      url={content.content_url}
                      width="auto"
                      height="auto"
                    />
                  )
                ) : i == 5 ? (
                  <div key={i + 'csv'} className="post-images-more">
                    <img
                      src={content.content_url}
                      className="post-image-content"
                    />
                    <div>
                      <span>+{contents.length - i} more</span>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}

        {type == 'group' && <p>{post.description}</p>}

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
};

export default SharedGroupPostCard;
