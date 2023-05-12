import React from 'react';
import ContentEditable from 'react-contenteditable';
import Loader from 'react-spinners/BarLoader';
import { createPost, getUsersForTag } from '../../http/http-calls';
import { twitterTweet } from '../../http/twitter-calls';
import { image, video, file } from '../../config/constants';
import { alertBox } from '../../commonRedux';
import { getCurrentUser } from '../../http/token-interceptor';
import { profilePic } from '../../globalFunctions';
import UrlPreview from './UrlPreview';
import DebouncedInput from '../DebouncedInput/DebouncedInput';

const currentUser = JSON.parse(getCurrentUser());

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.postFileInput = React.createRef();
    this.reactTags = React.createRef();
    this.contentEditable = React.createRef();
    this.state = { html: '<b>Hello <i>World</i></b>' };

    this.state = {
      twitterID: 0,
      twitter: false,
      text: '',
      loadTxt: '',
      url: '',
      profileImg: '',
      postImgs: [],
      postAccept: '',
      visibility: 'public',
      tags: [],
      toggleTagInput: false,
      suggestions: [],
      displaySelectedItem: [],
      tagResults: [],
      tagLoading: false,
    };

    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.extractUrl = this.extractUrl.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.removeURL = this.removeURL.bind(this);
    this.dropDownRef = React.createRef();
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleClickOutsideCreatePost);

    // getCSRF()
    // 	.then(async resp => {
    // 		localStorage.setItem('csrf', resp._csrf);
    // 	}, error => {
    //
    // 	});
    // if(this.props.currentUser.twitterID != undefined && this.props.currentUser.twitterID != null){
    //	this.setState({twitterID: this.props.currentUser.twitterID});
    // }
  }

  componentWillUnmount() {
    document.body.removeEventListener(
      'click',
      this.handleClickOutsideCreatePost
    );
  }

  handleClickOutsideCreatePost = (e) => {
    if (!this.dropDownRef.current.contains(e.target)) {
      this.setState({ toggleTagInput: false });
    }
  };

  enableUpload = (acceptExt) => {
    const accept = acceptExt.join(',');
    this.setState({ postAccept: accept }, () => {
      this.postFileInput.current.click();
    });
  };

  changeTwitter = () => {
    this.setState({
      twitter: !this.state.twitter,
    });
  };

  changeVisibility = () => {
    this.setState({
      visibility: this.state.visibility === 'public' ? 'onlyme' : 'public',
    });
  };

  removeURL = () => {
    this.setState({
      url: '',
    });
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.setState({
        text: `${this.state.text}\n`,
      });
    }
  };

  clearCreatPostInputs = () => {
    this.setState({
      text: '',
      url: '',
      profileImg: '',
      tags: [],
      postImgs: [],
      postAccept: '',
      displaySelectedItem: [],
      visibility: 'public',
    });
  };

  switchLoader2 = (txt = '') => {
    this.setState({
      loadTxt: txt,
    });
  };

  removeSelected = (i) => {
    const new_array = this.state.displaySelectedItem;
    new_array.splice(i, 1);
    this.setState({
      displaySelectedItem: new_array,
      postImgs: [],
    });
  };

  convertToPlain = (html) => {
    // Create a new div element
    const tempDivElement = document.createElement('div');

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || '';
  };

  post = () => {
    const formData = new FormData();
    let text = this.state.text.trim();
    // !this.state.postImgs.length && (text == null || text == '')
    if (text == null || text == '') {
      alertBox(true, 'You need to type something!');
    } else if (text.length > 250) {
      alertBox(true, 'Post content must be within 250');
    } else {
      text = text.replace('&nbsp;', '');
      // text = this.convertToPlain(text);
      text = text.replace(/\n/g, '<br/>');
      text = text.replace(/<div>|<\/div>/gi, (match) => {
        if (match === '<div>') {
          return '<br/>';
        }
        return '';
      });
      for (let i = 0; i < this.state.postImgs.length; i++) {
        formData.append(`postImgs[${i}]`, this.state.postImgs[i]);
      }
      formData.append('text', text);
      formData.append('subject', 'Eclipton');
      formData.append('taggPeople', JSON.stringify(this.state.tags));
      formData.append('privacy', this.state.visibility);
      formData.append('twitterPost', this.state.twitter);
      formData.append('url', this.state.url);
      this.switchLoader2('Your post is being created...');

      createPost(formData).then(
        async (resp) => {
          if (resp.success) {
            if (resp.post) {
              if (this.props.setState) {
                this.props.setState('latestpost', resp.post);
              }
            }
            if (
              this.props.history.location.pathname == '/profile' ||
              this.props.history.location.pathname == '/profile/feed/all' ||
              this.props.history.location.pathname == '/profile/feed/hidden' ||
              (this.props.history.location.pathname == '/profile/feed/saved' &&
                this.state.visibility == 'public')
            ) {
              if (this.props.setState) {
                this.props.setState('currentTab', '1');
                this.props.setState('filter', '');
              }
            }
            if (this.state.visibility != 'public') {
              if (this.props.setState) {
                this.props.setState('currentTab', '1');
                this.props.setState('filter', 'hidden');
              }
            }
            if (this.state.twitter) {
              twitterTweet({ text: this.state.text }).then(async (resp) => {
                this.clearCreatPostInputs();
                this.setState({
                  tweet: false,
                });
              });
            } else {
              this.clearCreatPostInputs();
            }
          }
          this.setState({ toggleTagInput: false });
          this.switchLoader2();
          // window.location.href = ""
        },
        (error) => {
          console.log('upload failed', error);
          this.switchLoader2();
        }
      );
    }
  };

  handleChangeImage(e) {
    this.setState(
      { postImgs: [...this.state.postImgs, ...e.target.files] },
      () => {
        for (let i = 0; i < this.state.postImgs.length; i++) {
          if (
            this.state.postImgs[i] !== undefined &&
            this.state.postImgs[i] != '' &&
            this.state.postImgs[i].name !== undefined
          ) {
            const getExt = this.state.postImgs[i].name.split('.').pop();
            if (
              !this.state.postImgs[i].name.match(/\.(png|jpg|jpeg|gif|mp4)$/)
            ) {
              this.setState({ postImgs: [] });
              alertBox(true, 'Post Upload image must in png,jpg,jpeg,gif,mp4');
            } else if (this.state.postImgs[i].size > 2000000) {
              this.setState({ postImgs: [] });
              alertBox(true, 'Please upload the attachment less than 2 MB');
            } else {
              const displaySelectedItem = [];
              if (image.indexOf(`.${getExt}`) !== -1) {
                const imgTag = () => (
                  <img
                    className="displayPostImg"
                    src={URL.createObjectURL(this.state.postImgs[i])}
                  />
                );
                displaySelectedItem.push(imgTag());
              } else if (video.indexOf(`.${getExt}`) !== -1) {
                const videoTag = () => (
                  <video className="displayPostImg" controls>
                    <source
                      src={URL.createObjectURL(this.state.postImgs[i])}
                      type="video/mp4"
                    />
                  </video>
                );

                displaySelectedItem.push(videoTag());
              } else if (file.indexOf(`.${getExt}`) !== -1) {
                displaySelectedItem.push('1 File Selected');
              }
              this.setState({
                displaySelectedItem: [
                  ...this.state.displaySelectedItem,
                  ...displaySelectedItem,
                ],
              });
            }
          }
        }
      }
    );
    e.target.value = '';
  }

  // handleChange = (evt) => {
  // 	const { name, value } = evt.target;
  // 	this.setState({ [name]: value }, () => {
  // 	});
  // }
  extractUrl = (text) => {
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(expression);
    return text.match(regex);
  };

  htmlToText = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent; // Or return temp.innerText if you need to return only visible text. It's slower.
  };

  handleChange = (evt) => {
    // var txt  = this.htmlToText(evt.target.value);
    const txt = this.contentEditable.current.innerHTML;
    const temp = this.extractUrl(txt);
    this.setState({ text: txt, url: temp });
  };

  onDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  }

  onAddition(tag) {
    if (this.state.tags.find((x) => x._id == tag._id)) {
      return false;
    }
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  }

  toggleTag = () => {
    if (!this.state.toggleTagInput) {
      this.setState({ tagLoading: true });
      getUsersForTag({ key: '' }, true).then(
        async (resp) => {
          const uniqueIds = new Set();
          const cleanArray = resp.filter((item) => {
            if (item._id === currentUser._id) {
              return false; // exclude current user
            }
            if (uniqueIds.has(item._id)) {
              return false; // exclude duplicates
            }
            uniqueIds.add(item._id); // add unique _id to Set
            return true;
          });
          this.setState(
            { suggestions: cleanArray, tagResults: cleanArray },
            () => {
              this.setState({ tagLoading: false });
            }
          );
        },
        (error) => {}
      );
    }
    this.setState({ toggleTagInput: !this.state.toggleTagInput });
  };

  handleTagSearch = (text) => {
    const regex = new RegExp(text, 'gi');
    let results = [];
    if (this.state.suggestions) {
      results = this.state.suggestions.filter((user) =>
        user.name?.match(regex)
      );
      this.setState({ tagResults: results });
    }
  };

  render() {
    const {
      postAccept,
      visibility,
      tags,
      toggleTagInput,
      displaySelectedItem,
      twitter,
    } = this.state;

    return (
      <div className="new-create-post">
        <div className="row p-2 p-sm-3">
          <div className="d-flex flex-column flex-sm-row">
            <div className=" h-100 me-sm-3 mx-auto my-3 my-sm-0">
              <img
                className="create-post-profile"
                src={profilePic(
                  this.props.currentUser?.avatar,
                  this.props.currentUser?.name
                )}
                alt="profile"
              />
            </div>
            <div className="w-100">
              <div className="clearfix d-flex flex-column align-items-center w-100 mb-4">
                <ContentEditable
                  // onKeyDown={this.handleKeyPress}
                  placeholder="What's on your mind?"
                  name="text"
                  className="w-100 new-form-control"
                  innerRef={this.contentEditable}
                  html={this.state.text} // innerHTML of the editable div
                  disabled={false} // use true to disable editing
                  onChange={this.handleChange} // handle innerHTML change
                  tagName="div" // Use a custom HTML tag (uses a div by default)
                />
                {this.state.url &&
                  this.state.url.map((url) => (
                    <UrlPreview url={url} key={url} />
                  ))}
              </div>
              {displaySelectedItem && displaySelectedItem.length > 0 && (
                <div className="create-post-media mb-4">
                  {displaySelectedItem?.map((item, i) => (
                    <div className="image-item" key={i}>
                      <span
                        className="close-btn"
                        onClick={() => this.removeSelected(i)}
                      >
                        <i className="fa fa-times" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              )}
              {tags.length > 0 && (
                <ul className="create-post-tags d-flex align-items-center">
                  {tags.map((value, index) => (
                    <li
                      onClick={() => this.onDelete(index)}
                      className="tagged-pill"
                      key={index}
                    >
                      <img src={profilePic(value?.avatar, value?.name)} />
                      {value.name}{' '}
                      <span className="close-btn">
                        <i className="fa fa-times" />
                      </span>{' '}
                    </li>
                  ))}
                </ul>
              )}
              <div className="create-post-options d-flex justify-content-between mt-2">
                <div className="d-none">
                  <input
                    type="file"
                    multiple
                    name="file"
                    accept={postAccept}
                    onChange={this.handleChangeImage}
                    ref={this.postFileInput}
                  />
                </div>
                <div
                  type="button"
                  onClick={(e) => this.enableUpload(image.concat(video))}
                >
                  <span>
                    <i className="fa fa-picture-o" />
                    Photo/Video
                  </span>
                </div>
                <div className="tag-user" ref={this.dropDownRef}>
                  <span onClick={() => this.toggleTag()}>
                    <i className="	fa-solid fa-user-tag" />
                    Tag Friends
                  </span>
                  {toggleTagInput && (
                    <div className="user-tag-dropdown">
                      <DebouncedInput
                        className="w-100"
                        placeholder="Search your friends"
                        onChange={this.handleTagSearch}
                      />
                      <ul className="user-search-result">
                        {this.state.tagResults?.length
                          ? this.state.tagResults.slice(0, 10).map((user) => (
                              <li
                                key={user.name}
                                onClick={() => this.onAddition(user)}
                              >
                                <img
                                  src={profilePic(user.avatar, user.name)}
                                  key={user}
                                />
                                <span key={user}>{user.name}</span>
                              </li>
                            ))
                          : !this.state.tagLoading && (
                              <p className="no-friends">No friends found</p>
                            )}
                        {this.state.tagLoading && (
                          <div className="loading-screen">
                            <div className="placeholder-glow my-2 rounded-sm">
                              <div
                                className="placeholder"
                                style={{ height: '30px', width: '100%' }}
                              />
                            </div>
                          </div>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div onClick={this.changeVisibility} className=" pointer">
                  {visibility == 'public' ? (
                    <span>
                      {' '}
                      <i className="fa-solid fa fa-eye" />
                      Visibility
                    </span>
                  ) : (
                    <span>
                      <i className="fa-sharp fa-solid fa fa-eye-slash" />
                      Visibility
                    </span>
                  )}
                </div>
                {this.state.twitterID != null && this.state.twitterID > 0 && (
                  <div className="">
                    <img
                      className="pointer smallIcon"
                      onClick={this.changeTwitter}
                      src={require(`../../assets/images/${
                        twitter ? 'twitter-filled.svg' : 'twitter-outline.svg'
                      }`)}
                    />
                    <span className="m-1" />
                  </div>
                )}
                <button
                  className="primaryBtn"
                  onClick={this.post}
                  disabled={this.state.loadTxt}
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          {this.state.loadTxt != '' && (
            <div className="d-block w-100">
              <small className="text-center d-block loading-text">
                {this.state.loadTxt}
              </small>
              <Loader width="100%" color="#5931ea" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CreatePost;
