import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import TimeAgo from 'react-timeago';
import A from '../../components/A';
import { alertBox } from '../../commonRedux';
import Button from '../../components/Button';

import Modal from '../../components/Popup';
import { hasSpecialCharacters, profilePic } from '../../globalFunctions';

import { getTagUsers } from '../../http/http-calls';
import {
  getCurrentChat,
  getMessageNotifications,
  setMessageNotificationsViewed,
  exitGroup,
  deleteChatAll,
  pinChat,
  createChatGroups,
  deleteGroup,
} from '../../http/message-calls';
import {
  connectSocket,
  messageNotificationReceived,
  groupConnected,
  grpMessageReceived,
  GroupCreateNotification,
} from '../../hooks/socket';
import './styles.scss';
import ChatWindow from './ChatWindow';
import GroupChatWindow from './GroupChatWindow';
import DebouncedInput from '../../components/DebouncedInput/DebouncedInput';

class ChatIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      friends: 0,
      refbal: 0,
      posts: 0,
      currentTab: 0,
      latestpost: {},
      filter: '',
      about: 0,
      generalEdit: false,
      profilePic: '',
      refreshing: false,
      modal: false,
      modal2: false,
      messages: [],
      searchMessages: [],
      sortedMsgArrayByPin: [],
      chatWindowMsg: null,
      reloadChatWind: false,
      msgNew: 0,
      users: [],
      searchUsers: [],
      selectedUsers: [],
      searchUsersforGroup: [],
      groupname: '',
      subject: '',
      files: [],
      crop: {
        aspect: 16 / 16,
        width: 230,
      },
      cropedImagesrc: '',
      isloadcreate: false,
    };
    this.myRef = React.createRef();
    this.myRef2 = React.createRef();
    this.charLimit = 15;
  }

  formatter(value, unit, suffix, date) {
    const diffInDays = Math.round(
      Math.abs((new Date() - date) / (24 * 60 * 60 * 1000))
    );
    if (diffInDays >= 7) {
      const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
        date
      );
      return formattedDate;
    }
    if (unit === 'second') {
      return `${value} s ago`;
    }
    if (unit === 'minute') {
      return `${value} m ago`;
    }
    if (unit === 'hour') {
      return `${value} h ago`;
    }
    return `${value} d ago`;
  }

  componentDidMount() {
    if (this.props.currentUser != undefined) {
      connectSocket(this.props.currentUser._id);
    }

    this.getData();
    this.fetchData();
    messageNotificationReceived((newMessage) => {
      // this.getData();
      const temp = this.state.sortedMsgArrayByPin;
      const foundIndex = temp.findIndex((x) => x._id == newMessage._id);
      if (foundIndex == -1) {
        temp.push(newMessage);
      } else {
        // temp[foundIndex] = newMessage;
        temp[foundIndex].lastMessage = newMessage.lastMessage;
        temp[foundIndex].lastSentId = newMessage.lastSentId;
        temp[foundIndex].unread = newMessage.unread;
        temp[foundIndex].updatedAt = newMessage.updatedAt;
        // temp[foundIndex]['']
        // temp[foundIndex]['unread'] += 1;
      }
      let neww = this.state.msgNew + 1;
      if (
        this.state.chatWindowMsg &&
        this.state.chatWindowMsg.isGroup == false &&
        this.state.chatWindowMsg.user2._id == newMessage.user2._id
      ) {
        setMessageNotificationsViewed({
          _id: this.props.currentUser._id,
          chatid: newMessage._id,
        });
        temp[foundIndex].unread = 0;
        neww = 0;
      }

      this.setState({
        messages: temp,
        msgNew: neww,
        reloadChatWind: true,
        sortedMsgArrayByPin: temp,
      });
    });

    grpMessageReceived((newMessage) => {
      const temp = this.state.sortedMsgArrayByPin;
      // var temp = this.state.messages;
      const foundIndex = temp.findIndex((x) => x._id == newMessage.chatId);
      if (foundIndex != -1) {
        temp[foundIndex].groupConversation.push(newMessage.conversation);
      }

      let neww = this.state.msgNew + 1;
      if (this.state.chatWindowMsg._id == newMessage.chatId) {
        setMessageNotificationsViewed({
          _id: this.props.currentUser._id,
          chatid: newMessage._id,
          isgroup: true,
        });
        temp[foundIndex].unread = 0;
        neww = 0;
      } else {
        temp[foundIndex].unread = temp[foundIndex].unread + 1;
      }

      this.setState({
        messages: temp,
        msgNew: neww,
        reloadChatWind: true,
        sortedMsgArrayByPin: temp,
      });
    });

    GroupCreateNotification((newMessage) => {
      if (newMessage.senderId != this.props.currentUser._id) {
        this.getData();
      }
      // groupConnected(this.props.currentUser.name, newMessage.chatId);
      //   var temp = this.state.messages;
      //   var foundIndex = temp.findIndex(x =>
      //     x._id == newMessage.chatId
      //   );
      //   if (foundIndex != -1) {
      //     temp[foundIndex].groupConversation.push(newMessage.conversation);
      //   }

      //   var neww = this.state.msgNew + 1;
      //   if (this.state.chatWindowMsg._id == newMessage.chatId) {
      //     setMessageNotificationsViewed({ _id: this.props.currentUser._id, chatid: newMessage._id, isgroup: true });
      //     temp[foundIndex]['unread'] = 0;
      //     neww = 0;
      //   }

      //   this.setState({
      //     messages: temp,
      //     msgNew: neww,
      //     reloadChatWind: true
      //   })
    });
  }

  handleCallbackChat = (data) => {
    if (data && data.isNewMessage) {
      this.getData(data.isNewMessage, data.currantChatId);
    }
  };

  openChat = () => {
    this.getData();
    this.fetchData();
    this.setState({ modal: !this.state.modal, selectedUsers: [] });
  };

  loadChatMsgWindow = (r) => {
    if (r.isEmptyChat) {
      this.setState({ reloadChatWind: false });
      getCurrentChat({ id: r._id }).then(
        (resp) => {
          this.setState({ chatWindowMsg: resp, reloadChatWind: true });
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    } else {
      this.setState({ chatWindowMsg: r, reloadChatWind: false });
      setTimeout(() => {
        this.setState({ reloadChatWind: true }); // true/false toggle
        if (r.subject) {
          setMessageNotificationsViewed({
            _id: this.props.currentUser._id,
            chatid: r._id,
            isgroup: true,
          });
          // this.state.messages.find(x => x._id == r._id).unread = 0;
          const temp = this.state.sortedMsgArrayByPin;
          const foundIndex = temp.findIndex((x) => x._id == r._id);
          if (temp[foundIndex] !== undefined) {
            temp[foundIndex].unread = 0;
          }
          this.setState(
            {
              messages: temp,
              sortedMsgArrayByPin: temp,
              msgNew: 0,
            },
            () => {}
          );
        } else {
          setMessageNotificationsViewed({
            _id: this.props.currentUser._id,
            chatid: r._id,
          });
          let uid = r.user1._id;
          if (uid == this.props.currentUser._id) {
            uid = r.user2._id;
          }
          getCurrentChat({ id: uid }).then(
            (resp) => {
              const temp = this.state.sortedMsgArrayByPin;
              const foundIndex = temp.findIndex((x) => x._id == r._id);
              temp[foundIndex].unread = 0;

              this.setState(
                {
                  messages: temp,
                  sortedMsgArrayByPin: temp,
                  msgNew: 0,
                },
                () => {}
              );
            },
            (error) => {
              alertBox(true, error.data.message);
            }
          );
        }
      }, 200);
    }
  };

  getData = (isFromChild = false, currantChatIdFromChild) => {
    getMessageNotifications({ page: 1, limit: 10 }).then(
      async (resp) => {
        if (resp.messages !== undefined && resp.messages.length > 0) {
          /* var emptyMessageIndex = resp.messages.findIndex(x => x.lastMessage == null);
        if (emptyMessageIndex > 0) {
          resp.messages.splice(emptyMessageIndex, 1);
        } */
          const timeSort = resp.messages.sort((a, b) => {
            let date1 = new Date(b.updatedAt);
            if (b.isGroup) {
              date1 =
                b.groupConversation.length > 0
                  ? new Date(
                      b.groupConversation[
                        b.groupConversation.length - 1
                      ].createdAt
                    )
                  : new Date();
            }
            let date2 = new Date(a.updatedAt);
            if (a.isGroup) {
              date2 =
                a.groupConversation.length > 0
                  ? new Date(
                      a.groupConversation[
                        a.groupConversation.length - 1
                      ].createdAt
                    )
                  : new Date();
            }
            return date1 - date2;
          });
          const sortedMessages = timeSort.sort(
            (a, b) =>
              Number(b.pinChat?.length || false) -
              Number(a.pinChat?.length || false)
          );

          sortedMessages.forEach((element) => {
            if (element.isGroup) {
              element.groupConversation.forEach((element1) => {
                if (
                  element1.senderId != this.props.currentUser._id &&
                  !element1.viewedBy.includes(this.props.currentUser._id)
                ) {
                  element1.unread = 1;
                  if (element.unread >= 1) {
                    element.unread++;
                  } else {
                    element.unread = 1;
                  }
                }
              });
            }
          });

          let currantChatMessage;
          if (isFromChild && currantChatIdFromChild) {
            currantChatMessage = sortedMessages.find(
              (x) => x._id == currantChatIdFromChild
            );
          } else {
            currantChatMessage = sortedMessages[0];
          }

          const queryParams = new URLSearchParams(this.props.location.search);
          let chatUserId = queryParams.get('u');
          if (chatUserId && chatUserId != '') {
            const findMessage = sortedMessages.find((x) => x._id == chatUserId);
            if (findMessage) {
              currantChatMessage = findMessage;
            }
          } else {
            chatUserId = currantChatMessage._id;
          }

          if (currantChatMessage.isGroup) {
            setMessageNotificationsViewed({
              _id: this.props.currentUser._id,
              chatid: chatUserId,
              isgroup: true,
            });
          } else if (
            currantChatMessage.lastSentId != this.props.currentUser._id
          ) {
            setMessageNotificationsViewed({
              _id: this.props.currentUser._id,
              chatid: chatUserId,
              isgroup: false,
            });
          }

          const temp = sortedMessages;
          const foundIndex = temp.findIndex((x) => x._id == chatUserId);
          temp[foundIndex].unread = 0;

          this.setState(
            {
              messages: temp,
              searchMessages: temp,
              msgNew: resp.total,
              chatWindowMsg: currantChatMessage,
              reloadChatWind: true,
            },
            () => {
              const sortedMsgArray = this.sortByPin(
                this.state?.messages.map((item) => item)
              );

              this.setState({ sortedMsgArrayByPin: sortedMsgArray });
            }
          );

          if (!isFromChild)
            for (let index = 0; index < temp.length; index++) {
              const element = temp[index];
              if (element.subject && element.subject != '') {
                groupConnected(this.props.currentUser.name, element._id);
              }
            }
        }
      },
      (error) => {}
    );
  };

  deleteChatAlls = (chat) => {
    deleteChatAll({ id: chat._id, isgroup: chat.isGroup || false }).then(
      async (resp) => {
        alertBox(true, 'Chat Deleted!', 'success');
        if (chat._id == this.state.chatWindowMsg._id) {
          this.setState({
            reloadChatWind: true,
          });
        }
        this.getData();
      },
      (error) => {}
    );
  };

  exitGroup = (chat) => {
    exitGroup({ id: chat._id }).then(
      async (resp) => {
        alertBox(true, 'You are exit from group!', 'success');
        if (chat._id == this.state.chatWindowMsg._id) {
          this.setState({
            reloadChatWind: true,
          });
        }
        this.getData();
      },
      (error) => {}
    );
  };

  deleteGroup = (chat) => {
    deleteGroup({ id: chat._id, isgroup: chat.isGroup || false }).then(
      async (resp) => {
        alertBox(true, 'Chat Group Deleted!', 'success');
        if (chat._id == this.state.chatWindowMsg._id) {
          this.setState({
            reloadChatWind: false,
          });
        }
        this.getData();
      },
      (error) => {}
    );
  };

  pinChats = (chat) => {
    pinChat({ id: chat._id, pin: true, isgroup: chat.isGroup || false }).then(
      async (resp) => {
        alertBox(true, 'Chat Pined!', 'success');
        this.getData();
      },
      (error) => {}
    );
  };

  unPinChats = (chat) => {
    pinChat({ id: chat._id, pin: false, isgroup: chat.isGroup || false }).then(
      async (resp) => {
        alertBox(true, 'Chat removed pin!', 'success');
        this.getData();
      },
      (error) => {}
    );
  };

  fetchData = (key = '') => {
    getTagUsers({ key }, true).then(
      async (resp) => {
        this.setState({ users: resp, searchUsers: resp });
      },
      (error) => {}
    );
  };

  removeSelection = (userId) => {
    const selectedUser = this.state.selectedUsers.find(
      (user) => user._id === userId
    );
    const tempUsers = [...this.state.users];
    tempUsers.push(selectedUser);
    const updatedSelectedUsers = this.state.selectedUsers.filter(
      (user) => user._id !== userId
    );
    this.setState({
      users: tempUsers,
      searchUsers: tempUsers,
      selectedUsers: updatedSelectedUsers,
    });
  };

  selectUser = (userId) => {
    const temp = this.state.selectedUsers;
    temp.push(this.state.searchUsers.find((item) => item._id === userId));
    this.setState({ selectedUsers: temp });
    this.setState((prevState) => {
      const updatedArray = prevState.users.filter(
        (item) => item._id !== userId
      );
      const updatedSearchArray = prevState.searchUsers.filter(
        (item) => item._id !== userId
      );
      return { users: updatedArray, searchUsers: updatedSearchArray };
    });
  };

  submit = async (e, t) => {
    if (
      this.state.groupname != undefined &&
      this.state.groupname != null &&
      this.state.groupname.trim() != ''
    ) {
      if (
        this.state.subject === undefined ||
        this.state.subject === null ||
        this.state.subject.trim() === ''
      ) {
        alertBox(true, 'Please enter the subject.');
        return;
      }
      if (this.state.selectedUsers.length === 0) {
        alertBox(true, 'Please select the group members.');
        return;
      }
      if (
        hasSpecialCharacters(this.state.groupname) ||
        hasSpecialCharacters(this.state.subject)
      ) {
        alertBox(true, 'Please use alphabets and numbers only');
        return;
      }
      this.setState({ isloadcreate: true });

      const groupObject = {};
      groupObject.name = this.state.groupname;
      groupObject.subject = this.state.subject;
      groupObject.createdBy = this.props.currentUser._id;
      groupObject.members = [];
      for (let index = 0; index < this.state.selectedUsers.length; index++) {
        const element = this.state.selectedUsers[index];
        groupObject.members.push(element._id);
      }
      const formData = new FormData();
      formData.append('name', this.state.groupname);
      formData.append('subject', this.state.subject);
      formData.append('createdBy', this.props.currentUser._id);
      formData.append('members', JSON.stringify(groupObject.members));
      if (this.state.profilePic) {
        formData.append('files', this.state.profilePic);
      }
      createChatGroups(formData, true).then(
        async (resp) => {
          this.setState({ modal: !this.state.modal }); // true/false toggle
          alertBox(true, 'Group Created Successfully!', 'success');
          this.cleardataform();
          this.getData();
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    } else {
      alertBox(true, 'Please enter the name.');
    }
  };

  cleardataform = () => {
    this.setState({
      groupname: '',
      subject: '',
      profilePic: '',
      isloadcreate: false,
      cropedImagesrc: '',
      selectedUsers: [],
    }); // true/false toggle
  };

  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value }, () => {});
    if (value == '') {
      this.setState({ isFocus: false });
    } else {
      this.setState({ isFocus: true });
    }
  };

  handleFile = (event) => {
    this.setState({
      profilePic: event.target.files[0],
    });
  };

  selectModal = (info) => {
    this.setState({ modal2: !this.state.modal2 }); // true/false toggle
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    // this.makeClientCrop(crop);
  };

  getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    // As Base64 string
    const base64Image = canvas.toDataURL('image/jpeg');
    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = fileName;
          const returnData = {};
          returnData.base64Image = base64Image;
          returnData.canvasBlob = blob;
          resolve(returnData);
        },
        'image/jpeg',
        1
      );
    });
  };

  savePic = async () => {
    if (this.imageRef && this.state.crop.width && this.state.crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        this.state.crop,
        `${Date.now()}.jpeg`
      );

      this.setState({
        cropedImagesrc: croppedImageUrl.base64Image,
        profilePic: croppedImageUrl.canvasBlob,
        modal2: false,
      }); // true/false toggle
    }
  };

  copyThis = (e) => {
    const input = e.target.getAttribute('data-target');
    const val = document.getElementById(input).value;
    navigator.clipboard.writeText(val);
    alertBox(true, 'URL Copied!', 'success');
  };

  updateProfilePic = (e) => {
    const file = e.target.files[0];
    if (file.type.split('/')[0] === 'image') {
      this.setState({ profilePic: URL.createObjectURL(file), modal2: true });
    } else {
      alertBox(true, 'Please choose valid image files only');
    }
  };
  // i have two updateProfilePic function in my code, which one will be called?

  crop = (crop) => {
    this.setState({ crop });
  };

  sortByPin = (array) =>
    array.sort((a, b) => {
      const aIsPinned = Array.isArray(a.pinChat)
        ? a.pinChat.length > 0
        : a.pinChat;
      const bIsPinned = Array.isArray(b.pinChat)
        ? b.pinChat.length > 0
        : b.pinChat;

      if (aIsPinned && !bIsPinned) {
        return -1;
      }
      if (!aIsPinned && bIsPinned) {
        return 1;
      }
      const aHasGroupConversation =
        Array.isArray(a.groupConversation) && a.groupConversation.length === 0;
      const bHasGroupConversation =
        Array.isArray(b.groupConversation) && b.groupConversation.length === 0;

      if (aHasGroupConversation && !bHasGroupConversation) {
        return 1;
      }
      if (!aHasGroupConversation && bHasGroupConversation) {
        return -1;
      }
      const aUpdatedAt = new Date(a.updatedAt);
      const bUpdatedAt = new Date(b.updatedAt);

      if (aUpdatedAt < bUpdatedAt) {
        return 1;
      }
      if (aUpdatedAt > bUpdatedAt) {
        return -1;
      }
      const aCreatedAt = new Date(a.createdAt);
      const bCreatedAt = new Date(b.createdAt);

      if (aHasGroupConversation && bHasGroupConversation) {
        if (aCreatedAt < bCreatedAt) {
          return -1;
        }
        if (aCreatedAt > bCreatedAt) {
          return 1;
        }
        return 0;
      }
      return 0;
    });

  filterArray = (array, searchString, userId) => {
    console.log(searchString);
    return array.filter((obj) => {
      if (obj.name && obj.name.toLowerCase().includes(searchString)) {
        return true;
      }
      if (
        obj.user1 &&
        obj.user1.name &&
        obj.user1._id != userId &&
        obj.user1.name.toLowerCase().includes(searchString)
      ) {
        return true;
      }
      if (
        obj.user2 &&
        obj.user2.name &&
        obj.user2._id != userId &&
        obj.user2.name.toLowerCase().includes(searchString)
      ) {
        return true;
      }
      return false;
    });
  };

  handleInput = (val) => {
    if (val) {
      const value = val?.toLowerCase();
      if (value) {
        let searchedData = this.filterArray(
          this.state.messages,
          value,
          this.props.currentUser._id
        );
        // var searchedData = this.state.messages.filter(character => (!character.isEmptyChat && character.name && character.name.toLowerCase().includes(value)) || (character.user2 && character.user2.id != this.props.currentUser._id && character.user2.name && character.user2.name.toLowerCase().includes(value)) || (character.user1 && character.user1.id != this.props.currentUser._id && character.user1.name && character.user1.name.toLowerCase().includes(value)));
        const friendsSearch = [];
        // this.state.users.filter(character => (character.name?.toLowerCase().includes(value)));
        if (friendsSearch.length > 0) {
          friendsSearch.forEach((element) => {
            element.isEmptyChat = true;
            searchedData.push(element);
          });
        } else {
          searchedData = searchedData.filter((x) => !x.isEmptyChat);
        }

        if (searchedData && searchedData.length > 0) {
          this.setState({ sortedMsgArrayByPin: searchedData });
        } else if (searchedData != null && searchedData.length === 0) {
          this.setState({ sortedMsgArrayByPin: [] }); // Set messages to empty array
        } else {
          this.setState({ sortedMsgArrayByPin: this.state.searchMessages });
        }
      } else {
        this.setState({ sortedMsgArrayByPin: this.state.searchMessages });
      }
    } else {
      this.setState({
        sortedMsgArrayByPin: this.sortByPin(this.state.searchMessages),
      });
    }
  };

  handleInputGroup = (val) => {
    if (val) {
      const value = val;
      if (value) {
        const searchedData = [];
        const friendsSearch = this.state.users.filter((character) =>
          character.name.toLowerCase().includes(value.toLowerCase())
        );
        this.setState({ searchUsers: friendsSearch });
      }
    } else {
      this.setState({ searchUsers: this.state.users });
    }
  };

  render() {
    const user = this.props.currentUser;

    return (
      <div className="chatIndex">
        <div className="container-fluid chatContainer">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="chatProfile">
                <div className="chatProfile_top">
                  <div className="chatProfile_head">
                    <A href="/profile" className="left">
                      <img src={profilePic(user.avatar, user.name)} />
                      <div className="chatProfile_name">
                        <h5 className="pt-2">{user.name}</h5>
                      </div>
                    </A>
                    <div className="right">
                      <div className="right_count">
                        <img
                          src={require('../../assets/images/chat/chat_bubble_outline.svg')}
                        />
                        {/* {this.state.msgNew > 0 && <span>{this.state.msgNew}</span>} */}
                      </div>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="/profile">
                            - View Profile
                          </a>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={(e) => this.openChat()}
                          >
                            - New group
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatProfile_search">
                    <form>
                      <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fa fa-search" aria-hidden="true" />
                        </span>

                        <DebouncedInput
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          onChange={this.handleInput}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="chatProfile_pro d-flex flex-column">
                  {this.state.sortedMsgArrayByPin &&
                  this.state.sortedMsgArrayByPin?.length > 0 ? (
                    this.state.sortedMsgArrayByPin?.map((r, i) => (
                      <div key={r._id}>
                        {r.subject &&
                        r.subject != '' &&
                        r.subject != undefined ? (
                          <div
                            onClick={(e) => this.loadChatMsgWindow(r)}
                            className="chatProfile_pro_list d-flex justify-content-between"
                          >
                            <div className="left">
                              <div className="left_count">
                                <img src={profilePic(r.pic, r.name)} />
                                {r.unread > 0 && <span>{r.unread}</span>}
                              </div>
                              <div className="chatProfile_name">
                                <h5
                                  className={`${
                                    r.unread > 0 ? 'unread' : ''
                                  } pt-1`}
                                  title={r.name}
                                >
                                  {r.name.length > this.charLimit
                                    ? `${r.name.slice(0, this.charLimit)}...`
                                    : r.name}
                                </h5>

                                <span>
                                  {r.groupConversation[
                                    r.groupConversation.length - 1
                                  ]
                                    ? `${r.groupConversation[
                                        r.groupConversation.length - 1
                                      ].message.substring(0, 15)} ... `
                                    : ''}
                                </span>
                              </div>

                              {r.pinChat &&
                              r.pinChat.includes(this.props.currentUser._id) ? (
                                <span className="pinnedIcon">
                                  <i
                                    className="fa fa-thumb-tack"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : (
                                <span />
                              )}
                            </div>
                            <div className="right">
                              <p>
                                {r.groupConversation.length > 0 && (
                                  <TimeAgo
                                    formatter={this.formatter}
                                    date={
                                      new Date(
                                        r.groupConversation[
                                          r.groupConversation.length - 1
                                        ].createdAt
                                      )
                                    }
                                  />
                                )}
                              </p>
                              <div className="dropdown">
                                <i
                                  className="fa fa-ellipsis-v"
                                  aria-hidden="true"
                                  id="dropdownMenuButton"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                />
                                <div
                                  className="dropdown-menu dropdown-menu-right"
                                  aria-labelledby="dropdownMenuButton"
                                >
                                  {r.pinChat &&
                                  r.pinChat.includes(
                                    this.props.currentUser._id
                                  ) ? (
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={(e) => {
                                        this.unPinChats(r);
                                      }}
                                    >
                                      Unpin Chat
                                    </a>
                                  ) : (
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={(e) => {
                                        this.pinChats(r);
                                      }}
                                    >
                                      Pin Chat
                                    </a>
                                  )}
                                  {r.createdBy ===
                                  this.props.currentUser._id ? (
                                    <a
                                      className="dropdown-item redTxt"
                                      href="#"
                                      onClick={(e) => {
                                        this.deleteGroup(r);
                                      }}
                                    >
                                      Delete Group
                                    </a>
                                  ) : (
                                    ''
                                  )}
                                  <a
                                    className="dropdown-item redTxt"
                                    href="#"
                                    onClick={(e) => {
                                      this.deleteChatAlls(r);
                                    }}
                                  >
                                    Delete Chat
                                  </a>

                                  {r.createdBy != this.props.currentUser._id ? (
                                    <a
                                      className="dropdown-item redTxt"
                                      href="#"
                                      onClick={(e) => {
                                        this.exitGroup(r);
                                      }}
                                    >
                                      Exit from Group
                                    </a>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : r.isEmptyChat ? (
                          <div
                            onClick={(e) => this.loadChatMsgWindow(r)}
                            className="chatProfile_pro_list d-flex justify-content-between"
                          >
                            <div className="left">
                              <div className="left_count">
                                <img src={profilePic((r.avatar, r.name))} />
                              </div>
                              <div className="chatProfile_name">
                                <h5 className="pt-1" title={r.name}>
                                  {r.name.length > this.charLimit
                                    ? `${r.name.slice(0, this.charLimit)}...`
                                    : r.name}
                                </h5>
                              </div>
                            </div>
                            <div className="right" />
                          </div>
                        ) : (
                          <div
                            className="chatProfile_pro_list d-flex justify-content-between"
                            onClick={(e) => this.loadChatMsgWindow(r)}
                          >
                            <div className="left">
                              <div className="left_count">
                                <img
                                  src={profilePic(
                                    r.user1._id == this.props.currentUser._id
                                      ? r.user2.avatar
                                      : r.user1.avatar,
                                    r.user1._id == this.props.currentUser._id
                                      ? r.user2.name
                                      : r.user1.name
                                  )}
                                />
                                {r.unread >= 1 &&
                                  this.props.currentUser._id !=
                                    r.lastSentId && <span>{r.unread}</span>}
                                {/* {r.unread >0 && <span>{r.unread}</span>}  */}
                              </div>
                              <div className="chatProfile_name">
                                <h5
                                  className={`${
                                    r.unread >= 1 &&
                                    this.props.currentUser._id != r.lastSentId
                                      ? 'unread'
                                      : ''
                                  } pt-1`}
                                  title={
                                    r.user1._id === this.props.currentUser._id
                                      ? r.user2.name
                                      : r.user1.name
                                  }
                                >
                                  {(r.user1._id === this.props.currentUser._id
                                    ? r.user2.name
                                    : r.user1.name
                                  )?.length > this.charLimit
                                    ? `${(r.user1._id ===
                                      this.props.currentUser._id
                                        ? r.user2.name
                                        : r.user1.name
                                      ).slice(0, this.charLimit)}...`
                                    : r.user1._id === this.props.currentUser._id
                                    ? r.user2.name
                                    : r.user1.name}
                                </h5>
                                <span>
                                  {r.lastMessage != null &&
                                    `${r.lastMessage.substring(0, 15)} ... `}
                                </span>
                              </div>
                              {r.pinChat ? (
                                <span className="pinnedIcon">
                                  <i
                                    className="fa fa-thumb-tack"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : (
                                <span />
                              )}
                            </div>
                            <div className="right">
                              <p>
                                <TimeAgo
                                  formatter={this.formatter}
                                  date={new Date(r.updatedAt)}
                                />
                              </p>
                              <div className="dropdown">
                                <i
                                  className="fa fa-ellipsis-v"
                                  aria-hidden="true"
                                  id="dropdownMenuButton"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                />
                                <div
                                  className="dropdown-menu dropdown-menu-right"
                                  aria-labelledby="dropdownMenuButton"
                                >
                                  {r.pinChat ? (
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={(e) => {
                                        this.unPinChats(r);
                                      }}
                                    >
                                      Unpin Chat
                                    </a>
                                  ) : (
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={(e) => {
                                        this.pinChats(r);
                                      }}
                                    >
                                      Pin Chat
                                    </a>
                                  )}
                                  <a
                                    className="dropdown-item redTxt"
                                    href="#"
                                    onClick={(e) => {
                                      this.deleteChatAlls(r);
                                    }}
                                  >
                                    Delete
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-data-found">
                      <div>
                        <span>No messages</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-6">
              {this.state.reloadChatWind &&
              this.state.chatWindowMsg &&
              this.state.chatWindowMsg !== undefined &&
              this.state.chatWindowMsg != null ? (
                this.state.chatWindowMsg !== undefined &&
                this.state.chatWindowMsg._id !== undefined &&
                this.state.chatWindowMsg.subject &&
                this.state.chatWindowMsg.subject != '' ? (
                  <GroupChatWindow
                    parentCallback={this.handleCallbackChat}
                    chat={this.state.chatWindowMsg}
                    {...this.props}
                  />
                ) : (
                  <ChatWindow
                    parentCallback={this.handleCallbackChat}
                    chat={this.state.chatWindowMsg}
                    {...this.props}
                  />
                )
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
        {/* Modal Start */}
        <div className="">
          <Modal displayModal={this.state.modal} closeModal={this.openChat}>
            <div className="container p-2 px-4">
              <div className="row">
                <div className="col-md-12 p-0">
                  <h4 className="modalHeads">Create Group</h4>
                </div>
                <div className="modalGroupbg">
                  <div className="row">
                    <div className="col-md-6 p-0">
                      <div className="newGroupmodal">
                        <div className="newGroupmodal_top">
                          <div className="newGroupmodal_head">
                            <a href="#" className="left">
                              <div className="newGroupmodal_name">
                                <h5 className="pt-2">Add Group Members</h5>
                              </div>
                            </a>
                            <div className="right">
                              <div className="right_count">
                                <img
                                  src={require('../../assets/images/chat/chat_men_icon.svg')}
                                />
                                {this.state.selectedUsers &&
                                this.state.selectedUsers.length > 0 ? (
                                  <span>{this.state.selectedUsers.length}</span>
                                ) : (
                                  <div />
                                )}
                              </div>
                            </div>
                          </div>
                          {this.state.selectedUsers &&
                            this.state.selectedUsers.length > 0 && (
                              <div className="addMembers">
                                {this.state.selectedUsers &&
                                  this.state.selectedUsers.length > 0 &&
                                  this.state.selectedUsers.map((user, i) => (
                                    <div
                                      className="addMembers_box"
                                      key={indexedDB}
                                    >
                                      <img
                                        src={profilePic(user.avatar, user.name)}
                                      />
                                      <div className="addMembers_box_name">
                                        {user.name}
                                      </div>
                                      <div
                                        className="addMembers_box_close"
                                        onClick={(e) =>
                                          this.removeSelection(user._id)
                                        }
                                      >
                                        <i className="fa fa-times" />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          <div className="newGroupmodal_search">
                            <form>
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <i
                                    className="fa fa-search"
                                    aria-hidden="true"
                                  />
                                </span>

                                <DebouncedInput
                                  type="text"
                                  className="form-control"
                                  placeholder="Search"
                                  aria-label="Username"
                                  aria-describedby="basic-addon1"
                                  onChange={this.handleInputGroup}
                                />
                              </div>
                            </form>
                          </div>
                        </div>
                        <div className="newGroupmodal_pro">
                          {this.state.searchUsers &&
                          this.state.searchUsers.length > 0 ? (
                            this.state.searchUsers.map((user, i) => (
                              <div
                                className="newGroupmodal_pro_list d-flex justify-content-between"
                                key={i}
                              >
                                <div
                                  className="left"
                                  onClick={(e) => this.selectUser(user._id)}
                                >
                                  <div className="left_count">
                                    <img
                                      src={profilePic(user.avatar, user.name)}
                                    />
                                  </div>
                                  <div className="newGroupmodal_name">
                                    <h5 className="pt-1">{user.name} </h5>
                                    <span>{user.job || ''}</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="no-data-found d-flex justify-content-center p-5">
                              <div>
                                <span>No friends found</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 p-0">
                      <div className="groupDet">
                        <Modal
                          displayModal={this.state.modal2}
                          closeModal={this.selectModal}
                        >
                          <ReactCrop
                            src={this.state.profilePic}
                            crop={this.state.crop}
                            onChange={this.crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                          />
                          <div className="mt-3 text-end">
                            <Button
                              variant="secondaryBtn"
                              size="compact me-2"
                              onClick={this.selectModal}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primaryBtn"
                              size="compact"
                              onClick={this.savePic}
                            >
                              Save
                            </Button>
                          </div>
                        </Modal>

                        <form
                          onSubmit={(e) => this.submit(e, 0)}
                          className="groupForms"
                          method="post"
                        >
                          <div className="imageUpload">
                            <label>
                              {/* {
                                this.state.chatWindowMsg.subject && this.state.chatWindowMsg.subject != '' ? (
                                  <img src="" alt="" className="uploaded-image" />
                                ) : ( */}
                              {/* <img src={this.state.cropedImagesrc} alt="" className="uploaded-image" /> */}
                              {/* )
                              } */}

                              <div className="text-center grp_upload_profile">
                                {this.state.cropedImagesrc && (
                                  <img
                                    src={this.state.cropedImagesrc}
                                    alt=""
                                    className=""
                                  />
                                )}
                                <div className="grp_icon_overlay">
                                  <div>
                                    <i className="fa fa-camera grp_img_icon" />
                                    <h5>Add Group Icon</h5>
                                  </div>
                                </div>
                              </div>
                              <input
                                id="profilePic"
                                onChange={this.updateProfilePic}
                                accept="image/*"
                                data-required="image"
                                type="file"
                                name="image_name"
                                className="image-input"
                                data-traget-resolution="image_resolution"
                              />
                            </label>
                          </div>

                          <div className="form-group mb-3 mt-1">
                            <input
                              maxLength="30"
                              type="text"
                              className="form-control"
                              name="groupname"
                              onChange={(e) => {
                                this.handleChange(e);
                              }}
                              value={this.state.groupname}
                              aria-describedby="emailHelp"
                              placeholder="Enter group name"
                            />
                          </div>
                          <div className="form-group">
                            <textarea
                              maxLength="100"
                              className="form-control group-subject"
                              name="subject"
                              onChange={(e) => {
                                this.handleChange(e);
                              }}
                              value={this.state.subject}
                              rows="3"
                              placeholder="Enter subject"
                            />
                          </div>
                          {this.state.isloadcreate == false ? (
                            <button
                              type="button"
                              onClick={(e) => this.submit(e, 0)}
                              className="primaryBtn mt-3"
                            >
                              Create
                            </button>
                          ) : (
                            <button type="button" className="primaryBtn mt-3">
                              Creating
                            </button>
                          )}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <button onClick={(e) => this.openChat()} >Close</button> */}
          </Modal>
        </div>
        {/* Modal End */}
      </div>
    );
  }
}

export default ChatIndex;
