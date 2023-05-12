import React from 'react';
import * as group from '../../http/group-calls';
import { image, video, file } from '../../config/constants';
import { alertBox } from '../../commonRedux';
import { getCurrentUser } from '../../http/token-interceptor';
import Images from '../../assets/images/images';
import { history } from '../../store';
import Spinner from '../Spinner';

const currentUser = JSON.parse(getCurrentUser());
class CreatePostgroup extends React.Component {
  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
    this.state = {
      message: '',
      visible: true,
      posts: [],
      postImgs: [],
      displaySelectedItem: [],
      tags: [],
      issubmit: false,
    };

    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.extractUrl = this.extractUrl.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.removeURL = this.removeURL.bind(this);
    this.dropDownRef = React.createRef();
  }

  componentDidMount() {}

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

  removeURL = () => {
    this.setState({
      url: '',
    });
  };

  clearCreatPostInputs = () => {
    this.setState({
      message: '',
      tags: [],
      postImgs: [],
      postAccept: '',
      displaySelectedItem: [],
      visible: true,
      toggleTagInput: false,
    });
  };

  switchLoader2 = (txt = '') => {
    this.setState({
      loadTxt: txt,
    });
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
  }

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
    if (
      this.state.tags.length > 0 &&
      this.state.tags.find((x) => x._id == tag._id)
    ) {
      return false;
    }
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  }

  toggleTag = () => {
    if (!this.state.toggleTagInput) {
      this.setState({ tagLoading: true });
      group.getcurrentgrpmem({ _id: this.props.group_id }).then(
        async (resp) => {
          const cleanArray = resp.filter(
            (item) => item.userid !== currentUser._id
          );
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

  handleTagSearch = (e) => {
    e.stopPropagation();
    const text = e.target.value;
    const regex = new RegExp(text, 'gi');
    let results = [];
    if (this.state.suggestions) {
      results = this.state.suggestions.filter((user) =>
        user.usersdata.name?.match(regex)
      );
      this.setState({ tagResults: results });
    }
  };

  handleGroup = (event) => {
    this.setState({
      message: event.target.value,
    });
  };

  handleFile = (e) => {
    this.setState(
      { postImgs: [...this.state.postImgs, ...e.target.files] },
      () => {
        for (let i = 0; i < this.state.postImgs.length; i++) {
          const getExt = this.state.postImgs[i].name.split('.').pop();
          if (!this.state.postImgs[i].name.match(/\.(png|jpg|jpeg|gif|mp4)$/)) {
            this.setState({ postImgs: [] });
            alertBox(true, 'Post Upload image must in png,jpg,jpeg,gif,mp4');
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
    );
  };

  removeSelected = (i) => {
    const new_array = this.state.displaySelectedItem;
    new_array.splice(i, 1);
    this.setState({
      displaySelectedItem: new_array,
      postImgs: [],
    });
  };

  handleVisiblity = (event) => {
    const visibility = this.state.visible != true;
    this.setState({
      visible: visibility,
    });
  };

  submit = async (e, t) => {
    e.preventDefault();
    this.setState({ issubmit: true });
    const formData = new FormData();
    const text = this.state.message.trim();
    if (text == null || text == '') {
      this.setState({ issubmit: false });
      alertBox(true, 'You need to type something!');
    } else {
      formData.append('message', this.state.message);
      for (let i = 0; i < this.state.postImgs.length; i++) {
        formData.append(`postImgs[${i}]`, this.state.postImgs[i]);
      }
      formData.append('group_id', this.props.match.params.id);
      formData.append('taggPeople', JSON.stringify(this.state.tags));
      formData.append('visibility', this.state.visible);
      group.createPost(formData).then(
        async (resp) => {
          console.log(resp, 'resp');
          this.props.OnPostCrdStatus(true);
          this.setState({ issubmit: false });
          alertBox(true, 'Successfully posted', 'success');
          this.clearCreatPostInputs();

          history.push(`/tribesfeeds/${this.props.match.params.id}`);
        },
        (error) => {
          alertBox(true, 'Error created post');
        }
      );
    }
  };

  render() {
    const { tags, toggleTagInput, displaySelectedItem, issubmit } = this.state;

    return (
      <div className="CreateNewPostArea new-create-post">
        <form onSubmit={(e) => this.submit(e, 1)} method="post">
          <div className="textArea">
            <textarea
              placeholder="Text here"
              cols="100"
              name="message"
              onChange={this.handleGroup}
            />
          </div>

          <div className="line" />
          <div className="toolsArea">
            <div className="left-section">
              {tags.length > 0 && (
                <ul className="create-post-tags d-flex align-items-center">
                  {tags.map((value, index) => (
                    <li
                      onClick={() => this.onDelete(index)}
                      className="tagged-pill"
                      key={index}
                    >
                      {/* <img src={profilePic(value?.avatar,value?.name)} /> */}
                      {value.name}{' '}
                      <span className="close-btn">
                        <i className="fa fa-times" />
                      </span>{' '}
                    </li>
                  ))}
                </ul>
              )}

              <input
                type="file"
                multiple
                id="camera"
                name="image"
                onChange={this.handleFile}
                className="d-none"
              />
              <label htmlFor="camera">
                <span>
                  <i className="fa fa-picture-o" /> Photo/Video
                </span>
              </label>

              <div className="connection" onClick={() => this.toggleTag()}>
                Tag Connection
              </div>
              {toggleTagInput ? (
                <div className="user-tag-dropdown">
                  <input
                    className="w-100"
                    placeholder="Search your friends"
                    onChange={this.handleTagSearch}
                  />
                  <ul className="user-search-result">
                    {this.state.tagResults?.length
                      ? this.state.tagResults.slice(0, 10).map((user) => (
                          <li
                            key={user.usersdata.name}
                            onClick={() => this.onAddition(user.usersdata)}
                          >
                            {/* <img src={profilePic(user.usersdata.avatar,user.usersdata.name)} /> */}
                            <span key={user}>{user.usersdata.name}</span>
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
              ) : null}
            </div>
            <div className="right-section">
              {this.state.visible == true ? (
                <img
                  src={Images.eye}
                  alt="eye"
                  onClick={(e) => this.handleVisiblity(e)}
                />
              ) : (
                <img
                  src={Images.hideeye}
                  alt="eye"
                  onClick={(e) => this.handleVisiblity()}
                />
              )}

              <span onClick={(e) => this.handleVisiblity()}>
                {this.state.visible == true ? 'Visiblity' : 'Hidden'}
              </span>
              <button
                className={`primaryBtn ${issubmit ? 'loading' : ''}`}
                disabled={issubmit}
                onClick={(e) => this.submit(e, 0)}
              >
                Post
                {issubmit && (
                  <div className="loader-spinner">
                    <Spinner
                      className="spinner-xxs-white"
                      style={{ width: '15px', height: '15px' }}
                    />
                  </div>
                )}
              </button>
            </div>
          </div>
          <div>
            {displaySelectedItem && displaySelectedItem.length > 0 && (
              <div className="create-post-media m-2 mb-4">
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
          </div>
        </form>
      </div>
    );
  }
}
export default CreatePostgroup;
