import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Header from '../../components/Header';
import SocialActivities from '../../components/Menu/SocialActivities';
import images from '../../assets/images/images';
import RewardsWidget from '../../components/RewardsWidget';
import Button from '../../components/Button';
import { alertBox } from '../../commonRedux';
import './style/album.scss';
import './style/addgroup.scss';
import './style/photos.scss';
import { particularGroups, createAlbum } from '../../http/group-calls';

function Image(props) {
  const arrayatt = [];

  for (let index = 0; index < props.attachment.length; index++) {
    const element = props.attachment[index];
    if (element != undefined) {
      console.log(element.size, 'element');
      console.log(element.name, 'name');
      arrayatt.push({
        image: URL.createObjectURL(element),
        types: element.type,
        name: element.name,
      });
    }
  }
  if (arrayatt.length > 0 && arrayatt != undefined) {
    const attachImage = arrayatt.map((data, index) => (
      <div className="album" key={index}>
        <div className="image">
          {data.types == 'image/jpeg' ||
          data.types == 'image/jpg' ||
          data.types == 'image/png' ? (
            <img src={data.image} alt="img" />
          ) : (
            <video controls>
              <source src={data.image} type="video/mp4" />{' '}
            </video>
          )}

          <img
            src={images.closeImg}
            alt="img"
            onClick={(e) => props.handleCancel(e, data.name, props.attachment)}
          />
        </div>
      </div>
    ));
    return attachImage;
  }
  return '';
}

function CreateNewAlbum(props) {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      display: 'block',
      margin: theme.spacing(1),
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const [group, setGroup] = useState('');
  const [desc, setDescription] = useState('');
  const [groupdet, fetchGroup] = useState('');
  const [attachment, setUpload] = useState('');

  window.addEventListener('load', (event) => {
    const grop_id = props.match.params.id;
    const d = {};
    d.group_id = grop_id;
    particularGroups(d).then(
      (res) => {
        fetchGroup(res);
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
  });

  const handlefileUpload = (event, name, preatt) => {
    if (name && preatt) {
      const sendUpload = [];
      for (let index = 0; index < preatt.length; index++) {
        const element = preatt[index];
        if (element != undefined) {
          if (element.name != name) {
            sendUpload.push(preatt[index]);
          }
        }
      }
      setUpload(sendUpload);
    } else {
      const attachdatam = event.target.files;
      setUpload(attachdatam);
    }
  };

  const submit = async (e, t) => {
    e.preventDefault();
    const attach_data = attachment;
    const album_name = group;
    const album_desc = desc;
    const err = [];
    if (album_name == '') {
      err.push('Album name is required');
    }
    if (album_desc == '') {
      err.push('Album description is required');
    }

    for (let i = 0; i < attachment.length; i++) {
      if (attachment[i].size > '20971520') {
        err.push('Album attachment is must be with in 2 MB');
      }

      if (
        !attachment[i].name.toLowerCase().match(/\.(png|jpg|jpeg|gif|mp4)$/)
      ) {
        err.push('Album attachment is must be with in jpeg,jpg,png,mp4');
      }

      // if(!attachment[i].type === 'image/jpeg' ||
      // attachment[i].type === 'image/jpg' ||
      // attachment[i].type === 'image/png' || attachment[i].type === 'image/gif'){
      //   err.push("Album Image is must be with in jpeg,jpg,png");
      // }
    }

    if (attach_data.length == 0 || attach_data == '') {
      err.push('Album attachment is required');
    }

    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const formData = new FormData();
      formData.append('userid', props.currentUser._id);
      formData.append('album_name', album_name);
      formData.append('description', album_desc);
      for (let i = 0; i < attachment.length; i++) {
        formData.append(`attach[${i}]`, attachment[i]);
      }
      formData.append('group_id', props.match.params.id);
      createAlbum(formData).then(async (resp) => {
        if (resp.message == 'error') {
          alertBox(true, resp.errors);
        } else if (resp.message == 'create success') {
          alertBox(true, 'album Created Successfully!', 'success');
          window.location.href = '';
        } else {
          alertBox(true, 'Error created album!');
        }
      });
    }
  };

  return (
    <div className="createNewAlbumTotalWrapper">
      <Header appName={props.appName} currentUser={props.currentUser} />
      <div className="container my-wall-container ">
        <div className="row mt-2">
          {/* <!-- left column --> */}
          <div className="col-sm empty-container-with-out-border left-column">
            <SocialActivities
              group_id={props.match.params.id}
              user_id={props.currentUser._id}
            />
            <div className="groupAreaWrapper">
              <div className="group">
                <input className="file" id="ProfileImgFile" type="file" />
                <div className="groupImg">
                  <img src={images.profileM} alt="img" />
                  <div className="changeImg">
                    <label
                      style={{ cursor: 'pointer' }}
                      htmlFor="ProfileImgFile"
                    >
                      <span>Change Image</span>
                    </label>
                  </div>
                </div>
                <span className="groupName">{groupdet.name}</span>
                <div className="groupAccessType">
                  <img src={images.locked} alt="locked" />
                  <span> {groupdet.privacy} Group</span>
                </div>
                <span className="groupDescription">{groupdet.description}</span>
                <div className="float-right">
                  <Link className="float-right">
                    See More <i className="fa fa-caret-down" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- end left column --> */}

          {/* <!-- center column --> */}
          <div className="col-sm empty-container-with-out-border center-column">
            <div className="create-group">
              <form onSubmit={(e) => submit(e, 1)} method="post">
                <div className="hLine" />
                <div className="form-group">
                  <label>Album Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Album Name"
                    value={group}
                    onChange={(e) => {
                      setGroup(e.target.value);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Album description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Album description"
                    value={desc}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="exampleFormControlFile1">
                    Add Photos or Videos
                  </label>
                  <input
                    type="file"
                    name="file"
                    onChange={(e) => {
                      handlefileUpload(e);
                    }}
                    className="form-control-file"
                    id="exampleFormControlFile1"
                    multiple
                  />
                </div>
              </form>

              <div className="albums ">
                <Image
                  attachment={attachment}
                  handleCancel={handlefileUpload}
                />

                {/* <div className="album">
                  <div className="image">
                    <img src={images.user4} alt="img" />
                    <img src={images.closeImg} alt="img" />
                  </div>
                  <div className="description">
                    <textarea placeholder="Description"></textarea>
                  </div>
                </div> */}
              </div>

              <div className="submit">
                <Button
                  type="submit"
                  variant="primary"
                  size="compact m-2 float-right"
                  onClick={(e) =>
                    (window.location.href = `/groupmedia/${props.match.params.id}`)
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="compact m-2 float-right"
                  onClick={(e) => submit(e, 0)}
                >
                  Post
                </Button>
              </div>
              <br />
              <br />
            </div>
          </div>
          {/* <!-- end center column --> */}

          {/* <!--  right column --> */}
          <div className="col-sm empty-container-with-out-border right-column">
            <RewardsWidget {...props} />
          </div>
          {/* <!-- end right column --> */}
        </div>
      </div>
    </div>
  );
}

export default CreateNewAlbum;
