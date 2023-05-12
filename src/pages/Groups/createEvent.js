import React from 'react';
import images from '../../assets/images/images';
import './style/createevent.scss';

function CreateEvent(props) {
  return (
    <div className="createEventAreaWrapper">
      <div className="createEventArea">
        <div className="header">
          <span>Create Event</span>
        </div>
        <div className="hLine" />
        <div className="eventTypeArea">
          <div className="eventType">
            <img src={images.online} alt="img" />
            <span className="heading">Online</span>
            <span className="description">
              Video chat with Events, broadcast with Eclipton Live or add an
              external link.
            </span>
            <button
              onClick={(e) =>
                (window.location.href = `/onlineevent/${props.grop_id}`)
              }
            >
              Create Event
            </button>
          </div>
          <div className="eventType">
            <img src={images.online} alt="img" />
            <span className="heading">In Person</span>
            <span className="description">
              Video chat with Events, broadcast with Eclipton Live or add an
              external link.
            </span>
            <button
              onClick={(e) =>
                (window.location.href = `/personalevent/${props.grop_id}`)
              }
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
