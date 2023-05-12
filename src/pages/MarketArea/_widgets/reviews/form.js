import React, { Component } from 'react';

import { alertBox } from '../../../../commonRedux';
import A from '../../../../components/A';
import Button from '../../../../components/Button';
import { create } from '../../../../http/product-review-calls';

require('./reviews.scss');

class ReviewForm extends Component {
  constructor(props) {
    super(props);
    const initialState = {
      products: this.props.products,
    };
    this.state = {
      ...initialState,
      review: '',
      files: [],
      files2: [],
    };
  }

  handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: 'enter',
    });
  };

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
  };

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: 'over',
    });
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
    const dt = e.dataTransfer;
    const { files } = dt;
    this.handleFiles(files);
  };

  addToGallery = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
    this.handleFiles(e.target.files);
  };

  handleStarClick = (e, star) => {
    e.preventDefault();
    e.stopPropagation();
    const starlist = ['stars-1', 'stars-2', 'stars-3', 'stars-4', 'stars-5'];
    const element = document.getElementsByClassName('review-stars')[0];
    element.classList.add(star);
    this.setState({
      rate: star,
    });
    starlist.forEach((e_item) => {
      if (star !== e_item) {
        element.classList.remove(e_item);
      }
    });
  };

  handleInput = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    this.setState({
      [name]: val,
    });
  };

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.querySelector('.droppedFiles');
    if (!el.contains(e.target)) {
      document.getElementById('gallery').click();
    }
  };

  fileToDataURL = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  readAsDataURL = (filesArray) =>
    Promise.all(filesArray.map(this.fileToDataURL));

  handleFiles = async (files) => {
    const temp = [...this.state.files, ...files];
    const f = await this.readAsDataURL(temp);
    this.setState({
      files: temp,
      imgs: f,
    });
  };

  removeFile = (i, n = 1) => {
    let temp = [];
    if (n == 2) {
      temp = this.state.files2;
      temp.splice(i, 1);
      this.setState({
        files2: temp,
      });
    } else {
      temp = this.state.files;
      const temp2 = this.state.imgs;
      temp.splice(i, 1);
      temp2.splice(i, 1);
      this.setState({
        files: temp,
        imgs: temp2,
      });
    }
  };

  submit = async (e, t) => {
    e.preventDefault();
    let status = 'publish';
    const err = [];
    if (t == 1) {
      if (this.state.rate == '') {
        err.push('Rate is required');
      }
      if (this.state.review == '') {
        err.push('Review is required');
      }
      if (this.state.files.length == 0 && this.state.files2.length == 0) {
        err.push('At least one gallery image is required');
      }
    } else {
      if (this.state.rate == '') {
        err.push('Rate is required');
      }
      status = 'publish';
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = {
        status,
        product_id: this.state.products._id,
        rate: this.state.rate,
        review: this.state.review,
        files: this.state.files,
        files2: this.state.files2,
      };
      create(formData).then(
        async (resp) => {
          this.props.parentCallback(resp);
          if (t == 1) {
            const element = document.getElementsByClassName('review-stars')[0];
            element.classList.remove(this.state.rate);
            this.setState({
              rate: '',
              review: '',
              files: [],
            });
            alertBox(true, 'Review has been submitted!', 'success');
          }
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    }
  };

  render() {
    return (
      <>
        <h3>Leave a Rating!</h3>
        <form onSubmit={(e) => this.submit(e, 1)} method="post">
          <div className="form-group type-1">
            <label htmlFor="title"> Your rating </label>
            <div className="input-holder">
              <div className="review-stars stars">
                <i
                  className="fa fa-star"
                  name="rate"
                  onClick={(e) => this.handleStarClick(e, 'stars-1')}
                />
                <i
                  className="fa fa-star"
                  name="rate"
                  onClick={(e) => this.handleStarClick(e, 'stars-2')}
                />
                <i
                  className="fa fa-star"
                  name="rate"
                  onClick={(e) => this.handleStarClick(e, 'stars-3')}
                />
                <i
                  className="fa fa-star"
                  name="rate"
                  onClick={(e) => this.handleStarClick(e, 'stars-4')}
                />
                <i
                  className="fa fa-star"
                  name="rate"
                  onClick={(e) => this.handleStarClick(e, 'stars-5')}
                />
              </div>
            </div>
          </div>
          <div className="form-group type-1">
            <label htmlFor="title"> Your review </label>
            <div className="input-holder">
              <input
                type="text"
                required
                className="form-control field"
                placeholder="Enter your review"
                name="review"
                onChange={this.handleInput}
                value={this.state.review}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="left">
              <strong>Gallery / My Work</strong>
            </div>
            <div className="right">
              <div
                className={`uploadArea ${this.state.dragclass}`}
                onDrop={(e) => this.handleDrop(e)}
                onDragOver={(e) => this.handleDragOver(e)}
                onDragEnter={(e) => this.handleDragEnter(e)}
                onDragLeave={(e) => this.handleDragLeave(e)}
                onClick={(e) => this.handleClick(e)}
              >
                <div className="droppedFiles">
                  {this.state.files2.map((f, i) => (
                    <div className="file" key={i}>
                      <img
                        src={
                          f.content_url != undefined
                            ? f.content_url
                            : this.state.imgs[i]
                        }
                      />
                      <i
                        className="fa fa-times"
                        onClick={() => this.removeFile(i, 2)}
                      />
                    </div>
                  ))}
                  {this.state.files.map((f, i) => {
                    const extension = this.state.imgs[i]
                      .split(';')[0]
                      .split('/')[1];
                    if (extension !== 'mp4') {
                      return (
                        <div className="file" key={i}>
                          <img src={this.state.imgs[i]} />
                          <i
                            className="fa fa-times"
                            onClick={() => this.removeFile(i)}
                          />
                        </div>
                      );
                    }
                    return (
                      <div className="file" key={i}>
                        <video src={this.state.imgs[i]} />
                        <i
                          className="fa fa-times"
                          onClick={() => this.removeFile(i)}
                        />
                      </div>
                    );
                  })}
                </div>
                Browse / Drag and Drop
              </div>
              <input
                type="file"
                id="gallery"
                onChange={this.addToGallery}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className="form-group text-center">
            <A href={`/market-product-detail-view/${this.state.products._id}`}>
              <Button className="btn-1"> Publish Review </Button>
            </A>
          </div>
        </form>
      </>
    );
  }
}

export default ReviewForm;
