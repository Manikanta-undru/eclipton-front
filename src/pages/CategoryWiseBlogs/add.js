import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.scss';
import MultipleValueTextInput from 'react-multivalue-text-input';
import { switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import FileBrowse from '../../components/FormFields/FileBrowse';
import { createBlog } from '../../http/blog-calls';
import { uploadFile } from '../../http/http-calls';
import { history } from '../../store';

require('./styles.scss');

class AddBlog extends React.Component {
  constructor(props) {
    super(props);
    const html = '<p></p>';
    const contentBlock = htmlToDraft(html);
    let editor = null;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      editor = editorState;
    }
    this.state = {
      editorState: editor,
      refreshing: false,
      filter: '',
      latestpost: {},
      paymentType: 'free',
      currentTab: 0,
      tags: '',
      currency: '',
      amount: 0,
      category: 'General',
      suggestions: [
        { id: 3, name: 'Bananas' },
        { id: 4, name: 'Mangos' },
        { id: 5, name: 'Lemons' },
        { id: 6, name: 'Apricots' },
      ],
    };

    this.reactTags = React.createRef();
  }

  onDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  }

  onAddition(tag) {
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  }

  tagChange = (val) => {};

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {}

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleInput = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    this.setState({
      [name]: val,
    });
  };

  handleRemove = (e) => {
    const name = e.target.getAttribute('name');
    this.setState({
      [name]: null,
    });
  };

  handleFile = (name, type, value) => {
    this.setState(
      {
        [name]: value,
      },
      () => {
        const reader = new FileReader();
        // it's onload event and you forgot (parameters)
        reader.onload = function (e) {
          const image = document.getElementById(`${name}_preview`);
          image.src = e.target.result;
        };
        // you have to declare the file loading
        reader.readAsDataURL(value);
      }
    );
  };

  handleCheckbox = (e) => {
    const { name } = e.target;
    let val = '';
    if (e.target.checked) {
      val = e.target.value;
      this.setState({
        [name]: val,
      });
    } else {
      val = e.target.getAttribute('uncheckedValue');
      this.setState({
        [name]: val,
      });
    }
  };

  submit = (e) => {
    e.preventDefault();
    const txt = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    const postImages = this.state.post_image;
    const hashtags = this.state.tags.join(',');
    const formData = new FormData();
    formData.append('postImgs', postImages);
    formData.append('text', txt);
    formData.append('subject', this.state.title);
    formData.append('hashtags', hashtags);
    formData.append('paymentType', this.state.paymentType);
    formData.append('amount', this.state.amount);
    formData.append('currency', this.state.currency);
    formData.append('category', this.state.category);
    switchLoader('Your post is being created...');
    createBlog(formData).then(
      async (resp) => {
        history.goBack();
        switchLoader();
      },
      (error) => {
        switchLoader();
      }
    );
  };

  uploadImageCallBack = (file) =>
    new Promise((resolve, reject) => {
      uploadFile({ file }).then(
        (resp) => {
          const out = { data: { link: resp.file.filePath } };
          resolve(out);
        },
        (error) => {
          reject(error);
        }
      );
    });
  // return new Promise(
  //   (resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.open('POST', 'https://api.imgur.com/3/image');
  //     xhr.setRequestHeader('Authorization', 'Client-ID ##clientid##');
  //     const data = new FormData();
  //     data.append('image', file);
  //     xhr.send(data);
  //     xhr.addEventListener('load', () => {
  //       const response = JSON.parse(xhr.responseText);
  //       resolve(response);
  //     });
  //     xhr.addEventListener('error', () => {
  //       const error = JSON.parse(xhr.responseText);
  //       reject(error);
  //     });
  //   }
  // );

  review = () => {};

  render() {
    return (
      // <!-- Wall container -->
      <div className="addBlogPage">
        <div className="container my-wall-container mrgn_bm_50">
          <div className="row mt-2">
            {/* <!-- left column --> */}

            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-border center-column big mx-auto p-4 addBlogs">
              <h1>Add an Article</h1>
              <form onSubmit={(e) => this.submit(e)} method="post">
                <div className="form-group">
                  <label>Title of the Article</label>
                  <input
                    maxLength="60"
                    required
                    type="text"
                    placeholder="Alpha numeric"
                    name="title"
                    value={this.state.title}
                    className="form-control"
                    onChange={this.handleInput}
                  />
                </div>

                <div className="form-group">
                  <label>Content</label>
                  {/* <Editor
          editorState={this.state.editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        /> */}
                  <Editor
                    editorState={this.state.editorState}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                      inline: { inDropdown: true },
                      list: { inDropdown: true },
                      textAlign: { inDropdown: true },
                      link: { inDropdown: true },
                      history: { inDropdown: true },
                      image: {
                        uploadCallback: this.uploadImageCallBack,
                        alt: { present: true, mandatory: true },
                      },
                    }}
                  />
                  <textarea
                    style={{ display: 'none' }}
                    disabled
                    value={draftToHtml(
                      convertToRaw(this.state.editorState.getCurrentContent())
                    )}
                  />
                </div>
                <div className="form-group">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="paymentType"
                      value="paid"
                      // eslint-disable-next-line react/no-unknown-property
                      uncheckedValue="free"
                      onChange={this.handleCheckbox}
                    />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                      Make this article paid
                    </label>
                  </div>
                </div>
                {this.state.paymentType == 'paid' && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Price</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="Amount"
                          name="amount"
                          className="form-control"
                          onChange={this.handleInput}
                        />
                        <small className="text-secondary">
                          Enter how much you want to charge for your content
                        </small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Currency</label>
                        <select
                          type="text"
                          placeholder="Amount"
                          className="form-control"
                          name="currency"
                          onChange={this.handleInput}
                        >
                          <option>USD</option>
                          <option>BTC</option>
                          <option>ETH</option>
                          <option>LTC</option>
                          <option>XRP</option>
                          <option>BCH</option>
                          <option>USDT</option>
                        </select>
                        <small className="text-secondary">
                          Enter how much you want to charge for your content
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Main Image</label>
                      <FileBrowse
                        name="post_image"
                        page="blogs"
                        fileChange={this.handleFile}
                        value={this.state.post_image}
                        accept="image/*"
                      />
                      <small className="text-secondary">
                        Select the main image for your article
                      </small>

                      {this.state.post_image != null && (
                        <div className="uploadedImage">
                          <img
                            src={this.state.post_image.tmp_name}
                            id="post_image_preview"
                          />
                          <div
                            className="fa fa-times remove"
                            name="post_image"
                            onClick={this.handleRemove}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        type="text"
                        name="category"
                        className="form-control"
                        onChange={this.handleInput}
                      >
                        <option value="General">General</option>
                        <option value="Technology">Technology</option>
                        <option value="Politics">Politics</option>
                      </select>
                      <small className="text-secondary">
                        Select one related
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Tags</label>
                  <MultipleValueTextInput
                    onItemAdded={(item, allItems) =>
                      this.setState({ tags: allItems })
                    }
                    onItemDeleted={(item, allItems) =>
                      this.setState({ tags: allItems })
                    }
                    label=""
                    maxLength="70"
                    name="item-input"
                    placeholder="Do not include #"
                  />

                  <small className="text-secondary">
                    Separate tags using commas
                  </small>
                </div>
                <div className="form-group">
                  <Button
                    type="button"
                    variant="secondaryBtn"
                    className="ml-2"
                    size="big"
                    onClick={(e) => this.review(e)}
                  >
                    Review
                  </Button>
                  <Button variant="primaryBtn" size="big">
                    Publish
                  </Button>
                </div>
              </form>
            </div>
            {/* <div className="col-sm empty-container-with-out-border center-column">
                  Twitter Tweets
                </div> */}
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}

            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default AddBlog;
