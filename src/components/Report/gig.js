import React, { Component } from 'react';

import { alertBox } from '../../commonRedux';
import Button from '../Button';
import { getGigData } from '../../http/gig-calls';
import { postReport } from '../../http/http-calls';
import { getUserInfo } from '../../http/post-calls';
// import { get } from "../../../../http/post-calls";
import { getCurrentUser } from '../../http/token-interceptor';
import { createReport } from '../../http/wallet-calls';
// import { postReport } from '../../../../http/wallet-calls';
const currentUser = JSON.parse(getCurrentUser());
require('./report.scss');

class GigReportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trigger: false,
      isGigReport: this.props.isGigReport,
      gigId: this.props.gigId,
      type: this.props.type,
      category: '',
      reason: '',
      currentUser,
    };
    this.triggerModal = this.triggerModal.bind(this);
  }

  triggerModal(e, gigId) {
    e.preventDefault();
    const trigger = !this.state.trigger;
    this.setState({ trigger });
    this.props.parentCallback({
      gigId,
      isGigReport: false,
    });
  }

  handleSubmit(e, gigId) {
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
        gig_id: gigId,
      };
      if (this.state.type) {
        formData.type = this.state.type;
      }

      getGigData(formData).then(
        async (res) => {
          getUserInfo({ userid: res.userid }).then(
            async (user_resp) => {
              createReport({
                post_id: gigId,
                post_username: user_resp.username,
                post_email: user_resp.email,
                username: currentUser.username,
                email: currentUser.email,
                title: res.subject,
                type: 'gig_report',
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

          const link = `passionomy/gig/${res.subject}`;
          postReport({
            id: gigId,
            type: 'gig',
            link,
            category: this.state.category,
            reason: this.state.reason,
          }).then(
            async (resp) => {
              alertBox(true, resp.message, 'success');
              this.props.parentCallback({
                gigId,
                isGigReport: false,
                status: 'success',
              });
            },
            (error) => {
              alertBox(true, error.data.message);
              this.props.parentCallback({
                gigId,
                isGigReport: true,
                status: 'fail',
              });
            }
          );
        },
        (error) => {
          err.push(error.message);
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
          // onClick={(e) => this.triggerModal(e, this.state.gigId)}
        />

        <div className="content">
          <div className="headTitle">
            <span
              className="close"
              onClick={(e) => this.triggerModal(e, this.props.gigId)}
            >
              &times;
            </span>
          </div>

          <div className="modal-content">
            <h2>Report Gig</h2>
            <form
              onSubmit={(e) => this.handleSubmit(e, this.props.gigId)}
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
                  onClick={(e) => this.triggerModal(e, this.props.gigId)}
                >
                  Cancel
                </Button>
                <Button variant="primaryBtn" size="compact ms-1">
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

export default GigReportModal;
