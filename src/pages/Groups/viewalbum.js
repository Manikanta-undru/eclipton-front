import React from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../commonRedux';
import './style/media.scss';
import './style/viewalbum.scss';

import Header from '../../components/Header';
import SocialActivities from '../../components/Menu/SocialActivities';
import images from '../../assets/images/images';
import RewardsWidget from '../../components/RewardsWidget';
import { particularGroups, getAlbums } from '../../http/group-calls';

class ViewMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsdata: [],
      albums: [],
      album_name: '',
      attach: '',
      album_desc: '',
    };
  }

  componentDidMount() {
    const data = {};
    data.album_id = this.props.match.params.id;
    getAlbums(data).then(
      (res) => {
        const attach = [];
        for (const [key, value] of Object.entries(res.attachment)) {
          attach[key] = value;
        }
        this.setState({
          albums: attach,
          album_name: res.name,
          attach: attach.length,
          album_desc: res.description,
        });
        particularGroups({ group_id: res.group_id }).then(
          (gropdata) => {
            this.setState({
              groupsdata: gropdata,
            });
          },
          (err) => {
            alertBox(true, err, 'Error');
          }
        );
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
  }

  render() {
    const Grupscate = this.state.albums.map((album, index) => (
      <div className="album" key={index}>
        {album.type == 'Image' ? (
          <img src={album.src} alt="album" />
        ) : (
          <video controls>
            <source src={album.src} type="video/mp4" />
          </video>
        )}
      </div>
    ));

    return (
      <div className="viewMediaTotalWrapper">
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser}
        />
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <SocialActivities group_id={this.state.groupsdata._id} />
              <div className="groupAreaWrapper">
                <div className="group">
                  <div className="groupImg">
                    <img src={images.profileM} alt="img" />
                  </div>
                  <span className="groupName">
                    {this.state.groupsdata.name}
                  </span>
                  <div className="groupAccessType">
                    <img src={images.locked} alt="locked" />
                    <span>{this.state.groupsdata.privacy} Group</span>
                  </div>
                  <span className="groupDescription">
                    {this.state.groupsdata.description}
                  </span>
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
              <div className="eventsOverallAreaWrapper">
                <div className="header">
                  <div className="leftArea">
                    <div>
                      <span>
                        {this.state.album_name} - ({this.state.attach}){' '}
                      </span>
                      <p>{this.state.album_desc}</p>
                    </div>
                  </div>
                </div>
                <div className="hLine" />
                <div className="mediaAreaWrapper">
                  <div className="albumsAreaWrapper">{Grupscate}</div>
                </div>
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <RewardsWidget {...this.props} />
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewMedia;
