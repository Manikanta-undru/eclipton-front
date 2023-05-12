import React, { Component } from 'react';
import ReviewForm from './form';
import verifiedIcon from '../../../../assets/images/icons/verified.svg';
import {
  getAll,
  getCount,
  reviewReply,
} from '../../../../http/product-review-calls';
import { updateRating } from '../../../../http/product-calls';
import { getCurrentUser } from '../../../../http/token-interceptor';
import A from '../../../../components/A';
import { profilePic } from '../../../../globalFunctions';
import { ENTER_KEY } from '../../../../constants/actionTypes';

const currentUser = JSON.parse(getCurrentUser());
require('./reviews.scss');

class Reviews extends Component {
  constructor(props) {
    super(props);
    const initialState = {
      products: this.props.products,
    };
    this.state = {
      ...initialState,
      reviews: [],
      page: 1,
      total_count: 0,
      five_star_count: 0,
      four_star_count: 0,
      three_star_count: 0,
      two_star_count: 0,
      one_star_count: 0,
      total_ratio: 0,
      pageList: [],
      reply: '',
    };
    this.handleLoad = this.handleLoad.bind(this);
  }

  componentDidMount() {
    this.fetchAllProductView(this.state.products._id, this.state.page);
    this.fetchAllProductReviewCount(this.state.products._id);
  }

  handleLoad(e, page) {
    e.preventDefault();
    this.setState({
      page,
    });
    const element = document.getElementsByClassName('pagination-numbers')[0];
    element.classList.add('active');
    this.state.pageList.forEach((e_item) => {
      if (page !== e_item) {
        element.classList.remove('active');
      }
    });
    this.fetchAllProductView(this.state.products._id, page);
  }

  fetchAllProductView(product_id, page, rate) {
    const err = [];
    let formData;
    formData = {
      product_id,
      page,
    };
    if (rate) {
      formData.rate = rate;
    }
    if (product_id) {
      getAll(formData).then(
        async (resp) => {
          this.setState({
            reviews: resp,
          });
        },
        (error) => {
          err.push(error.message);
        }
      );
    }
  }

  fetchAllProductReviewCount = (product_id) => {
    const err = [];
    let formData;
    formData = {
      product_id,
    };
    if (product_id) {
      getCount(formData).then(
        async (resp) => {
          this.setState({
            ...resp,
          });
          if (this.state.total_ratio === 'NaN') {
            this.setState({ total_ratio: 0 });
          }
          updateRating({
            product_id,
            rating: this.state.total_ratio,
          }).then(
            async (resp) => {},
            (error) => {
              err.push(error);
            }
          );
          const list = [];
          let i = 1;
          while (i <= Math.ceil(resp.total_count / 5)) {
            list.push(i);
            i++;
          }
          this.setState({
            pageList: list,
          });
        },
        (error) => {
          err.push(error.message);
        }
      );
    }
  };

  handleCallback = (childData) => {
    this.state.reviews.unshift(childData);
    this.setState({ reviews: this.state.reviews });
    this.fetchAllProductReviewCount(this.state.products._id);
  };

