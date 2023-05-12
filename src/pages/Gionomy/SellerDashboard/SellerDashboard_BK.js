import Paper from '@material-ui/core/Paper';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AssignmentIcon from '@material-ui/icons/Assignment';
import React, { useEffect, useState, createRef } from 'react';
import ChatPanel from '../../../components/ChatPanel/ChatPanel';
import SearchBox from '../../../components/SearchBox/SearchBox';
import { pic, profilePic } from '../../../globalFunctions';
import { myGigsPurchased } from '../../../http/gig-calls';
import './SellerDashboard.scss';

export default function BuyerRequest(props) {
  const [gigs, setGigs] = useState([]);
  const scrollDiv = createRef();
  useEffect(() => {
    getPurchased();
    scrollSmoothHandler();
  }, []);

  const scrollSmoothHandler = () => {
    scrollDiv.current.scrollIntoView({ behavior: 'smooth' });
  };

  const getPurchased = () => {
    myGigsPurchased({ id: props.match.params.id }).then((resp) => {
      setGigs(resp);
      setSelectedUser(resp[0]);
    });
  };

  const [selectedUser, setSelectedUser] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const changeUser = (user, index) => {
    setSelectedUser(gigs[index]);
    setActiveIndex(index);
  };

  const updateStatus = (val) => {
    const temp = [...gigs];
    temp[activeIndex].status = val;
    setGigs(temp);
  };

  return (
    <div className=" other-wall buyer-request">
      {/* <div className="time-left">Time left: <span className="font-bold">47h 32 min</span></div> */}
      <div className="seller-panel">
        {gigs.length > 0 && (
          <Paper variant="outlined" square>
            <div
              className="seller-title pointer"
              onClick={() => {
                props.history.push('/passionomy/dashboard');
              }}
            >
              <ArrowBackIcon />
              Passionomy
            </div>
            <div className="seller-details">
              <div
                className="seller-image"
                style={{
                  backgroundImage: `url(${pic(
                    gigs[0].contents[0] == undefined
                      ? ''
                      : gigs[0].contents[0].content_url
                  )})`,
                }}
              />
              <div className="seller-desc">{gigs[0].gigs.subject}</div>
            </div>
          </Paper>
        )}
      </div>
      <div className="buyer-panel">
        <div className="buyer-list">
          <div className="search-buyer">
            <SearchBox />
          </div>
          {gigs.map((item, index) => (
            <Paper
              variant="outlined"
              onClick={() => changeUser(item, index)}
              square
              className={`buyer-card pointer ${
                activeIndex === index && ' selected-item'
              }`}
              key={index}
            >
              <div
                className="buyer-image"
                style={{
                  backgroundImage: `url(${
                    item.giguserinfo.avatar == undefined
                      ? profilePic()
                      : profilePic(
                          item.giguserinfo.avatar,
                          item.giguserinfo.name
                        )
                  })`,
                }}
              >
                {/* <img alt={item.subject} src={pic(item.contents[0] == undefined ? '' : item.contents[0].content_url)} /> */}
              </div>
              <div className="buyer-details ">
                {/* {
                        item.userid == props.currentUser._id ? <div className="buyer-name">{item.giguserinfo.name}</div> : <div className="buyer-name">{item.userinfo.name}</div>
                      } */}
                {/* <div className="buyer-name">{item.userinfo.name}</div> */}
                <div className="buyer-name">{item.giguserinfo.name}</div>
                <div>
                  <div className="buyer-assignment mt-2">
                    <AssignmentIcon />
                    <span>Freezed</span>
                  </div>
                  <div className="buyer-status text-right">
                    status:
                    <span className={`st${item.status}`}>
                      {' '}
                      {item.status == 1
                        ? 'Pending'
                        : item.status == 2
                        ? 'Accepted'
                        : item.status == -1
                        ? 'Rejected'
                        : item.status == 3
                        ? 'Completed'
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            </Paper>
          ))}
        </div>
        <div className="seller-chat-panel" ref={scrollDiv}>
          <ChatPanel
            {...props}
            chat={selectedUser}
            panel=""
            updateStatus={updateStatus}
          />
          {/* {
            (selectedUser.gig.userid == this.props.currentUser._id) ? <ChatPanel {...props} chat={selectedUser} panel="seller" updateStatus={updateStatus} /> 
            : <ChatPanel {...props} chat={selectedUser} panel="buyer" updateStatus={updateStatus} />
          } */}
        </div>
      </div>
    </div>
  );
}
