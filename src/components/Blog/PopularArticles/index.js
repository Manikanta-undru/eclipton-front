import React, { useEffect, useState } from 'react';
import A from '../../A';
import './styles.scss';
import { getPopularBlogs } from '../../../http/blog-calls';

function PopularArticles(props) {
  const [articles, setArticles] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [seemore, setMore] = useState(false);
  useEffect(() => {
    getArticles();
  }, []);
  const getArticles = () => {
    getPopularBlogs({ limit, page }).then(
      (resp) => {
        setArticles(resp.post);
        checkMore();
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const checkMore = () => {
    getPopularBlogs({ limit, page: page + 1 }).then(
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
    <div className="cardBody popularArticles widget">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="widgetTitle">
              <i className="fa fa-star" />
              <span>Popular Blogs</span>
            </li>
          </ul>

          {articles.length > 0 &&
            articles.map((e, i) =>
              e.removed > 0 ? null : (
                <ul className="list-group popular-item w-100" key={i}>
                  <li className="list-group-item">
                    <div className="media">
                      <div className="media-left">
                        <A href={`/blog/${e.slug}`}>
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
                        </A>
                      </div>
                      <div className="media-body">
                        <A href={`/blog/${e.slug}`}>
                          <p className="media-heading">{e.subject}</p>
                        </A>
                      </div>
                    </div>
                  </li>
                </ul>
              )
            )}

          {seemore && (
            <A href="/all/popular-blogs" className="seemore-text">
              See More
            </A>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopularArticles;
