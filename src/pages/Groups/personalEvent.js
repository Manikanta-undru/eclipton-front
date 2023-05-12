import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import images from '../../assets/images/images';
import Header from '../../components/Header';
import SocialActivities from '../../components/Menu/SocialActivities';
import { alertBox } from '../../commonRedux';
import MyGoogleMap from '../../components/Maps/GoogleMap';
import './style/personalEvent.scss';
import './style/addgroup.scss';
import { formatDate } from '../../globalFunctions';

import {
  createEvent,
  particularGroups,
  getEvents,
} from '../../http/group-calls';

function CreatePersonalEvent(props) {
  const [event_names, setEventname] = useState('');
  const [desc, setDescription] = useState('');
  const [banner, setUpload] = useState('');
  const [start_date, setStartdate] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_date, setEnddate] = useState('');
  const [end_time, setEndTime] = useState('');
  const [groupdet, fetchGroup] = useState('');
  const [location, setLocation] = useState('');
  const [upcomingEvent, setEvents] = useState([]);

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
    d.group_id = grop_id;
    getEvents(d).then(
      (res) => {
        const coming_events = [];
        res.map((item) => {
          const currentDate = new Date().toISOString().split('T')[0];
          const eventdate = new Date(item.startDate)
            .toISOString()
            .split('T')[0];
          if (currentDate < eventdate && props.currentUser._id != item.userid) {
            if (coming_events.length == 0) {
              coming_events.push(item);
              setEvents(coming_events);
            }
          }
        });
      },
      (err) => {
        alertBox(true, 'something went error', 'Error');
      }
    );
  });

  const handlefileUpload = (event) => {
    const attachdatam = event.target.files;
    setUpload(attachdatam);
  };

  const submit = async (e, t) => {
    e.preventDefault();
    const attach_data = banner;
    const event_name = event_names;
    const description = desc;
    const startdate = start_date;
    const starttime = start_time;
    const enddate = end_date;
    const endtime = end_time;
    console.log(start_time, 'start_time');
    const err = [];
    if (event_name == '' || event_name == undefined) {
      err.push('Event name is required');
    }
    if (description == '') {
      err.push('Event description is required');
    }
    if (startdate == '' || startdate == undefined) {
      err.push('start Date is required');
    }

    if (enddate == '' || enddate == undefined) {
      err.push('End date is required');
    }

    if (starttime == '' || starttime == undefined) {
      err.push('start Time is required');
    }

    if (endtime == '' || endtime == undefined) {
      err.push('End time is required');
    }
    for (let i = 0; i < attach_data.length; i++) {
      if (attach_data[i].size > '20971520') {
        err.push('Event attachment is must be with in 2 MB');
      }

      if (!attach_data[i].name.match(/\.(png|jpg|jpeg|gif|mp4)$/)) {
        err.push('Event attachment is must be with in jpeg,jpg,png,mp4');
      }
    }

    if (attach_data.length == 0 || attach_data == '') {
      err.push('Event attachment is required');
    }

    console.log(event_names, 'event_name');

    if (err.length > 0) {
      // if(err.length > 2){
      //     alertBox(true,"All fields is required");
      // }else{
      alertBox(true, err.join(', '));
      // }
    } else {
      const formData = new FormData();
      formData.append('userid', props.currentUser._id);
      formData.append('event_name', event_name);
      formData.append('description', desc);
      formData.append('startTime', starttime);
      formData.append('endTime', endtime);
      formData.append('startDate', startdate);
      formData.append('endDate', enddate);
      formData.append('event_type', 'Personal');
      for (let i = 0; i < attach_data.length; i++) {
        formData.append('banner', attach_data[i]);
      }
      formData.append('group_id', props.match.params.id);
      createEvent(formData).then(async (resp) => {
        if (resp.message == 'error') {
          alertBox(true, resp.errors);
        } else if (resp.message == 'create success') {
          alertBox(true, 'event Created Successfully!', 'success');
          setTimeout(() => {
            window.location.href = `/events/${props.match.params.id}`;
          }, 3000);
        } else {
          alertBox(true, 'Error created event!');
        }
      });
    }
  };
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
            {formatDate(events.startDate)}{' '}
          </span>
        </div>
        {/* <span className="interested">{(this.state.Intercount[events._id]!= undefined) ? this.state.Intercount[events._id] : 0} interested</span> */}
      </div>
      <div style={{ marginLeft: 'auto' }} key={events}>
        {/* {
                    (this.state.joinusers[events._id] == "Joined") ? <> <button>Interested</button> </> : <button onClick={(e) => this.handleJoin(events._id, "Join")}>Join</button>
                } */}
      </div>
    </>
  ));
  return (
    <div className="createPersonalEventAreaWrapper">
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
                <div className="groupImg">
                  <img src={groupdet.banner} alt="img" />
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
            <div className="createEventArea">
              <div className="header">
                <span>Create Personal Event</span>
              </div>

              <div className="hLine" />
              <br />
              <form onSubmit={(e) => submit(e, 1)} method="post">
                <div className="eventForm">
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <label>Name your group</label>
                          <input
                            type="text"
                            className="form-control w-100"
                            placeholder="Event name"
                            name="event_name"
                            value={event_names}
                            onChange={(e) => {
                              setEventname(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label>Start Date</label>
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
                      <div className="col-6">
                        <div className="form-group">
                          <label>Start Time</label>
                          <input
                            type="time"
                            className="form-control w-100"
                            placeholder="Start Time"
                            value={start_time}
                            onChange={(e) => {
                              setStartTime(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label>End Date</label>
                          <input
                            type="date"
                            className="form-control w-100"
                            placeholder="End date"
                            value={end_date}
                            onChange={(e) => {
                              setEnddate(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label>End Time</label>
                          <input
                            type="time"
                            className="form-control w-100"
                            placeholder="End time"
                            value={end_time}
                            onChange={(e) => {
                              setEndTime(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-12 location mb-4">
                        <MyGoogleMap />
                      </div>
                      <br />
                      <br />

                      {/* <div className="col-12 location mb-4">
                                                <label>Location</label>
                                                <div className="input-group mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Username"
                                                        aria-label="Username"
                                                        aria-describedby="basic-addon1"
                                                    />
                                                    <div className="input-group-prepend">
                                                        <span
                                                            onClick={(e) => setLocation(true)}
                                                            className="input-group-text"
                                                            id="basic-addon1"
                                                        >
                                                            <i className="fa fa-search"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div> */}
                      <div className="col-12">
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            onChange={(e) => {
                              setDescription(e.target.value);
                            }}
                            className="form-control w-100"
                            placeholder="Description"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label>Upload Cover Photos</label>
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) => {
                              handlefileUpload(e);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <span className="text-muted">
                          We recommended size 800X400
                        </span>
                      </div>
                      <div className="col-12 mb-3">
                        <button
                          className="float-right"
                          onClick={(e) => submit(e, 0)}
                        >
                          Create Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
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

export default CreatePersonalEvent;
