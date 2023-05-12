import React, { useState, useEffect } from 'react';

import { getGlobalProfile } from '../../../http/http-calls';
import { getAuthorBlogs } from '../../../http/blog-calls';
import { profilePic } from '../../../globalFunctions';
import A from '../../A';
import './styles.scss';

function AuthorBio(props) {
  const [cid, setCid] = useState(0);
  const [author, setAuthor] = useState({});
  const [articles, setArticles] = useState([]);
  const [seemore, setMore] = useState(false);
  useEffect(() => {
    getCurrentUser();
  }, [props.authorid]);

  const getCurrentUser = () => {
    getGlobalProfile({ id: props.authorid }, true).then(
      async (resp) => {
        setAuthor(resp);
        getArticles();
      },
      (error) => {}
    );
  };

  const getArticles = () => {
    getAuthorBlogs({ userid: props.authorid, limit: 5, page: 1 }, true).then(
      async (resp) => {
        setArticles(resp.post);
        checkMore();
      },
      (error) => {}
    );
  };
  const checkMore = () => {
    getAuthorBlogs({ userid: props.authorid, limit: 5, page: 2 }, true).then(
      (resp) => {
        if (resp.post !== undefined && resp.post.length > 0) {
          setMore(true);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div className="row cardBody authorBio widget">
      <div className="container">
        <div className="row">
          <ul className="list-group auth-item w-100 border-bottom ">
            <li className="list-group-item widgetTitle">
              <div className="media">
                <div className="media-left">
                  <A href={`/u/${author._id}`}>
                    <div
                      className="thumbnail circle widgetTitlePic"
                      style={{
                        backgroundImage: `url(${profilePic(
                          author.avatar,
                          author.name
                        )})`,
                      }}
                    />
                  </A>
                </div>
                <div className="media-body">
                  <A href={`/u/${author._id}`}>
                    <p className="media-heading text-white">{author.name}</p>
                  </A>
                </div>
              </div>
            </li>
          </ul>

          {articles.length > 0 &&
            articles.map((e, i) => (
              <ul className="list-group auth-item w-100" key={i}>
                <li className="list-group-item">
                  <div className="media">
                    <div className="media-left">
                      <a href={`/blog/${e.slug}`}>
                        <div
                          className="thumbnail"
                          style={{
                            backgroundImage: `url(${
                              e.contents != undefined &&
                              e.contents[0] != undefined
                                ? e.contents[0].content_url
                                : require('../../../assets/images/post-image@2x.png')
                            })`,
                          }}
                        />
                      </a>
                    </div>
                    <div className="media-body">
                      <a href={`/blog/${e.slug}`}>
                        <p className="media-heading">{e.subject}</p>
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            ))}

          {
            seemore && (
              <A
                href={`/all/author-blogs/${props.authorid}`}
                className="seemore-text"
              >
                See More
              </A>
            )
            //        <ul className="list-group w-100">
            //        <li className="list-group-item d-flex justify-content-between align-items-center p-0 ml-3">
            //            <A href={"/all/author-blogs/"+props.authorid} >
            //            <span className="seemore">See More</span>
            //            </A>
            //        </li>
            //    </ul>
          }
        </div>
      </div>
    </div>
  );
}

export default AuthorBio;
