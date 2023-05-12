import React, { useEffect, useState } from 'react';
import A from '../A';
import { history } from '../../store';
import './styles.scss';
import { Link } from 'react-router-dom';

function LeftThumbCard(props) {
  const [post, setPost] = useState(props.post);
  const goTo = (url) => {
    history.push(url);
  };
  useEffect(() => {
    setPost(props.post);
  }, [props.post]);

  return (
    <div className="card leftThumbCard" key={props.k}>
      <div
        className="card-thumb pointer"
        style={{ backgroundImage: `url(${props.thumb})` }}
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
        props.shared == undefined &&
        props.authorid == props.currentUser._id ? (
          <span className="list-group-item  p-1 pr-2 pointer  dropdown pull-right">
            <i className="fa fa-ellipsis-h" />
            <div className="dropdown-menu hasUpArrow dropdown-menu-right">
              <Link to={`/edit-blog/${post.slug}`} className="dropdown-item">
                <img
                  className="mr-1"
                  src={require('../../assets/images/edit-icon.png')}
                />
                <span className="m-1">Edit</span>
              </Link>

              {(props.currentUser != undefined &&
                post.sharedBy == props.currentUser._id) ||
                (post.userid == props.currentUser._id && (
                  <a
                    className="dropdown-item"
                    onClick={(e) => props.removePost(post._id)}
                  >
                    <img
                      className="mr-1"
                      src={require('../../assets/images/remove-icon.png')}
                    />
                    <span className="m-1">Remove</span>
                  </a>
                ))}
            </div>
          </span>
        ) : (
          post.userid !== props.currentUser._id && (
            <span className="list-group-item  p-1 pr-2 pointer  dropdown pull-right">
              <i className="fa fa-ellipsis-h" />

              <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                {props.reported ? (
                  <a onClick={() => props.unReport()} className="dropdown-item">
                    <i className="fa fa-undo" />
                    <span className="m-1">Undo Report</span>
                  </a>
                ) : (
                  <a onClick={() => props.report()} className="dropdown-item">
                    <i className="fa fa-exclamation-circle" />
                    <span className="m-1">Report</span>
                  </a>
                )}

                {props.saved ? (
                  <a onClick={() => props.unSave()} className="dropdown-item">
                    <i className="fa fa-undo" />
                    <span className="m-1">Remove Wishlist</span>
                  </a>
                ) : (
                  <a onClick={() => props.save()} className="dropdown-item">
                    <i className="fa fa-plus" />
                    <span className="m-1">Add to Wishlist</span>
                  </a>
                )}

                {/* {
          (props.filterdata != "saved") ? (props.saved) ?
            <a onClick={()=>props.unSave()} className="dropdown-item">
            <i className="fa fa-undo"></i>
                <span className="m-1">Remove from Wishlist</span></a> 
          :
            <a onClick={()=>props.save()} className="dropdown-item">
            <i className="fa fa-plus"></i>
                <span className="m-1">Add to Wishlist</span></a> : ""
        } */}
              </div>
            </span>
          )
        )}

        <A href={props.url}>
          <h3 className="card-title">{props.title} </h3>{' '}
        </A>
        {/* <p className="card-description">{props.category}</p> */}
        {/* <p className="card-description">{props.description}</p> */}
        {/* <Truncate lines={2} className="card-description" ellipsis={<span>... </span>}>
        
      </Truncate> */}
        <div>
          <div className="card-description">
            <div
              dangerouslySetInnerHTML={{
                __html: props.description != undefined ? props.description : '',
              }}
            />

            {/* {props.description != undefined && props.description.replace(/<\/?[^>]+(>|$)/g, "").toString()} */}
          </div>
          <div>
            <a href={props.url} className="readmore">
              Read more
            </a>
          </div>
        </div>

        {props.shared == undefined && (
          <div className="card-stats">
            <div>
              <strong>{props.likes}</strong> <i className="fa fa-thumbs-up" />
            </div>
            <div>
              <strong>{props.shares}</strong> <i className="fa fa-share-alt" />
            </div>
            <div>
              <strong>{props.comments}</strong>{' '}
              <i className="fa fa-comment-o" />
            </div>
            <div>
              <strong>${props.tips?.toFixed(2)}</strong> <i>Tips</i>
            </div>
            <div className="card-sub-title">{props.category}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftThumbCard;
