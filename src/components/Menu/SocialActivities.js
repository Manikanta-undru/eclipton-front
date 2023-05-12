import React from 'react';
import A from '../A';
import './styles.scss';
import images from '../../assets/images/images';

function SocialActivities(props) {
  return (
    <div className="widget cardBody SocialMenus">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="widgetTitle">
              <i className="fa fa-bars" /> <span>Activities</span>
            </li>
          </ul>

          <ul className="list-group w-100 menu">
            {/* <li className={"list-group-item d-flex justify-content-between align-items-center "+(props.current == '/' && 'current')}>
                <A href="/" className="align-items-center d-flex"><i className="fa fa-home aicon"></i> Home</A>
              </li> */}
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == '/profile' && 'current'
              }`}
            >
              <A
                href={`/viewgroup/${props.group_id}`}
                className="align-items-center d-flex"
              >
                <img src={images.media} />
                Home
              </A>
            </li>
            {/* <li
              className={
                "list-group-item d-flex justify-content-between align-items-center " +
                (props.current == "trading" && "current")
              }
            >
              <A
                href="/ViewMemberGroup/viewInsights"
                className="align-items-center d-flex"
              >
                <img src={images.insights} /> Insights
              </A>
            </li> */}
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 'blogs' && 'current'
              }`}
            >
              <A
                href={`/messages/${props.group_id}`}
                className="align-items-center d-flex"
              >
                <img src={images.message} /> Message
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 'gigonomy' && 'current'
              }`}
            >
              <A
                href={`/events/${props.group_id}`}
                className="align-items-center d-flex"
              >
                <img src={images.media} /> Events
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 'gigonomy' && 'current'
              }`}
            >
              <A
                href={`/groupmembers/${props.group_id}`}
                className="align-items-center d-flex"
              >
                <img src={images.member} /> Members
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 'gigonomy' && 'current'
              }`}
            >
              <A
                href={`/groupmedia/${props.group_id}`}
                className="align-items-center d-flex"
              >
                <img src={images.media} /> Media
              </A>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 'gigonomy' && 'current'
              }`}
            >
              <A
                href={`/settings/${props.group_id}`}
                className="align-items-center d-flex"
              >
                <img src={images.media} /> Settings
              </A>
            </li>

            {/* <li className={"list-group-item d-flex justify-content-between align-items-center "+(props.current == 'feed' && 'current')}>
                <A href="/feed" className="align-items-center d-flex"><span className="aicon newsfeed"></span> Feed</A>
              </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SocialActivities;
