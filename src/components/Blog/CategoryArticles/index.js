import React, { useEffect, useState } from 'react';
import A from '../../A';
import './styles.scss';
import { getCategoryBlogs } from '../../../http/blog-calls';

function CategoryArticles(props) {
  const [category, setCategory] = useState(props.category);
  const [categoryId, setCategoryId] = useState(props.categoryId);
  const [articles, setArticles] = useState([]);
  const [seemore, setMore] = useState(false);
  useEffect(() => {
    getArticles();
  }, []);
  const getArticles = () => {
    getCategoryBlogs({ limit: 5, page: 1, category }).then(
      (resp) => {
        setArticles(resp.post);
        setCategoryId(resp.post[0].categoryId);
        checkMore();
      },
      (error) => {
        console.log(error);
      }
    );
  };
  const checkMore = () => {
    getCategoryBlogs({ limit: 5, page: 2, category }).then(
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
    <div className="row cardBody categoryArticles widget">
      <div className="container">
        <div className="row">
          <ul className="list-group  w-100">
            <li className="list-group-item d-flex justify-content-between align-items-center widgetTitle">
              {category} Blogs
              {/* <A href="/" className="text-primary">See All</A> */}
            </li>
          </ul>

          {articles.length > 0 &&
            articles.map((e, i) =>
              e.removed > 0 ? null : (
                <ul className="list-group cat-list w-100" key={i}>
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
              )
            )}

          {seemore && (
            <A href={`/blogs/${categoryId}`} className="seemore-text">
              See More
            </A>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryArticles;
