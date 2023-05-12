import React, { useEffect, useState, createRef } from 'react';
import { Link } from 'react-router-dom';
import ChatPanel from '../../../components/ChatPanel/ChatPanel';
import DebouncedInput from '../../../components/DebouncedInput/DebouncedInput';
import { profilePic } from '../../../globalFunctions';
import { myGigsPurchased } from '../../../http/gig-calls';
import './style.scss';

export default function BuyerRequest(props) {
  const [gigs, setGigs] = useState([]);
  const [isload, setLoad] = useState(false);
  const [chats, chatcontent] = useState([]);

  const [search, setSearch] = React.useState('');
  const scrollDiv = createRef();
  useEffect(() => {
    getPurchased();
    // scrollSmoothHandler();
  }, [search]);

  const scrollSmoothHandler = () => {
    scrollDiv.current.scrollIntoView({ behavior: 'smooth' });
  };

  const getPurchased = () => {
    let keyObj = {};
    if (search != '') {
      keyObj = { id: props.match.params.id, key: search };
    } else {
      keyObj = { id: props.match.params.id };
    }
    myGigsPurchased(keyObj).then((resp) => {
      setGigs(resp);
      setLoad(true);
      if (resp[0] !== undefined) {
        setSelectedUser(resp[0]);
      }
    });
  };

  const chatopen = (chatdet) => {
    setSelectedUser(chatdet);
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
    <div className="passionomyDashview">
      <div className="container-fluid dashContainer">
        <div className="row">
          <div className="col-lg-4 col-md-5">
            <div className="leftSearch">
              <div className="form-group hasSearch">
                <span className="fa fa-search form-control-feedback" />
                <DebouncedInput
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={(val) => setSearch(val)}
                />
              </div>
              <div className="leftSearch_profile">
                {gigs.length == 0 && isload == true ? (
                  <div className="leftSearch_pro_list d-flex justify-content-between">
                    <div className="left">
                      <p>No Match</p>
                    </div>
                  </div>
                ) : null}
                {gigs.map((item, index) => (
                  <div
                    className="leftSearch_pro_list d-flex justify-content-between"
                    style={{ cursor: 'pointer' }}
                    onClick={() => chatopen(item)}
                    key={index}
                  >
                    <div className="left">
                      <div className="left_count">
                        <Link to={`/u/${item.giguserinfo._id}`}>
                          <img
                            src={profilePic(
                              item.giguserinfo.avatar,
                              item.giguserinfo.name
                            )}
                          />
                        </Link>
                      </div>
                      <div className="leftSearch_name">
                        <h5 className="pt-1">
                          <Link to={`/u/${item.giguserinfo._id}`}>
                            {item.giguserinfo.name}
                          </Link>
                        </h5>
                        {/* <span><i class="fa fa-stop-circle"></i> Freezed</span> */}
                      </div>
                    </div>
                    <div className="right">
                      <p>Status</p>
                      <a
                        href="#"
                        onClick={() => chatopen(item)}
                        className="acceptBg"
                      >
                        {item.status == 1
                          ? 'Pending'
                          : item.status == 2
                          ? 'Accepted'
                          : item.status == -1
                          ? 'Rejected'
                          : item.status == 3
                          ? 'Completed'
                          : item.status == 4
                          ? 'Submitted'
                          : item.status == 5
                          ? 'Payment Released'
                          : ''}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-md-7">
            <div className="rightchatBox">
              <ChatPanel
                {...props}
                chat={selectedUser}
                panel=""
                updateStatus={updateStatus}
                chatcontents={chats}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