  handleInput = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    if (name === 'star_filter') {
      this.fetchAllProductView(this.state.products._id, this.state.page, val);
    }
    this.setState({
      [name]: val,
    });
  };

  showReplies = (reviewId) => {
    const index = this.state.reviews.findIndex((el) => el._id === reviewId);
    const tempPostData = this.state.reviews;
    tempPostData[index].showReply = true;
    this.setState({ reviews: tempPostData });
  };

  callBackReply = (replyData, index) => {
    const postObj = this.state;
    if (postObj.reviews && postObj.reviews[index]) {
      if (postObj.reviews[index].replies) {
        postObj.reviews[index].replies.push(replyData);
      } else {
        postObj.reviews[index].replies = [replyData];
      }
      this.setState({ reviews: postObj.reviews, reply: '' });
    }
  };

  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ reply: value });
  };

  handleChangeReply = (e, review_id, reply, key, callBack) => {
    const { name, value } = e.target;
    if (e.key === ENTER_KEY) {
      this.setState({ reply: value });
      this.reviewReply(review_id, reply, key, callBack);
    }
  };

  reviewReply = (review_id, reply, key, callBack) => {
    reply = {
      user_info: {
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
      },
      reply,
    };
    reviewReply({ review_id, reply }, true).then(
      async (resp) => {
        callBack(reply, key);
      },
      (error) => {}
    );
  };

  deleteReply = (review_id, reply, reply_key, index) => {
    reviewReply({ review_id, reply, key: reply_key }, true).then(
      async (resp) => {
        const postObj = this.state;
        if (postObj.reviews && postObj.reviews[index]) {
          if (postObj.reviews[index].replies) {
            const temp = postObj.reviews[index].replies;
            temp.splice(reply_key, 1);
            postObj.reviews[index].replies = temp;
          } else {
            postObj.reviews[index].replies = [];
          }
          this.setState({ reviews: postObj.reviews, reply: '' });
        }
      },
      (error) => {}
    );
  };

  render() {
    return (
      <div className="reviews-holder">
        <h5 className="title-reviews">
          Ratings & Reviews of Superb Bass Earphones Handsfree - 3.5mm Jack -
          Supported
          <br /> with all devices
        </h5>
        <div className="rating-box d-flex">
          <div className="left">
            <h2>
              {' '}
              {this.state.total_ratio}
              <small>/5 </small>{' '}
            </h2>
            <div
              className={`stars stars-${Math.floor(this.state.total_ratio)}`}
            >
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
              <i className="fa fa-star" />
            </div>
            <p> {this.state.total_count} Ratings </p>
          </div>

          <div className="right">
            <div className="ratings">
              <div className="rating-holder">
                <div className="stars stars-5">
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                </div>

                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: '75%' }}
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                  <span> {this.state.five_star_count} </span>
                </div>
              </div>

              <div className="rating-holder">
                <div className="stars stars-4">
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                </div>

                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: '30%' }}
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                  <span> {this.state.four_star_count}</span>
                </div>
              </div>

              <div className="rating-holder">
                <div className="stars stars-3">
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                </div>

                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: '25%' }}
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                  <span> {this.state.three_star_count} </span>
                </div>
              </div>

              <div className="rating-holder">
                <div className="stars stars-2">
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                </div>

                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                  <span> {this.state.two_star_count} </span>
                </div>
              </div>

              <div className="rating-holder">
                <div className="stars stars-1">
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                </div>

                <div className="progress-area">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: '6%' }}
                      role="progressbar"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                  <span> {this.state.one_star_count} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="review-box">
          <ReviewForm
            products={this.state.products}
            parentCallback={this.handleCallback}
          />

          <div className="top">
            <div className="left">
              <h2 className="title"> Product Reviews </h2>
            </div>

            <div className="middle category-fields" />

            <div className="right category-fields">
              <div className="category">
                <p> Filter : </p>
              </div>
              <div className="category-field">
                <select
                  name="star_filter"
                  id="star_filter"
                  onChange={this.handleInput}
                >
                  <option value="all"> All Star </option>
                  <option value="stars-5"> 5 Stars </option>
                  <option value="stars-4"> 4 Stars </option>
                  <option value="stars-3"> 3 Stars </option>
                  <option value="stars-2"> 2 Stars </option>
                  <option value="stars-1"> 1 Star </option>
                </select>
              </div>
            </div>
          </div>

          <div className="bottom customer-reviews">
            {/* BEGIN :: CUSTOMER REVIEW BOX */}
            {this.state.reviews.length > 0 &&
              this.state.reviews.map((item, key) => (
                <div className="customer-review-box" key={item._id}>
                  <div className="star-and-date">
                    <div className={`stars ${item.rate} small`}>
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                    </div>
                    <div className="date">
                      <p> {item.createdAt} </p>
                      {this.state.products.userid === currentUser._id && (
                        <a>
                          <span
                            className="pull-right"
                            onClick={(e) => this.showReplies(item._id)}
                          >
                            {' '}
                            Reply
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="customer-name">
                    <p>
                      By Am*****
                      <span className="verified">
                        <img src={verifiedIcon} />
                        Verified Purchase
                      </span>
                    </p>
                    <p>{item.review}</p>

                    <div className="review-image">
                      <ul>
                        {Object.entries(item.attachment).map((attach, i) => {
                          let extension = attach[1].src.split('.');
                          extension = extension[extension.length - 1];
                          if (extension !== 'mp4') {
                            return (
                              <li key={i}>
                                <img src={attach[1].src} alt="" />
                              </li>
                            );
                          }
                          return (
                            <li key={i}>
                              <video controls>
                                <source src={attach[1].src} type="video/mp4" />{' '}
                              </video>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="replies">
                      {item.replies &&
                        item.replies.length > 0 &&
                        item.replies.map((reply, reply_key) => (
                          <div
                            className="media w-100 align-items-center p-1"
                            key={reply_key}
                          >
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              <div className="col pl-1">
                                <div className="media w-100 align-items-center p-1">
                                  <div className="media-left mr-2">
                                    <A href={`/u/${reply.user_info._id}`}>
                                      <img
                                        className="media-object pic"
                                        src={profilePic(
                                          reply.user_info.avatar,
                                          reply.user_info.name
                                        )}
                                        alt="..."
                                      />
                                    </A>
                                  </div>
                                  <div className="media-body">
                                    <A href={`/u/${reply.user_info._id}`}>
                                      <p className="media-heading">
                                        {reply.user_info
                                          ? reply.user_info.name
                                          : reply.user_info.name}
                                      </p>
                                    </A>
                                    <p className="media-subheading">
                                      {reply.reply}
                                    </p>
                                  </div>
                                  <div className="media-right h-auto">
                                    <div className="list-group-item  p-0 ps-2 pointer  dropdown">
                                      <i className="vertical-dot fa fa-ellipsis-h" />
                                      <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                                        {reply.user_info._id ==
                                          currentUser._id && (
                                          <a
                                            className="dropdown-item"
                                            onClick={(e) =>
                                              this.deleteReply(
                                                item._id,
                                                reply,
                                                reply_key,
                                                key
                                              )
                                            }
                                          >
                                            <img
                                              className="me-1"
                                              src={require('../../../../assets/images/remove-icon.png')}
                                            />
                                            <span className="m-1">Delete</span>
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </div>
                        ))}
                    </div>
                    {item.showReply &&
                      this.state.products.userid === currentUser._id && (
                        <div className="col pl-4 mb-2 d-flex">
                          <input
                            className="form-control tempcommentInput"
                            type="text"
                            placeholder="Add your reply"
                            name="reply"
                            value={this.state.reply}
                            onKeyPress={(e) =>
                              this.handleChangeReply(
                                e,
                                item._id,
                                this.state.reply,
                                key,
                                this.callBackReply
                              )
                            }
                            onChange={(e) => this.handleChange(e)}
                          />
                          <button
                            className="btn-1"
                            onClick={() =>
                              this.reviewReply(
                                item._id,
                                this.state.reply,
                                key,
                                this.callBackReply
                              )
                            }
                          >
                            REPLY
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}

            <div className="pagination">
              <a
                href="#"
                onClick={(e) => this.handleLoad(e, this.state.page - 1)}
              >
                &laquo;
              </a>
              {this.state.pageList.map((number, i) => (
                <a
                  href=""
                  onClick={(e) => this.handleLoad(e, number)}
                  className="pagination-numbers"
                  key={i}
                >
                  {number}
                </a>
              ))}
              <a
                href="#"
                onClick={(e) => this.handleLoad(e, this.state.page + 1)}
              >
                &raquo;
              </a>
            </div>

            {/*  END :: CUSTOMER REVIEW BOX 

                            <div className="load-more">
                                {
                                    this.state.reviews.length > 0 && 
                                    <Link 
                                    onClick={(e) => this.handleLoad(e, this.state.page)}
                                    class="button primary-outline big undefined"> Load more </Link>
                                }
                                {
                                    this.state.reviews.length === 0 &&
                                    <h4> No More Review Found</h4>
                                }
                               {
                                    this.state.reviews.length === 0 &&
                                    <Link 
                                    onClick={(e) => this.handleLoad(e, 0)}
                                    class="button primary-outline big undefined"> Back to first </Link>
                               }
                            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Reviews;
