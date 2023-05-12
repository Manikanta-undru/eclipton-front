import React, { useEffect, useState } from 'react';
import Button from '../Button';
import A from '../A';
import { GetAssetImage } from '../../globalFunctions';
import './styles.scss';

function BloggersCard(props) {
  const [limit, setLimit] = useState(props.limit == null ? props.limit : 10);
  const [category, setFiltered] = useState(props.category);

  useEffect(() => {
    getCategoryBlogs();
  }, []);

  const getCategoryBlogs = () => {};

  return (
    <div className="card bloggersCard" key={props.key}>
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
          <div className="text-right">
            <Button size="big">Follow</Button>
            <div className="card-sub-title fixed">
              {props.blogger.mutualFollowers.map((e, i) => (
                <span key={i}>{e}, </span>
              ))}
              <span>
                {`and ${props.blogger.totalMutualFollowers} other friends follow ${props.blogger.name}`}
              </span>
            </div>
          </div>
          <span className="fa fa-ellipsis-v more" />
        </div>
      </div>
      <div className="card-body">
        <div className="card-stats">
          <div>
            <strong>{props.blogger.totalFollowers}</strong> Followers
          </div>
          <div>
            <strong>{props.blogger.totalArticles}</strong> Articles
          </div>
          {props.blogger.verified ? (
            <div className="text-primary">Verified by Eclipton</div>
          ) : null}
        </div>

        <p className="card-description">{props.blogger.description}</p>
      </div>
    </div>
  );
}

export default BloggersCard;
