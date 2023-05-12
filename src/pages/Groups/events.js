import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../globalFunctions';
import { Memberget } from '../../GroupFunctions';

import { alertBox } from '../../commonRedux';
import {
  particularGroups,
  getEvents,
  JoinEvent,
  getJoinEvents,
  UpdateEvent,
  eventJoinusers,
} from '../../http/group-calls';
import CreateEvent from './createEvent';
import './style/event.scss';
import images from '../../assets/images/images';
import Header from '../../components/Header';
import SocialActivities from '../../components/Menu/SocialActivities';

class Events extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      groupsdet: [],
      events_data: [],
      events_data_on: [],
      events_data_per: [],
      groupmembers: [],
      groupcount: [],
      groupStatus: '',
      joinusers: [],
      ignoreEvent: [],
      remindEvent: [],
      Intercount: [],
      upcomingEvent: [],
    };
  }

  componentDidMount() {
    const grop_id = this.props.match.params.id;
    const userid = this.props.currentUser._id;
    const d = {};
    d.group_id = grop_id;
    particularGroups(d).then(
      (res) => {
        this.setState({
          groupsdet: res,
        });
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
    this.events(this.state.currentTab);
    // common functions
    Memberget(grop_id, userid).then((res) => {
      this.setState({
        groupmembers: res.member,
        groupcount: res.member_count,
        groupStatus: res.create_staus,
      });
    });
    this.getJoinUsers();
  }

  getJoinUsers() {
    const grop_id = this.props.match.params.id;
    const d = {};
    d.group_id = grop_id;
    const joinUsers = [];
    const ignoreStatus = [];
    const remindStatus = [];

    eventJoinusers({}).then((res) => {
      console.log(res, 'result');
      this.setState({ Intercount: res[0] });
    });

    getJoinEvents(d).then((res) => {
      res.map((item) => {
        if (item.notify_status == false) {
          joinUsers[item.event_id] = 'Joined';
        }
        if (item.ignore_status == true) {
          ignoreStatus[item.event_id] = 'ignored';
        }
        if (item.notify_status == true) {
          remindStatus[item.event_id] = 'Enable';
        }
      });
      this.setState({
        joinusers: joinUsers,
        ignoreEvent: ignoreStatus,
        remindEvent: remindStatus,
      });
    });
  }

  events = (newValue) => {
    const grop_id = this.props.match.params.id;
    const d = {};
    d.group_id = grop_id;
    getEvents(d).then(
      (res) => {
        const results_online = [];
        const results_personal = [];
        const coming_events = [];
        res.map((item) => {
          if (item.event_type == 'Online' && newValue == 1) {
            results_online.push(item);
            this.setState({
              events_data_on: results_online,
            });
          } else if (item.event_type == 'Personal' && newValue == 2) {
            results_personal.push(item);
            this.setState({
              events_data_per: results_personal,
            });
          } else {
            this.setState({
              events_data: res,
            });
          }
          const currentDate = new Date().toISOString().split('T')[0];
          const eventdate = new Date(item.startDate)
            .toISOString()
            .split('T')[0];
          if (
            currentDate < item.startDate &&
            this.props.currentUser._id != item.userid
          ) {
            if (coming_events.length == 0) {
              coming_events.push(item);
              this.setState({
                upcomingEvent: coming_events,
              });
            }
          }
        });
      },
      (err) => {
        alertBox(true, 'something went error', 'Error');
      }
    );
  };

  handleJoin = (event_id, updateMode) => {
    const grop_id = this.props.match.params.id;
    let msg;
    const d = {};
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

  handleEventUpdate = (event_id, updateMode) => {
    const grop_id = this.props.match.params.id;
    const d = {};
    d.group_id = grop_id;
    d.event_id = event_id;
    if (updateMode == 'ignore') {
      d.ignore_status = 1;
    } else if (updateMode == 'notify_off') {
      d.notify_disable_status = 1;
    }
    UpdateEvent(d).then(
      (res) => {
        if (res) {
          alertBox(true, 'Successfully Updated event', 'Success');
          setTimeout(() => {
            window.location.href = '';
          }, 3000);
        }
      },
      (err) => {
        console.log(err.data.message, 'datas');
        alertBox(true, err.data.message, 'Error');
      }
    );
  };

  handleCancel = (event_id) => {
    const grop_id = this.props.match.params.id;
    const d = {};
    d.group_id = grop_id;
    d.event_id = event_id;
    d.cancel_status = 1;
    UpdateEvent(d).then(
      (res) => {
        if (res) {
          alertBox(true, 'Successfully cancel event', 'Success');
          setTimeout(() => {
            window.location.href = '';
          }, 3000);
        }
      },
      (err) => {
        alertBox(true, err.data.message, 'Error');
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
      upcomingEvent,
    } = { ...this.state };
    let events_datas;
    if (currentTab == 0) {
      events_datas = events_data;
    } else if (currentTab == 1) {
      events_datas = events_data_on;
    } else {
      events_datas = events_data_per;
    }
    const Grups = events_datas.map((events, index) => (
      <div className="event" key={index}>
        <div className="image">
          <img src={events.banner} alt="eventImg" />
          <li className="list-group-item moreDetails pointer  dropdown">
            <img src={images.dots} alt="more" />
            <div className="dropdown-menu hasUpArrow dropdown-menu-right">
              {events.userid != this.props.currentUser._id ? (
                <>
                  {this.state.joinusers[events._id] == 'Joined' ? (
                    <>
                      <a className="dropdown-item">
                        <span className="m-1">Joined</span>
                      </a>{' '}
                      {this.state.ignoreEvent[events._id] != 'ignored' ? (
                        <a className="dropdown-item">
                          <span
                            className="m-1"
                            onClick={(e) =>
                              this.handleEventUpdate(events._id, 'ignore')
                            }
                          >
                            Ignore
                          </span>
                        </a>
                      ) : (
                        ''
                      )}
                    </>
                  ) : (
                    <a className="dropdown-item">
                      <span
                        className="m-1"
                        onClick={(e) => this.handleJoin(events._id, 'Join')}
                      >
                        Join
                      </span>
                    </a>
                  )}

                  {this.state.joinusers[events._id] != 'Joined' &&
                  this.state.remindEvent[events._id] != 'Enable' ? (
                    <a
                      className="dropdown-item"
                      onClick={(e) => this.handleJoin(events._id, 'Remind')}
                    >
                      <span className="m-1">Remind me later</span>
                    </a>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                ''
              )}
              {events.userid == this.props.currentUser._id &&
              events.cancel_status == false ? (
                <a
                  className="dropdown-item"
                  onClick={(e) => this.handleCancel(events._id)}
                >
                  <span className="m-1 red">cancel</span>
                </a>
              ) : (
                ''
              )}

              {events.cancel_status == true ? (
                <a className="dropdown-item">
                  <span className="m-1 red">cancelled</span>
                </a>
              ) : (
                ''
              )}
            </div>
          </li>
        </div>
        <div className="details">
          <div>
            <span
              className="eventName"
              onClick={(e) =>
                (window.location.href = `/eventsdetails/${events._id}`)
              }
            >
              {events.name}
            </span>
            <span className="time">{formatDate(events.startDate)}</span>
          </div>
          <span className="interested">
            {this.state.Intercount[events._id]
              ? this.state.Intercount[events._id]
              : 0}{' '}
            interested
          </span>
        </div>
        <div className="btn-Interested">
          {events.userid != this.props.currentUser._id ? (
            <>
              {this.state.joinusers[events._id] == 'Joined' ? (
                <>
                  {' '}
                  <button>Interested</button>{' '}
                </>
              ) : (
                <button onClick={(e) => this.handleJoin(events._id, 'Join')}>
                  Join
                </button>
              )}
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    ));
    const Upevent = upcomingEvent.map((events) => (
      <>
        <div className="image" key={events}>
          <img src={events.banner} alt="eventImg" key={events} />
        </div>
        <div className="details" key={events}>
          <div key={events}>
            <span className="eventName" key={events}>
              {events.name}
            </span>
            <span className="time" key={events}>
              {formatDate(events.startDate)}
            </span>
          </div>
          <span className="interested" key={events}>
            {this.state.Intercount[events._id]
              ? this.state.Intercount[events._id]
              : 0}{' '}
            interested
          </span>
        </div>
        <div style={{ marginLeft: 'auto' }} key={events}>
          {this.state.joinusers[events._id] == 'Joined' ? (
            <>
              {' '}
              <button key={events}>Interested</button>{' '}
            </>
          ) : (
            <button
              onClick={(e) => this.handleJoin(events._id, 'Join')}
              key={events}
            >
              Join
            </button>
          )}
        </div>
      </>
    ));
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
                group_id={this.props.match.params.id}
                user_id={this.props.currentUser._id}
              />
              <div className="groupAreaWrapper">
                <div className="group">
                  <div className="groupImg">
                    <img src={this.state.groupsdet.banner} alt="img" />
                  </div>
                  <span className="groupName">{this.state.groupsdet.name}</span>
                  <div className="groupAccessType">
                    <img src={images.locked} alt="locked" />
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
              <div className="eventsOverallAreaWrapper">
                {currentTab !== 3 && (
                  <>
                    <div className="header">
                      <div className="leftArea">
                        <div>
                          <span>Events</span>
                        </div>
                        <div
                          className={this.getSelectedTabClassName(0)}
                          onClick={() => this.changeTab(0)}
                        >
                          <span className="tabName">All</span>
                        </div>
                        <div
                          className={this.getSelectedTabClassName(1)}
                          onClick={() => this.changeTab(1)}
                        >
                          <span className="tabName">Online Events</span>
                        </div>
                        <div
                          className={this.getSelectedTabClassName(2)}
                          onClick={() => this.changeTab(2)}
                        >
                          <span className="tabName">Personal Events</span>
                        </div>
                      </div>
                      {groupStatus == 'active' ||
                      this.props.currentUser._id ==
                        this.state.groupsdet.userid ? (
                        <div className="rightArea">
                          <button onClick={() => this.changeTab(3)}>
                            + Create Event
                          </button>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="hLine" />
                  </>
                )}

                {currentTab === 0 || currentTab === 1 || currentTab === 2 ? (
                  <div className="eventsAreaWrapper">
                    {(currentTab == 0 && events_data.length > 0) ||
                    events_data_on.length > 0 ||
                    events_data_per.length > 0
                      ? Grups
                      : ''}

                    {(currentTab === 0 && events_data.length == 0) ||
                    (currentTab === 1 && events_data_on.length == 0) ||
                    (currentTab === 2 && events_data_per.length == 0) ? (
                      <p>No event Found</p>
                    ) : (
                      ''
                    )}
                  </div>
                ) : (
                  ''
                )}
                {currentTab === 3 && (
                  <CreateEvent
                    grop_id={this.props.match.params.id}
                    upcomingEvent={upcomingEvent}
                  />
                )}
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              {upcomingEvent.length > 0 ? (
                <>
                  <span className="upcoming">Upcoming Events</span>
                  <div className="event">{Upevent}</div>
                </>
              ) : (
                ''
              )}
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Events;
