import React, { useState, useEffect } from 'react';
import { getBlogCategories } from '../../http/blog-calls';
import A from '../A';
import './styles.scss';

function BlogCategoryMenu(props) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getBlogCategories().then(
      (resp) => setCategories(resp),
      (err) => {
        console.log(err);
      }
    );
  }, []);
  return (
    <div className="widget cardBody SocialMenus">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="list-group-item d-flex justify-content-between align-items-center header-drak widgetTitle">
              Blog Categories
            </li>
          </ul>

          <ul className="list-group w-100 menu">
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 'all' && 'current'
              }`}
              key={0}
            >
              <A href="/blogs/all" className="align-items-center d-flex">
                {' '}
                All{' '}
              </A>
            </li>
            {categories.length > 0 &&
              categories.map((item, i) => (
                <li
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    props.current == item.category && 'current'
                  }`}
                  key={i}
                >
                  <A
                    href={`/blogs/${item.category}`}
                    className="align-items-center d-flex"
                  >
                    {' '}
                    {item.category}
                  </A>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BlogCategoryMenu;
