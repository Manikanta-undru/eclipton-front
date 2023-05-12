import React from 'react';
import { alertBox } from '../../commonRedux';
import {
  createPost,
  particularGroups,
  getPostsdata,
} from '../../http/group-calls';
import CreatePostgroup from '../../components/Post/CreatePostgroup';

import './style/viewgroup.scss';
import './style/viewgrp.scss';

class EditPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupdetails: [],
      post_grop_id: '',
    };
  }

  componentDidMount() {
    const dd = {};
    dd.post_id = this.props.match.params.id;
    getPostsdata(dd).then((res) => {
      this.setState({
        post_grop_id: res.group_id,
      });

      particularGroups({ group_id: res.group_id }).then((res) => {
        if (res) {
          this.setState({
            groupdetails: res,
          });
        }
      });
    });
  }

  submit = async (e, t) => {
    e.preventDefault();
    const err = [];

    if (
      this.state.message == '' &&
      this.state.image == '' &&
      this.state.video == ''
    ) {
      err.push('Post content is required');
    }

    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = new FormData();
      formData.append('message', this.state.message);
      if (this.state.image != '') {
        formData.append('image', this.state.image);
      }
      if (this.state.video != '') {
        formData.append('video', this.state.video);
      }
      formData.append('group_id', this.state.post_grop_id);
      formData.append('visibility', this.state.visible);
      formData.append('edit_id', this.props.match.params.id);
      createPost(formData).then(
        async (resp) => {
          alertBox(true, 'Successfully posted', 'success');
          this.setState({
            message: '',
            image: '',
            video: '',
          });
          window.location.href = `/viewgroup/${this.state.post_grop_id}`;
          // this.props.history.push("/viewgroup/"+this.props.match.params.id)
        },
        (error) => {
          alertBox(true, 'Error created post');
        }
      );
    }
  };

  render() {
    return (
      <div className="viewUserGroupActivity viewEditGroupModerator">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <div className="col-sm empty-container-with-out-border left-column">
              <SocialActivities />
              {
                (this.state.groupdetails.userid == this.props.currentUser._id) ? 
              <div className="groupAreaWrapper">
                <div className="group">
                  <input className="file" id="ProfileImgFile" type="file" />
                  <div className="groupImg">
                    <img src={Images.profileM} alt="img" />
                    <div className="changeImg">
                      <label style={{ cursor: "pointer" }} for="ProfileImgFile">
                        <span>Change Image</span>
                      </label>
                    </div>
                  </div>
                  <span className="groupName">
                    Group Name of user will be shown here
                  </span>
                  <div className="groupAccessType">
                    <img src={Images.locked} alt="locked" />
                    <span>Private Group</span>
                  </div>
                  <span className="groupDescription">
                    Developing a solid brand makes selling easier. Brand
                    Strategy and Design communicates your ease so that you can
                    rise above the competition.
                  </span>
                  <div className="float-right">
                    <Link className="float-right">
                      See More <i className="fa fa-caret-down"></i>
                    </Link>
                  </div>
                </div>
              </div> : ""}
            </div> */}

            <div className="col-sm empty-container-with-out-border center-column">
              {this.state.groupdetails.userid == this.props.currentUser._id ? (
                <>
                  <div className="profileArea">
                    <div className="cover">
                      <img
                        className="coverImg"
                        src={this.state.groupdetails.banner}
                        alt="img-cover"
                        style={{ height: '200px', width: '765px' }}
                      />
                    </div>
                  </div>
                  <br />
                  <br />
                </>
              ) : (
                ''
              )}

              <CreatePostgroup
                setState={this.setStateFunc}
                {...this.props}
                post_id={this.props.match.params.id}
                group_id={this.state.groupdetails._id}
              />

              {/* <form onSubmit={(e) => this.submit(e, 1)} method="post">
                <div className="CreateNewPostArea">
                  <div className="textArea">
                    <textarea placeholder={this.state.message} cols="100" onChange={this.handleGroup}>{this.state.message}</textarea>
                    {
                        (this.state.attachment!= "" && this.state.types_image == "Image")? <img src={this.state.attachment} style={{
                        "max-width": "200px",
                        "max-height": "200px",
                        "position": "relative",
                        "left": "40%",
                        "padding": "5px"
                    }}/> : ""
                     
                    }

                    {
                         (this.state.attachment!= "" && this.state.types_image == "Video")? <video width="700" controls>
                         <source src={this.state.attachment} type="video/mp4" /> </video> : ""
                    }
                  
                  </div>
                  <div className="line"></div>
                  <div className="toolsArea">
                    <div className="left-section">
                      <input type="file" id="camera" name="image" onChange={this.handleImage} className="d-none" />
                      <input type="file" id="video" name="video" onChange={this.handleVideo} className="d-none" />

                      <label for="camera">
                        <img src={Images.camera} alt="camera" />
                      </label>
                      <label for="video">
                        <img src={Images.video} alt="video" />
                      </label>

                      <div className="connection">Tag Connection</div>
                    </div>
                    <div className="right-section">
                      {
                        (this.state.visible == true) ? (<img src={Images.eye} alt="eye" onClick={(e) => this.handleVisiblity()} />) : (<img src={Images.hideeye} alt="eye" onClick={(e) => this.handleVisiblity()} />)
                      }

                      <span onClick={(e) => this.handleVisiblity()}>{(this.state.visible == true) ? "Visiblity" : "Hidden"}</span>
                      <button className="primaryBtn" onClick={(e) => this.submit(e, 0)}>Post</button>
                    </div>
                  </div>
                </div>
              </form> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPost;
