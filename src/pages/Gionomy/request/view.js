import React from 'react';
import GigMenu from '../../../components/Menu/GigMenu';
import { myGigRequests } from '../../../http/gig-calls';
import { profilePic, pic } from '../../../globalFunctions';

require('./style.scss');

class ViewGigRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      posts: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    myGigRequests().then(
      (resp) => {
        this.setState({
          posts: resp,
        });
      },
      (err) => {}
    );
  };

  render() {
    return (
      <div className="ViewGigRequest">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            <div className="col-sm empty-container-with-out-border left-column" />
            <div className="col-sm empty-container-with-out-border center-column">
              <section className="cards">
                {this.state.posts.length == 0 ? (
                  <p className="no-found">No Requests Found</p>
                ) : (
                  this.state.posts.map((gig, i) => (
                    <div
                      className="card"
                      onClick={() => {
                        window.location.href = `/passionomy/request/${gig._id}`;
                      }}
                      key={i}
                    >
                      <div
                        className="card-image"
                        style={{
                          backgroundImage: `url(${pic(
                            gig.contents[0] == undefined
                              ? ''
                              : gig.contents[0].content_url
                          )})`,
                        }}
                      />
                      <div className="card-container">
                        <span style={{ fontSize: '14px' }}>
                          <img
                            className="media-object pic"
                            src={profilePic(
                              gig.userinfo.avatar,
                              gig.userinfo.name
                            )}
                            alt="Avatar"
                          />
                          {gig.userinfo.name}
                        </span>
                        <p>{gig.subject}</p>
                        <p className="price">
                          Budget{' '}
                          <span style={{ fontSize: '14px', color: 'blue' }}>
                            {gig.preferedCurrency ?? 'USD'} {gig.budget}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </section>
            </div>
            <div className="col-sm empty-container-with-out-border right-column">
              <GigMenu {...this.props} />
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewGigRequest;
