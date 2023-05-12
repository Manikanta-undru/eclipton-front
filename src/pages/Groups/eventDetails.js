import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../globalFunctions';

import { alertBox } from '../../commonRedux';
import {
  particularGroups,
  getEvents,
  eventJoinusers,
  getJoinEvents,
  JoinEvent,
} from '../../http/group-calls';
import './style/event.scss';
import './style/eventDetails.scss';
import Images from '../../assets/images/images';
import Header from '../../components/Header';
import SocialActivities from '../../components/Menu/SocialActivities';

class EventDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      groupsdet: [],
      events_data: [],
      group_id: '',
      Intercount: [],
      joinusers: [],
    };
  }

  componentDidMount() {
    const event_id = this.props.match.params.id;
    const userid = this.props.currentUser._id;

    const d = {};
    d.event_id = event_id;
    getEvents(d).then(
      (res) => {
        console.log(res, 'res');
        const d = {};
        d.group_id = res.group_id;
        particularGroups(d).then(
          (result) => {
            this.setState({
              groupsdet: result,
            });
          },
          (err) => {
            alertBox(true, err, 'Error');
          }
        );

        getJoinEvents(d).then((ress) => {
          const joinUsers = [];
          ress.map((item) => {
            if (item.notify_status == false) {
              joinUsers[item.event_id] = 'Joined';
            }
          });
          this.setState({
            joinusers: joinUsers,
          });
        });
        this.setState({ events_data: res });
      },
      (err) => {
        alertBox(true, 'something went error', 'Error');
      }
    );

    eventJoinusers({}).then((res) => {
      console.log(res, 'result');
      this.setState({ Intercount: res[0] });
    });
  }

  handleJoin = (group_id, event_id, updateMode) => {
    const grop_id = group_id;
    const d = {};
    let msg = '';
    d.group_id = grop_id;
    d.event_id = event_id;
    if (updateMode == 'Remind') {
      d.notify_status = 1;
    }
    JoinEvent(d).then(
      (res) => {
        if (res) {
          if (updateMode == 'Remind') {
            msg = 'Remind later Updated';
          } else {
            msg = 'Successfully joined event';
          }
          alertBox(true, msg, 'Success');
          setTimeout(() => {
            window.location.href = '';
          }, 3000);
        }
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
  };

  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
    this.events(newValue);
  };

  getSelectedTabClassName = (tabValue) => {
    const { currentTab } = { ...this.state };
    if (tabValue === currentTab) return 'tab selected';
    return 'tab';
  };

  render() {
    const {
      currentTab,
      events_data,
      events_data_on,
      events_data_per,
      groupStatus,
    } = { ...this.state };
    let events_datas;
    if (currentTab == 0) {
      events_datas = events_data;
    } else if (currentTab == 1) {
      events_datas = events_data_on;
    } else {
      events_datas = events_data_per;
    }

    return (
      <div className="onlinePersonalEvents">
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser}
        />
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <SocialActivities
                group_id={this.state.groupsdet._id}
                user_id={this.props.currentUser._id}
              />
              <div className="groupAreaWrapper">
                <div className="group">
                  <div className="groupImg">
                    <img src={this.state.groupsdet.banner} alt="img" />
                  </div>
                  <span className="groupName">{this.state.groupsdet.name}</span>
                  <div className="groupAccessType">
                    <img src={Images.locked} alt="locked" />
                    <span> {this.state.groupsdet.privacy} Group</span>
                  </div>
                  <span className="groupDescription">
                    {this.state.groupsdet.description}
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
              <div className="eventDetailsAreaWrapper">
                <div className="top">
                  <img src={this.state.events_data.banner} alt="img" />
                  <div className="details">
                    <span className="heading">
                      {this.state.events_data.name}
                    </span>
                    <span className="time">
                      {formatDate(this.state.events_data.startDate)}
                    </span>
                    <span className="place">
                      {' '}
                      {this.state.events_data.location}
                    </span>
                  </div>
                </div>
                <div className="bottom">
                  <span className="about">About</span>
                  <div className="hLine" />
                  <ul>
                    <li>
                      {this.state.Intercount[this.state.events_data._id]
                        ? this.state.Intercount[this.state.events_data._id]
                        : 0}{' '}
                      People Responded
                    </li>
                    <li>{this.state.events_data.description}</li>
                    {/* <li>Duration: 4hr</li> */}
                  </ul>
                  <div className="hLine" />
                  <div className="buttonArea">
                    {this.state.events_data.userid !=
                    this.props.currentUser._id ? (
                      <>
                        {this.state.joinusers[this.state.events_data._id] ==
                        'Joined' ? (
                          <>
                            {' '}
                            <button className="gray"> Interested</button>{' '}
                          </>
                        ) : (
                          <button
                            className="gray"
                            onClick={(e) =>
                              this.handleJoin(
                                this.state.events_data.group_id,
                                this.state.events_data._id,
                                'Join'
                              )
                            }
                          >
                            Join
                          </button>
                        )}
                      </>
                    ) : (
                      ''
                    )}

                    <button className="gray">Invite</button>
                    <button>Share</button>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <span className="upcoming">Upcoming Events</span>
              <div className="event" onClick={() => this.changeTab(1)}>
                <div className="image">
                  <img src={Images.event5} alt="eventImg" />
                </div>
                <div className="details">
                  <div>
                    <span className="eventName">Cryoto traders club</span>
                    <span className="time">Thu 25, Nov At 02:00</span>
                  </div>
                  <span className="interested">845 interested</span>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <button>Interested</button>
                </div>
              </div>
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default EventDetails;
