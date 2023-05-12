import React, { useEffect, useState } from 'react';
import A from '../A';
import { history } from '../../store';
import './styles2.scss';
import { Link } from 'react-router-dom';
import { pic, profilePic } from '../../globalFunctions';

function TopThumbCard(props) {
  const [post, setPost] = useState(props.post);
  const [reported, setReported] = useState(props.reported);
  const goTo = (url) => {
    history.push(url);
  };
  useEffect(() => {
    setPost(props.post);
    setReported(props.reported);
  }, [props.post, props.reported]);
  return (
    <div className="card topThumbCard">
      <A href={props.url} className="block">
        <div
          className="thumb"
          style={{
            backgroundImage: `url(${pic(
              post.contents[0] != undefined ? post.contents[0].content_url : ''
            )})`,
          }}
        >
          {post.status == 'draft' ||
            (post.estatus == 'draft' && (
              <small className="badge badge-secondary draft-label ml-2 mt-1">
                Draft
              </small>
            ))}
        </div>
      </A>
      <div className="body">
        {props.currentUser != undefined &&
        post.shared == undefined &&
        post.userid == props.currentUser._id ? (
          <span className="list-group-item  p-1 pr-2 pointer  dropdown pull-right">
            <i className="dots fa fa-ellipsis-h" />
            <div className="dropdown-menu hasUpArrow dropdown-menu-right">
              <Link to={props.base + post.slug} className="dropdown-item">
                <img
                  className="mr-1"
                  src={require('../../assets/images/edit-icon.png')}
                />
                <span className="m-1">Edit</span>
              </Link>

              {(props.currentUser != undefined &&
                post.sharedBy == props.currentUser._id) ||
                (post.userid == props.currentUser._id && (
                  <a
                    className="dropdown-item"
                    onClick={(e) => props.removePost(post._id)}
                  >
                    <img
                      className="mr-1"
                      src={require('../../assets/images/remove-icon.png')}
                    />
                    <span className="m-1">Remove</span>
                  </a>
                ))}
            </div>
          </span>
        ) : (
          post.userid !== props.currentUser._id && (
            <span className="list-group-item  p-1 pr-2 pointer  dropdown pull-right ">
              <i className="dots fa fa-ellipsis-h" />
              {reported ? (
                <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                  <a onClick={() => props.unReport()} className="dropdown-item">
                    <i className="fa fa-undo" />
                    <span className="m-1">Undo Report</span>
                  </a>
                </div>
              ) : (
                <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                  <a onClick={() => props.report()} className="dropdown-item">
                    <i className="fa fa-exclamation-circle" />
                    <span className="m-1">Report</span>
                  </a>
                </div>
              )}
            </span>
          )
        )}

        <A href={props.url}>
          <p className="highlight-title">{post.subject}</p>
        </A>
        <div className="highlight-meta">
          <A href={`/u/${post.userid}`} className="highlight-userinfo">
            <div
              className="highlight-profile-pic"
              style={{
                backgroundImage: `url(${profilePic(
                  post.userinfo.avatar,
                  post.userinfo.name
                )})`,
              }}
            />
            <div>{post.userinfo.name}</div>
          </A>
          <div className="price">
            {`${post.preferedCurrency} ${
              post.standardPrice == undefined ? post.budget : post.standardPrice
            }`}
          </div>
          {/* <A href={"/passionomy/gig/"+post._id}><Button  className="w-100 mt-1">View</Button></A> */}
        </div>
      </div>
    </div>
  );
}

export default TopThumbCard;
