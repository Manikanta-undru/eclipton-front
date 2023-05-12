import React, { useEffect, useState } from 'react';
import A from '../../A';
import './styles.scss';
import { getPopularBlogs } from '../../../http/blog-calls';

function PopularThisWeek(props) {
  const [articles, setArticles] = useState([]);
  const [seemore, setMore] = useState(false);
  useEffect(() => {
    getArticles();
  }, []);
  const getArticles = () => {
    getPopularBlogs({ limit: 10, page: 1 }).then(
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
    getPopularBlogs({ limit: 10, page: 2 }).then(
      (resp) => {
        if (resp.post.length > 0) {
          setMore(true);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };
  return (
    <div className="row cardBody popularArticles widget">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="list-group-item d-flex justify-content-between align-items-center header-drak widgetTitle">
              Popular this week
              {/* <A href="/blogs/all" className="text-primary">See All</A> */}
            </li>
          </ul>

          {articles.length > 0 &&
            articles.map((e, i) => (
              <ul className="list-group w-100" key={i}>
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
            ))}

          {seemore && (
            <A href="/all/popular-articles" className="seemore-text">
              See More
            </A>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopularThisWeek;
