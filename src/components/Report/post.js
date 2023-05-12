import React, { Component } from 'react';

import { alertBox } from '../../commonRedux';
import Button from '../Button';
import { postReport } from '../../http/http-calls';
import { getPostData, getUserInfo } from '../../http/post-calls';
// import { get } from "../../../../http/post-calls";
import { getCurrentUser } from '../../http/token-interceptor';
import { createReport } from '../../http/wallet-calls';
// import { postReport } from '../../../../http/wallet-calls';
const currentUser = JSON.parse(getCurrentUser());
require('./report.scss');

class PostReportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trigger: false,
      isPostReport: this.props.isPostReport,
      postId: this.props.postId,
      category: '',
      reason: '',
      currentUser,
    };
    this.triggerModal = this.triggerModal.bind(this);
  }

  triggerModal(e, postId) {
    e.preventDefault();
    const trigger = !this.state.trigger;
    this.setState({ trigger });
    this.props.parentCallback({
      postId,
      isPostReport: false,
    });
  }

  handleSubmit(e, postId) {
    e.preventDefault();
    const err = [];
    if (this.state.category === '') {
      err.push('Category is required');
    }
    if (
      typeof this.state.reason === 'string' &&
      this.state.reason.trim().length === 0
    ) {
      err.push('Reason is required');
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = {
        post_id: postId,
      };

      getPostData(formData).then(async (res) => {
        getUserInfo({ userid: res.userid }).then(
          async (user_resp) => {
            createReport({
              post_id: postId,
              post_username: user_resp.username,
              post_email: user_resp.email,
              username: currentUser.username,
              email: currentUser.email,
              title: res.text,
              type: 'post_report',
              category: this.state.category,
              message: this.state.reason,
            }).then(
              async (productReportResp) => {},
              (err) => {
                err.push(err.message);
              }
            );
          },
          (err) => {
            err.push(err.message);
          }
        );
      });

      const link = `post/${postId}`;
      postReport({
        id: postId,
        type: 'post',
        link,
        category: this.state.category,
        reason: this.state.reason,
      }).then(
        async (resp) => {
          alertBox(true, resp.message, 'success');
          this.props.parentCallback({
            postId,
            isPostReport: false,
            status: 'success',
          });
        },
        (error) => {
          alertBox(true, error.data.message);
          this.props.parentCallback({
            postId,
            isPostReport: true,
            status: 'fail',
          });
        }
      );
    }
  }

  handleInput = (e) => {
    let val = e.target.value;
    const { name } = e.target;
    if (name === 'reason') {
      if (val.length > 150) {
        alertBox(true, 'Reason must be less than 150 characters');
        val = val.substring(0, 150);
      }
      this.setState({
        [name]: val,
      });
    }
  };

  handleChange = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    this.setState({
      [name]: val,
    });
  };

  render() {
    return (
      <div className="modal-1 user-report-modal active">
        <div
          className="overlay close-modal"
          // onClick={(e) => this.triggerModal(e, this.state.postId)}
        />

        <div className="content">
          <div className="headTitle">
            <span
              className="close"
              onClick={(e) => this.triggerModal(e, this.props.postId)}
            >
              &times;
            </span>
          </div>

          <div className="modal-content">
            <h2>Report Post</h2>
            <form
              onSubmit={(e) => this.handleSubmit(e, this.props.postId)}
              method="post"
            >
              <div className="form-group">
                <ul
                  className="radio-1"
                  value={this.state.category}
                  onClick={(e) => this.handleChange(e)}
                >
                  <li>
                    <input
                      type="radio"
                      id="Violence"
                      name="category"
                      value="Violence"
                    />
                    <label htmlFor="Violence"> Violence. </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="Racism_Hatespeech"
                      name="category"
                      value="Racism / Hatespeech"
                    />
                    <label htmlFor="Racism_Hatespeech">
                      {' '}
                      Racism / Hatespeech{' '}
                    </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="Pornographic"
                      name="category"
                      value="Pornographic"
                    />
                    <label htmlFor="Pornographic"> Pornographic </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="Spam"
                      name="category"
                      value="Spam"
                    />
                    <label htmlFor="Spam"> Spam </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="Other"
                      name="category"
                      value="Other"
                    />
                    <label htmlFor="Other"> Other </label>
                  </li>
                </ul>
              </div>
              <div className="form-group">
                <textarea
                  type="text"
                  placeholder="Reason"
                  className="form-control"
                  name="reason"
                  onChange={this.handleInput}
                  value={this.state.reason}
                />
              </div>

              <div className="from-group pull-right mt-3">
                <Button
                  variant="secondaryBtn"
                  size="compact me-1"
                  onClick={(e) => this.triggerModal(e, this.props.postId)}
                >
                  Cancel
                </Button>
                <Button variant="primaryBtn" size="compact wallet-btn ms-1">
                  {' '}
                  Submit{' '}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default PostReportModal;
