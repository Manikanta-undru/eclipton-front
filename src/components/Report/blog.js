import React, { Component } from 'react';

import { alertBox } from '../../commonRedux';
import Button from '../Button';
import { getBlogData } from '../../http/blog-calls';
import { postReport } from '../../http/http-calls';
import { getUserInfo } from '../../http/post-calls';
// import { get } from "../../../../http/post-calls";
import { getCurrentUser } from '../../http/token-interceptor';
import { createReport } from '../../http/wallet-calls';
// import { postReport } from '../../../../http/wallet-calls';
const currentUser = JSON.parse(getCurrentUser());
require('./report.scss');

class BlogReportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trigger: false,
      isBlogReport: this.props.isBlogReport,
      blogId: this.props.blogId,
      category: '',
      reason: '',
      currentUser,
    };
    this.triggerModal = this.triggerModal.bind(this);
  }

  triggerModal(e, blogId) {
    e.preventDefault();
    const trigger = !this.state.trigger;
    this.setState({ trigger });
    this.props.parentCallback({
      blogId,
      isBlogReport: false,
    });
  }

  handleSubmit(e, blogId) {
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
        blog_id: blogId,
      };

      getBlogData(formData).then(async (res) => {
        getUserInfo({ userid: res.userid }).then(
          async (user_resp) => {
            createReport({
              post_id: blogId,
              post_username: user_resp.username,
              post_email: user_resp.email,
              username: currentUser.username,
              email: currentUser.email,
              title: res.subject,
              type: 'blog_report',
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

      const link = `blog/${blogId}`;
      postReport({
        id: blogId,
        type: 'blog',
        link,
        category: this.state.category,
        reason: this.state.reason,
      }).then(
        async (resp) => {
          alertBox(true, resp.message, 'success');
          this.props.parentCallback({
            blogId,
            isBlogReport: false,
            status: 'success',
          });
        },
        (error) => {
          alertBox(true, error.data.message);
          this.props.parentCallback({
            blogId,
            isBlogReport: true,
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
        alertBox(true, 'Reason must be less than 50 characters');
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
          // onClick={(e) => this.triggerModal(e, this.state.blogId)}
        />

        <div className="content">
          <div className="headTitle">
            <span
              className="close"
              onClick={(e) => this.triggerModal(e, this.props.blogId)}
            >
              &times;
            </span>
          </div>

          <div className="modal-content">
            <h2>Report Blog</h2>
            <form
              onSubmit={(e) => this.handleSubmit(e, this.props.blogId)}
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
                  onClick={(e) => this.triggerModal(e, this.props.blogId)}
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

export default BlogReportModal;
