import React from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../commonRedux';
import './style/media.scss';
import Header from '../../components/Header';
import SocialActivities from '../../components/Menu/SocialActivities';
import images from '../../assets/images/images';
import RewardsWidget from '../../components/RewardsWidget';
import PhotosTab from './photos';
import VideosTab from './videos';
import AlbumsTab from './albums';
import {
  particularGroups,
  getAttchments,
  getGroupMember,
  getAlbums,
} from '../../http/group-calls';

class ViewMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 1,
      popup: false,
      groupsdata: [],
      groupattach: [],
      groupvideos: [],
      album_status: '',
      albums: [],
    };
  }

  componentDidMount() {
    const grop_id = this.props.match.params.id;
    const d = {};
    d.group_id = grop_id;
    particularGroups(d).then(
      (res) => {
        this.setState({
          groupsdata: res,
        });
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
    getAttchments(d).then(
      (res) => {
        const gro_phot = [];
        const gro_video = [];
        let typesattach = '';
        res.map((item) => {
          let i = 0;

          if (item.attachment != undefined) {
            if (item.types == 'Image') {
              gro_phot.push(item.attachment);
              typesattach = item.types;
            } else if (item.types == 'Video') {
              const attachdata = {
                // src: "https://www.w3schools.com/html/mov_bbb.mp4",
                src: item.attachment,
                autoPlay: false,
                controls: false,
              };
              gro_video.push(attachdata);
              typesattach = item.types;
            }
          }
          i++;
        });
        // if(typesattach == "Image"){

        // }else if(typesattach == "Video"){
        //     this.setState({
        //         groupvideos: gro_video
        //     });
        // }
        this.setState({
          groupattach: gro_phot,
          groupvideos: gro_video,
        });
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
    getAlbums(d).then((res) => {
      console.log(res, 'result album');
      this.setState({ albums: res });
    });

    const Grps = [];
    getGroupMember().then((res) => {
      console.log(res, 'response');
      const ii = 0;
      const i = 0;
      res.map((item, index) => {
        console.log(item.groupsMembers.position, 'item.groupsMembers.position');
        if (
          this.props.match.params.id == item._id ||
          this.props.currentUser._id == item.groupsMembers.userid
        ) {
          if (
            this.props.currentUser._id == item.userid ||
            item.groupsMembers.position == 'moderator'
          ) {
            // Grps[item.userId] = { position: item.designation, location: item.country };
            this.setState({
              album_status: 'active',
            });
          }
        }
      });
    });
  }

  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
  };

  getSelectedTabClassName = (tabValue) => {
    const { currentTab } = { ...this.state };
    if (tabValue === currentTab) return 'tab selected';
    return 'tab';
  };

  handlePopupOpenClose = () => {
    this.setState({ popup: !this.state.popup });
  };

  render() {
    const { currentTab, popup, album_status } = { ...this.state };
    console.log(album_status, 'test');
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
              <SocialActivities
                group_id={this.props.match.params.id}
                user_id={this.props.currentUser._id}
              />
              <div className="groupAreaWrapper">
                <div className="group">
                  <div className="groupImg">
                    <img src={this.state.groupsdata.banner} alt="img" />
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
                      <span>Media</span>
                    </div>
                    <div
                      className={this.getSelectedTabClassName(1)}
                      onClick={() => this.changeTab(1)}
                    >
                      <span className="tabName">Photos</span>
                    </div>
                    <div
                      onClick={() => this.changeTab(2)}
                      className={this.getSelectedTabClassName(2)}
                    >
                      <span className="tabName">Videos</span>
                    </div>
                    <div
                      onClick={() => this.changeTab(3)}
                      className={this.getSelectedTabClassName(3)}
                    >
                      <span className="tabName">Albums</span>
                    </div>
                  </div>
                  {album_status == 'active' ? (
                    <div className="rightArea">
                      <button
                        onClick={() =>
                          (window.location.href = `/groupalbum/${this.props.match.params.id}`)
                        }
                      >
                        + Create Album
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = `/viewgroup/${this.props.match.params.id}`)
                        }
                      >
                        Add Photos/Videos
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="hLine" />
                <div className="mediaAreaWrapper">
                  {currentTab === 1 && (
                    <PhotosTab groupattach={this.state.groupattach} />
                  )}
                  {currentTab === 2 && (
                    <VideosTab groupvideos={this.state.groupvideos} />
                  )}
                  {currentTab === 3 && (
                    <AlbumsTab groupalbum={this.state.albums} />
                  )}
                  {/* {
                                        (album_status == "active") ? popup && (
                                            <CreateNewAlbum handleClose={this.handlePopupOpenClose} />
                                        ) : ""
                                    } */}
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
