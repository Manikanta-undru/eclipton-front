import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import ChatPanel from '../../../components/ChatPanel/ChatPanel';
import { pic } from '../../../globalFunctions';
import { purchasedGigs } from '../../../http/gig-calls';
import { UserPanel } from '../Seller/Seller';
import './Purchased.scss';

export default function PurchasedGigs(props) {
  const setUser = (user) => {
    user.buyerPanel = true;
    user.sellerPanel = false;
    user.buyerStatus = user.status;
    return user;
  };

  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    getPurchased();
  }, []);

  const getPurchased = () => {
    purchasedGigs().then((resp) => {
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

  return (
    <div className="buyer-screen">
      <div className="container my-wall-container ">
        <div className="row">
          {/* <!-- left column --> */}
          <div className="col-sm empty-container-with-out-border left-column">
            <UserPanel activeIndex={1} {...props} />
          </div>
          {/* <!-- end left column --> */}

          {/* <!-- center column --> */}
          <div className="col-sm empty-container-with-out-border center-column gigs-details-container big">
            <div className="buyer-panel">
              <div className="product-list">
                <div className="widgetTitle">Purchased Gigs</div>
                {gigs.map((item, index) => (
                  <Paper
                    variant="outlined"
                    square
                    className="product-card pointer mt-0"
                    onClick={() => changeUser(item, index)}
                    key={index}
                  >
                    <div
                      className="product-image"
                      style={{
                        backgroundImage: `url(${pic(
                          item.contents[0] == undefined
                            ? ''
                            : item.contents[0].content_url
                        )})`,
                      }}
                    >
                      {/* <img alt={item.subject} src={pic(item.contents[0] == undefined ? '' : item.contents[0].content_url)} /> */}
                    </div>
                    <div
                      className={`product-details ${
                        activeIndex === index && ' selected-item'
                      }`}
                    >
                      <div className="name-cost">
                        <div className="product-name">{item.gigs.subject}</div>
                        <div className="product-cost">
                          {item.currency} {item.amount}
                        </div>
                      </div>
                      <div className="delivery-status">
                        <div className="product-delivery">
                          {item.data.fast
                            ? `Extra Fast ${item.data.days} Day(s) Delivery`
                            : `${
                                item.gigs[`${item.data.plan}Days`]
                              } Day(s) Delivery`}
                        </div>
                        <div className="product-status">
                          status:{' '}
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
              <div className="buyer-chat-panel">
                {gigs.length > 0 && (
                  <ChatPanel {...props} chat={selectedUser} panel="buyer" />
                )}
              </div>
            </div>
          </div>
          {/* <div className="col-sm empty-container-with-out-border right-column">
              
        </div> */}
        </div>
      </div>
    </div>
  );
}
