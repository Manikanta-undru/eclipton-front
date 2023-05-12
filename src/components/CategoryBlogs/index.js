import React, { useEffect, useState } from 'react';
import A from '../A';
import LeftThumbCard from '../Cards/LeftThumbCard';
import './styles.scss';
import { GetAssetImage } from '../../globalFunctions';

function CategoryBlogs(props) {
  const [limit, setLimit] = useState(props.limit == null ? props.limit : 10);
  const [category, setFiltered] = useState(props.category);

  useEffect(() => {
    getCategoryBlogs();
  }, []);

  const getCategoryBlogs = () => {};

  return (
    <div className="categoryWiseBlogs empty-inner-container-with-out-border">
      <ul className="list-group w-100">
        <li className="list-group-item d-flex align-items-center header-drak widgetTitleBorderless">
          <strong>{props.category}</strong>
          <A className="text-primary ml-auto" href="/">
            See All
          </A>
        </li>
      </ul>
      {[1, 2, 3].map((e, i) => (
        <LeftThumbCard thumb={GetAssetImage('bgImg.jpg')} key={i} />
      ))}
    </div>
  );
}

export default CategoryBlogs;
