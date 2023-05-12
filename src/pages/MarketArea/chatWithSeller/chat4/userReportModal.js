import React, { Component } from 'react';

import CloseIcon from '../../../../assets/images/market-place/icons/close.png';
import { alertBox } from '../../../../commonRedux';
import Button from '../../../../components/Button';
import { postReport } from '../../../../http/http-calls';

require('../../_styles/market-area.scss');
require('../chat-with-seller.scss');

class UserReportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trigger: false,
      isUserReport: this.props.isUserReport,
      reportChatId: this.props.reportChatId,
      category: '',
      reason: '',
    };
    this.triggerModal = this.triggerModal.bind(this);
  }

  triggerModal(e, chatId) {
    e.preventDefault();
    const trigger = !this.state.trigger;
    this.setState({ trigger });
    this.props.parentCallback({
      reportChatId: chatId,
      isUserReport: false,
    });
  }

  handleSubmit(e, chatId) {
    e.preventDefault();
    const err = [];
    if (this.state.category === '') {
      err.push('Category is required');
    }
    if (this.state.reason === '') {
      err.push('Reason is required');
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const link = 'market-chat-with-seller-2';
      postReport({
        id: chatId,
        type: 'product_chat',
        link,
        category: this.state.category,
        reason: this.state.reason,
      }).then(
        async (resp) => {
          alertBox(true, resp.message, 'success');

          this.props.parentCallback({
            reportChatId: chatId,
            isUserReport: false,
          });
        },
        (error) => {
          alertBox(true, error.data.message);
          this.props.parentCallback({
            reportChatId: chatId,
            isUserReport: true,
          });
        }
      );
    }
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="modal-1 user-report-modal active">
          <div
            className="overlay close-modal"
            // onClick={(e) => this.triggerModal(e, this.state.reportChatId)}
          />

          <div className="content">
            <div className="head">
              <span
                className="close-modal icon-close-modal"
                onClick={(e) => this.triggerModal(e, this.state.reportChatId)}
              >
                <img src={CloseIcon} alt="" />
              </span>

              <h2> Report User </h2>
            </div>

            <div className="body">
              <form
                onSubmit={(e) => this.handleSubmit(e, this.state.reportChatId)}
                method="post"
              >
                <div className="form-group">
                  <ul
                    className="radio-1"
                    value={this.state.category}
                    onClick={(e) => this.setState({ category: e.target.name })}
                  >
                    <li>
                      <input
                        type="radio"
                        id="option1"
                        name="user_is_not_responding_properly"
                      />
                      <label htmlFor="option1">
                        {' '}
                        User is not responding properly.{' '}
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id="option2"
                        name="user_is_threating"
                      />
                      <label htmlFor="option2">
                        {' '}
                        This user is threating me.{' '}
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id="option3"
                        name="user_is_insulting"
                      />
                      <label htmlFor="option3">
                        {' '}
                        This user is insulting me.{' '}
                      </label>
                    </li>
                    <li>
                      <input type="radio" id="option4" name="user_is_spam" />
                      <label htmlFor="option4"> This user is spam. </label>
                    </li>
                    <li>
                      <input type="radio" id="option5" name="fraud_product" />
                      <label htmlFor="option5"> Fraud Product. </label>
                    </li>
                    <li>
                      <input type="radio" id="option6" name="other" />
                      <label htmlFor="option6"> Other </label>
                    </li>
                  </ul>
                </div>
                <div className="form-group">
                  <textarea
                    type="text"
                    placeholder="Reason"
                    className="form-control"
                    onChange={(e) => this.setState({ reason: e.target.value })}
                    value={this.state.reason}
                  />
                </div>

                <div className="from-group pull-right ms-auto me-2">
                  <Button
                    variant="secondary"
                    size="compact m-2"
                    onClick={(e) =>
                      this.triggerModal(e, this.state.reportChatId)
                    }
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" size="compact m-2">
                    {' '}
                    Submit{' '}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserReportModal;
