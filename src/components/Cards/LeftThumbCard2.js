import React, { useState } from 'react';
import Truncate from 'react-truncate';
import A from '../A';
import { history } from '../../store';
import './styles.scss';
import { pic } from '../../globalFunctions';
import Button from '../Button';

function LeftThumbCard2(props) {
  const goTo = (url) => {
    history.push(url);
  };
  const [post, setPost] = useState(props.post);
  return (
    <div className="card leftThumbCard" key={props.k}>
      <div
        className="card-thumb pointer"
        style={{
          backgroundImage: `url(${pic(
            post.contents[0] == undefined ? '' : post.contents[0].content_url
          )})`,
        }}
        onClick={() => goTo(props.url)}
      >
        {post.status == 'draft' && (
          <small className="badge badge-secondary draft-label ml-2 mt-1">
            Draft
          </small>
        )}
      </div>
      <div className="card-body">
        {props.currentUser != undefined &&
        post.userid == props.currentUser._id ? (
          <span className="list-group-item  p-1 pr-2 pointer  dropdown pull-right">
            <i className="fa fa-ellipsis-h" />
            <div className="dropdown-menu hasUpArrow dropdown-menu-right">
              <span
                className="dropdown-item pointer"
                onClick={() => props.edit()}
              >
                <img
                  className="mr-1"
                  src={require('../../assets/images/edit-icon.png')}
                />
                <span className="m-1">Edit</span>
              </span>

              <span
                className="dropdown-item pointer"
                onClick={() => props.delete()}
              >
                <img
                  className="mr-1"
                  src={require('../../assets/images/remove-icon.png')}
                />
                <span className="m-1">Delete</span>
              </span>
            </div>
          </span>
        ) : (
          <span className="list-group-item  p-1 pr-2 pointer  dropdown pull-right" />
        )}

        <A href={props.url}>
          <h3 className="card-title">{post.subject}</h3>
        </A>
        <div className="card-sub-title">
          {post.category} <i className="fa fa-chevron-right text-small" />{' '}
          {post.subCategory}
        </div>
        {/* <p className="card-description">{props.description}</p> */}
        <Truncate
          lines={1}
          className="card-description"
          ellipsis={
            <span>
              ... <a href={props.url}>Read more</a>
            </span>
          }
        >
          {post.text != undefined && post.text.replace(/<\/?[^>]+(>|$)/g, '')}
        </Truncate>

        <div>
          <strong>{post.tags}</strong>
        </div>

        {props.shared == undefined && (
          <div className="card-stats">
            {/* <div><strong>{props.likes}</strong> Claps</div>
        <div><strong>{props.shares}</strong> Shares</div>
         */}
            {post.waiting > 0 && (
              <A href={`/passionomy/my-gigs/${post._id}`}>
                <Button variant="primary">
                  {`${post.waiting} Orders waiting for handshake`}
                </Button>
              </A>
            )}
            <div>
              File Format: <strong>{post.format}</strong>{' '}
            </div>
            <div>
              Price:{' '}
              <strong className="text-success">
                {post.preferedCurrency}{' '}
                {`${post.standardPrice} to ${post.premiumPrice}`}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftThumbCard2;
