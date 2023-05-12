import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import Avatar from '../../../../assets/images/market-place/avatar7.png';
import AvatarThumb from '../../../../assets/images/market-place/avatar-thumb.png';
import { history } from '../../../../store';
import { getCurrentUser } from '../../../../http/token-interceptor';
import {
  getChats,
  remove,
  searchData,
} from '../../../../http/product-chat-call';
import chatImg from '../../../../assets/images/market-place/chat.png';
import { alertBox } from '../../../../commonRedux';
import { productChatReceived } from '../../../../hooks/socket';

require('./chat-inbox.scss');

const currentUser = JSON.parse(getCurrentUser());

class ChatInbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiver: currentUser,
      newItem: this.props.newItem ? this.props.newItem : null,
      products: this.props.products,
      // senderId: '',
      receiverId: currentUser._id,
      is_from_search: false,
      messages: [],
      chatId: '',
    };
    // this.simulateClick = React.createRef()
  }

  componentDidMount() {
    productChatReceived((newMessage) => {
      this.getChatData();
      this.setState({
        newItem: newMessage,
      });
    });
    if (this.props.newItem) {
      this.setState({
        messages: [],
      });
      this.getChatData();
    }
    this.getChatData();
  }

  componentDidUpdate(previousProps, previousState) {
    if (
      previousProps.newItem &&
      this.props.newItem &&
      previousProps.newItem._id !== this.props.newItem._id
    ) {
      this.setState({
        messages: [],
      });
      this.getChatData();
    }

    if (
      previousState.newItem &&
      this.state.newItem &&
      previousState.newItem._id !== this.state.newItem._id
    ) {
      this.setState({
        messages: [],
      });
      this.getChatData();
    }
  }

  getChatData() {
    getChats({
      receiverId: this.state.receiverId,
    }).then(
      async (resp) => {
        this.setState(
          {
            messages: resp,
          },
          () => {
            // this.scrollToDivBottom();
          }
        );
      },
      (error) => {}
    );
  }

  simulateClick(e, key, chatId, products) {
    if (key === 0 && e) {
      // e.preventDefault();
      document.getElementsByClassName(chatId)[0].click();
    }
  }

  handleReport(e, chatId) {
    e.preventDefault();
    this.props.parentCallback({
      reportChatId: chatId,
      isUserReport: true,
    });
  }

  handleDelete(e, chatId) {
    e.preventDefault();
    const formData = {
      chatId,
    };
    const con = window.confirm('Are you sure want to delete?');
    if (con == true) {
      remove(formData).then(
        async (resp) => {
          this.props.parentCallback({
            type: 'remove',
            removeChatId: resp._id,
          });
          this.setState({
            messages: [],
          });
          this.getChatData();
          alertBox(true, 'Chat has been deleted!', 'success');
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    }
  }

  handleClick(e, chatId, products) {
    e.preventDefault();
    history.push({
      pathname: '/market-chat-with-seller-2',
      state: {
        products,
        chatId,
      },
    });
    this.state.messages.map((item, i) => {
      const element = document.getElementsByClassName(item._id)[0];
      if (element !== undefined && element !== null) {
        if (item._id === chatId) {
          element.classList.add('active');
        } else {
          element.classList.remove('active');
        }
      }
    });
  }

  handleChange = (e) => {
    const val = e.target.value;
    const { name } = e.target;

    this.setState({
      [name]: val,
    });
    const key = {
      [name]: val,
    };
    this.fetchAllChatBySearchKey(key);
  };

  fetchAllChatBySearchKey(key) {
    const err = [];
    const formData = {
      chat_name: key.chat_name,
    };
    searchData(formData).then(
      async (resp) => {
        this.setState({
          messages: resp,
          is_from_search: true,
        });
      },
      (error) => {
        err.push(error.message);
      }
    );
  }

  render() {
    return (
      <div className="widget-inbox">
        <div className="head">
          <div className="left">
            <h4> Inbox </h4>
          </div>

          <div className="right">
            <div className="search-1">
              <input
                name="chat_name"
                id="chat_name"
                type="text"
                placeholder="Search"
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>
        {this.state.messages.length > 0 ? (
          <div className="body">
            <div className="inbox-wrapper">
              {/* BEGIN :: INBOX */}
              {this.state.messages.map((data, key) => {
                if (
                  data.deleteChatUser1Id !== this.state.receiverId &&
                  data.deleteChatUser2Id !== this.state.receiverId
                ) {
                  return (
                    <div className={`inbox ${data._id}`} key={data._id}>
                      <div className="avatar">
                        <img src={Avatar} alt="" />
                        <span className="thumb">
                          <img src={AvatarThumb} alt="" />
                        </span>
                      </div>
                      <div
                        className="content"
                        // ref={(e) => this.simulateClick(e, key, data._id, data.products[0])}
                        onClick={(e) =>
                          this.handleClick(e, data._id, data.products[0])
                        }
                      >
                        <h4>
                          {' '}
                          {this.state.receiverId === data.sender[0]._id
                            ? data.receiver[0].name
                            : data.sender[0].name}{' '}
                        </h4>
                        <h5>
                          {' '}
                          {data.products[0] !== undefined
                            ? data.products[0].title
                            : ''}{' '}
                        </h5>
                        <h6>
                          <strong>
                            {data.clearChatUser1Id !== this.state.receiverId &&
                              data.clearChatUser2Id !== this.state.receiverId &&
                              data.lastMessage}
                          </strong>
                        </h6>

                        <span className="date">
                          <TimeAgo date={data.createdAt} />{' '}
                        </span>
                        <span className="dot">
                          <div className="dropdown-box dropdown-1">
                            <button className="btn-icon">
                              {' '}
                              <i className="fa fa-ellipsis-v" />{' '}
                            </button>
                            <ul className="bg-lite">
                              <li>
                                {' '}
                                <Link
                                  onClick={(e) =>
                                    this.handleReport(e, data._id)
                                  }
                                  className="report"
                                >
                                  <i className="fa fa-exclamation-circle" />
                                  <span className="m-1">Report</span>
                                </Link>{' '}
                              </li>
                              <li>
                                {' '}
                                <Link
                                  onClick={(e) =>
                                    this.handleDelete(e, data._id)
                                  }
                                  className="delete"
                                >
                                  {' '}
                                  Delete{' '}
                                </Link>{' '}
                              </li>
                            </ul>
                          </div>
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
              {/* END :: INBOX */}
            </div>
          </div>
        ) : this.state.is_from_search ? (
          <div className="body empty">
            <div className="auto">
              <img src={chatImg} alt="" />
              <h3> Not Found! </h3>
            </div>
          </div>
        ) : (
          <div className="body empty">
            <div className="auto">
              <img src={chatImg} alt="" />
              <h3> No Messages, Yet </h3>
              <p>
                {' '}
                No messages in your inbox yet!Start chatting with your sellers
                by selectinga particular product{' '}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ChatInbox;
