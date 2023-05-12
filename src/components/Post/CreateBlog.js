import React from 'react';
import ContentEditable from 'react-contenteditable';
import Loader from 'react-spinners/BarLoader';
import { createPost, getTagUsers } from '../../http/http-calls';
import { twitterTweet } from '../../http/twitter-calls';
import { image, video, file } from '../../config/constants';

class CreateBlog extends React.Component {
  constructor(props) {
    super(props);
    this.postFileInput = React.createRef();
    this.reactTags = React.createRef();
    this.contentEditable = React.createRef();
    this.state = { html: '<b>Hello <i>World</i></b>' };

    this.state = {
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
    };

    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.extractUrl = this.extractUrl.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.removeURL = this.removeURL.bind(this);
  }

  componentDidMount() {
    // getCSRF()
    // 	.then(async resp => {
    // 		localStorage.setItem('csrf', resp._csrf);
    // 	}, error => {
    //
    // 	});
  }

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

  clearCreatPostInputs = () => {
    this.setState({
      text: '',
      url: '',
      profileImg: '',
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

  post = () => {
    const formData = new FormData();
    formData.append('postImgs', this.state.postImgs);
    formData.append('text', this.state.text.replace('&nbsp;', ''));
    formData.append('subject', 'Eclipton');
    formData.append('taggPeople', JSON.stringify(this.state.tags));
    formData.append('privacy', this.state.visibility);
    formData.append('twitterPost', this.state.twitter);
    formData.append('url', this.state.url);
    this.switchLoader2('Your post is being created...');
    createPost(formData).then(
      async (resp) => {
        if (resp.success) {
          this.props.setState('latestpost', resp.post);
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
        this.switchLoader2();
      },
      (error) => {
        this.switchLoader2();
      }
    );
  };

  handleChangeImage(e) {
    this.setState({ postImgs: e.target.files[0] }, () => {
      const getExt = this.state.postImgs.name.split('.').pop();
      const displaySelectedItem = [];
      if (image.indexOf(`.${getExt}`) !== -1) {
        const imgTag = () => (
          <img
            className="displayPostImg"
            src={URL.createObjectURL(this.state.postImgs)}
          />
        );
        displaySelectedItem.push(imgTag());
      } else if (video.indexOf(`.${getExt}`) !== -1) {
        displaySelectedItem.push('1 Video Selected');
      } else if (file.indexOf(`.${getExt}`) !== -1) {
        displaySelectedItem.push('1 File Selected');
      }
      this.setState({ displaySelectedItem });
    });
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
    const txt = this.htmlToText(evt.target.value);
    this.setState({ text: txt }, () => {
      const temp = this.extractUrl(this.state.text);

      if (temp != null && temp.length > 0 && this.url != temp[0]) {
        this.setState({
          url: temp[0],
        });
      }
    });
  };

  onDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  }

  onAddition(tag) {
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  }

  toggleTag = () => {
    if (!this.state.toggleTagInput) {
      getTagUsers({}, true).then(
        async (resp) => {
          this.setState({ suggestions: resp }, () => {});
        },
        (error) => {}
      );
    }
    this.setState({ toggleTagInput: !this.state.toggleTagInput });
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
      <div className="cardBody create-post">
        <div className="container">
          <div className="row">
            <ul className="list-group w-100 m-0">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="clearfix content-heading w-100">
                  <p className="mb-0">Write a Blog</p>
                  {/* <span className="overlay pull-left"><img className=""
										src={require("../../assets/images/create-plus-icon.png")} /></span> */}
                  {/* <textarea
										className="form-control pull-left border-0 p-1"
										placeholder="Create"
										rows="3"
										name="text"
										value={this.state.text}
										onChange={this.handleChange}
									></textarea> */}
                  <ContentEditable
                    placeholder="Write an article and express your view"
                    name="text"
                    className="form-control pull-left border-0 p-1 textarea"
                    innerRef={this.contentEditable}
                    html={this.state.text} // innerHTML of the editable div
                    disabled={false} // use true to disable editing
                    onChange={this.handleChange} // handle innerHTML change
                    tagName="div" // Use a custom HTML tag (uses a div by default)
                  />
                </div>
              </li>

              {displaySelectedItem && displaySelectedItem.length > 0 && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="clearfix content-heading w-100 pl-2">
                    {displaySelectedItem[0]}
                  </div>
                </li>
              )}
              {tags.length > 0 && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="clearfix content-heading w-100 tagedPeople">
                    <ul>
                      {tags.map((value, index) => (
                        <li
                          onClick={() => this.onDelete(index)}
                          className="btn-light p-2 "
                          key={index}
                        >
                          {value.name} <span className="deleteIcon">x</span>{' '}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )}

              <li className="list-group-item d-flex justify-content-between align-items-center create-post-attachments p-1">
                <div className="create-post-customize">
                  <div className="hide">
                    <input
                      type="file"
                      name="file"
                      accept={postAccept}
                      onChange={this.handleChangeImage}
                      ref={this.postFileInput}
                    />
                  </div>
                  <ul className="list-group list-group-horizontal remove-border m-0">
                    <li className="list-group-item p-2 ">
                      <button
                        type="button"
                        className="btn btn-light btn-sm theme-btn"
                        onClick={this.post}
                      >
                        Post
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            {this.state.loadTxt != '' && (
              <div className="d-block w-100">
                <small className="text-center d-block text-danger">
                  {this.state.loadTxt}
                </small>
                <Loader width="100%" color="#5931ea" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default CreateBlog;
