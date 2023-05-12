import React, { useState } from 'react';
import Images from '../../assets/images/images';
import { alertBox } from '../../commonRedux';
import './style/personalEvent.scss';
import './style/addgroup.scss';
import './style/schedule.scss';
import { createPost } from '../../http/group-calls';

function SchedulePost(props) {
  const [desc, setDescription] = useState('');
  const [start_date, setStartdate] = useState('');
  const [banner, setUpload] = useState('');
  const [Visibility, setvisiblity] = useState('');
  const visible = Visibility != false;

  const handlefileUpload = (event) => {
    const attachdatam = event.target.files;
    setUpload(attachdatam);
  };

  const handleVisiblity = (event) => {
    console.log(event, 'event');
    const visibilitys = !!(event == false || event == '');
    setvisiblity(visibilitys);
  };

  const submit = async (e, t) => {
    e.preventDefault();
    const attach_data = banner;
    const description = desc;
    const startdate = start_date;
    const err = [];

    if (description == '') {
      err.push('Post description is required');
    }
    if (startdate == '' || startdate == undefined) {
      err.push('Schedule Date is required');
    }

    for (let i = 0; i < attach_data.length; i++) {
      if (attach_data[i].size > '20971520') {
        err.push('Post attachment is must be with in 2 MB');
      }

      if (!attach_data[i].name.match(/\.(png|jpg|jpeg|gif|mp4)$/)) {
        err.push('Post attachment is must be with in jpeg,jpg,png,mp4');
      }
    }
    // if (attach_data.length == 0 || attach_data == "") {
    //     err.push("Post attachment is required");
    // }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      let visible;
      if (Visibility == '') {
        visible = true;
      } else {
        visible = Visibility;
      }
      const formData = new FormData();
      formData.append('message', desc);
      formData.append('scheduledate', startdate);
      formData.append('group_id', props.group_id);
      formData.append('visibility', visible);
      for (let i = 0; i < attach_data.length; i++) {
        formData.append('banner', attach_data[i]);
      }
      createPost(formData).then(async (resp) => {
        if (resp.message == 'error') {
          alertBox(true, resp.errors);
        } else if (resp.message == 'create success') {
          alertBox(true, 'Post Created Successfully!', 'success');
          setTimeout(() => {
            window.location.href = `/settings/${props.group_id}`;
          }, 3000);
        } else {
          alertBox(true, 'Error created post!');
        }
      });
    }
  };

  return (
    <div className="createEventArea">
      <div className="header">
        <span>Scheduled Post</span>
      </div>

      <div className="hLine" />
      <br />
      <form method="post" onSubmit={(e) => submit(e, 0)}>
        <div className="eventForm">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Post Schedule Date</label>
                  <input
                    type="date"
                    className="form-control w-100"
                    placeholder="Start Date"
                    value={start_date}
                    onChange={(e) => {
                      setStartdate(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <textarea
                    placeholder="Description"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    className="form-control w-100"
                    cols="100"
                  />
                </div>
                <div className="CreateNewPostArea">
                  <div className="textArea" />
                  <div className="line" />
                  <div className="toolsArea">
                    <div className="left-section">
                      <input
                        type="file"
                        id="video"
                        onChange={(e) => {
                          handlefileUpload(e);
                        }}
                        className="d-none"
                      />
                      <input
                        type="file"
                        id="attachment"
                        onChange={(e) => {
                          handlefileUpload(e);
                        }}
                        className="d-none"
                      />

                      <label htmlFor="camera">
                        <img src={Images.camera} alt="camera" />
                      </label>
                      <label htmlFor="video">
                        <img src={Images.video} alt="video" />
                      </label>
                      <label htmlFor="attachment">
                        <img src={Images.attachment} alt="attachment" />
                      </label>
                      <div className="connection">Tag Connection</div>
                    </div>
                    <div className="right-section">
                      {visible == false ? (
                        <img
                          src={Images.hideeye}
                          alt="eye"
                          onClick={(e) => handleVisiblity(visible)}
                        />
                      ) : (
                        <img
                          src={Images.eye}
                          alt="eye"
                          onClick={(e) => handleVisiblity(visible)}
                        />
                      )}

                      <span onClick={(e) => handleVisiblity(visible)}>
                        {visible == false ? 'Hidden' : 'Visibility'}
                      </span>
                      <button onSubmit={(e) => submit(e, 0)}>Post</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SchedulePost;
