import React, { useState, useEffect } from 'react';

require('./styles.scss');

function SearchMenu(props) {
  const [current, setCurrent] = useState(props.current);
  useEffect(() => {
    setCurrent(props.current);
  }, [props.current]);

  return (
    <ul className="searchMenu cardBody">
      <li>
        <div
          className={`pointer ${current == 'all' && ' active'}`}
          onClick={(e) => props.onClick('all')}
        >
          All
        </div>
      </li>
      <li>
        <div
          className={`pointer ${current == 'users' && ' active'}`}
          onClick={(e) => props.onClick('users')}
        >
          People
        </div>
      </li>
      <li>
        <div
          className={`pointer ${current == 'posts' && ' active'}`}
          onClick={(e) => props.onClick('posts')}
        >
          Posts
        </div>
      </li>
      <li>
        <div
          className={`pointer ${current == 'blogs' && ' active'}`}
          onClick={(e) => props.onClick('blogs')}
        >
          Blogs
        </div>
      </li>
      <li>
        <div
          className={`pointer ${current == 'gigs' && ' active'}`}
          onClick={(e) => props.onClick('gigs')}
        >
          Gigs
        </div>
      </li>
      {/* <li>
               <div className={"pointer "+(current == "courses" && " active")} onClick={(e) => props.onClick("courses")}>
                       Courses
                   </div>
               </li>
               <li>
               <div className={"pointer "+(current == "gigs" && " active")} onClick={(e) => props.onClick("gigs")}>
                       Gigs
                   </div>
               </li>
               <li>
               <div className={"pointer "+(current == "marketplace" && " active")} onClick={(e) => props.onClick("marketplace")}>
                       Marketplace
                   </div>
               </li> */}
      <li>
        <a className="back-to-home" href="/home">
          Back to <i className="fa fa-home" aria-hidden="true" />
        </a>
      </li>
    </ul>
  );
}

export default SearchMenu;
