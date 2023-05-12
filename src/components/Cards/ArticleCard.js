import React, { useEffect, useState } from 'react';
import Comments from '../Comments';
import A from '../A';
import { GetAssetImage } from '../../globalFunctions';
import './styles.scss';

function ArticleCard(props) {
  const [limit, setLimit] = useState(props.limit == null ? props.limit : 10);
  const [category, setFiltered] = useState(props.category);

  useEffect(() => {
    getCategoryBlogs();
  }, []);

  const getCategoryBlogs = () => {};

  const comments = [
    {
      image: 'profile.jpg',
      replies: [
        {
          image: 'profile.jpg',
        },
      ],
    },
    {
      image: 'profile.jpg',
    },
    {
      image: 'profile.jpg',
    },
  ];

  return (
    <div className="card bloggersCard articleCard" key={props.key}>
      <div className="card-head">
        <div className="card-head-left">
          <A href="/blog-team">
            <div
              className="card-thumb"
              style={{
                backgroundImage: `url(${GetAssetImage(props.blogger.image)})`,
              }}
            />
          </A>
          <div className="ml-3">
            <A href="/blog-team">
              <h3 className="card-title">{props.blogger.name}</h3>
            </A>
            {props.blogger.members == undefined ||
            props.blogger.members == null ? (
              <div className="card-sub-title text-primary">
                {props.blogger.designation}
              </div>
            ) : (
              <div className="card-sub-title">
                {`${props.blogger.members} members`}
              </div>
            )}
          </div>
        </div>
        <div className="card-head-right">
          <div className="card-sub-title">23 mins</div>
          <span className="fa fa-ellipsis-v more" />
        </div>
      </div>
      <div className="card-body">
        <A href="/blog/single">
          <img
            className="card-image"
            src={GetAssetImage(props.blogger.photo)}
          />
        </A>
        <A href="/blog/single">
          <h3 className="card-title mt-3">{props.blogger.title}</h3>
        </A>
        <p className="card-description">{props.blogger.description}</p>
        <div className="postActionBox">
          <ul className="list-group w-100 m-0">
            <li className="list-group-item d-flex justify-content-between align-items-center post-meta p-0 horizontal-line-fit-top horizontal-line-fit-below mt-2 mb-4">
              <div className="col pl-0 m-1">
                <ul className="list-group list-group-horizontal remove-border m-0">
                  <li className="list-group-item pointer">
                    <img src="/static/media/like.9b7cdf18.svg" />
                    <span className="m-1" />
                  </li>
                </ul>
              </div>
              <div className="pr-1">
                <ul className="list-group list-group-horizontal remove-border m-0">
                  <li className="list-group-item pl-0 pointer">
                    <span className="m-1"> 2 Comments </span>
                  </li>
                  <li className="list-group-item pl-0 pointer">
                    <span className="m-1"> Share </span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <Comments comments={comments} />
        <div className="col pl-1 comment-form">
          <input
            className="form-control tempcommentInput"
            type="text"
            placeholder="Add your comment"
            name="commentText"
          />
          <button className="tempCommentBtn">
            <span className="fa fa-send" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;
