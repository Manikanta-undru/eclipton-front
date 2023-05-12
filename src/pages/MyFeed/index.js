import React from 'react';
import PopularArticles from '../../components/Blog/PopularArticles';
import RecommendedFriends from '../../components/Friends/RecommendedFriends';
import SocialMenu from '../../components/Menu/SocialMenu';
import CreatePost from '../../components/Post/CreatePost';
import FilteredPosts from '../../components/Post/FilteredPosts';
import Posts from '../../components/Post/Posts';
import WalletBalanceWidget from '../../components/Wallet/balanceWidget';
import { GetAssetImage } from '../../globalFunctions';

require('./styles.scss');

class MyFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      filter: '',
      latestpost: {},
    };
  }

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {}

  refreshHighlights = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.setState({
          refreshing: false,
        });
      }
    );
  };

  filterPosts = (opt) => {
    this.setState({
      latestpost: {},
      filter: opt,
    });
  };

  render() {
    return (
      // <!-- Wall container -->
      <div className="feedPage">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <WalletBalanceWidget {...this.props} />
              <SocialMenu {...this.props} current="feed" />
              <RecommendedFriends {...this.props} />
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column">
              {/* <!-- create post container --> */}
              <CreatePost setState={this.setStateFunc} {...this.props} />
              {/* <!-- end create post container --> */}

              {/* <!-- post container --> */}
              <div className="feedFilters mt-3">
                <h3 className="subtitle">My Feed</h3>
                <ul className="feedFilters_tab">
                  <li>
                    <button
                      className={`btn ${
                        this.state.filter == '' ? 'btn-main' : 'btn-outline'
                      }`}
                      onClick={(e) => this.filterPosts('')}
                    >
                      All
                    </button>
                  </li>
                  <li>
                    <button
                      className={`btn ${
                        this.state.filter == 'saved'
                          ? 'btn-main'
                          : 'btn-outline'
                      }`}
                      onClick={(e) => this.filterPosts('saved')}
                    >
                      Saved
                    </button>
                  </li>
                  <li>
                    <button
                      className={`btn ${
                        this.state.filter == 'hidden'
                          ? 'btn-main'
                          : 'btn-outline'
                      }`}
                      onClick={(e) => this.filterPosts('hidden')}
                    >
                      Hidden
                    </button>
                  </li>
                  {this.props.currentUser.twitterID != null &&
                    this.props.currentUser.twitterID > 0 && (
                      <li>
                        <button
                          className={`btn ${
                            this.state.filter == 'twitter'
                              ? 'btn-main'
                              : 'btn-outline'
                          }`}
                          onClick={(e) => this.filterPosts('twitter')}
                        >
                          Posted on Twitter
                        </button>
                      </li>
                    )}
                  {/* <li><button className={"btn "+(this.state.filter == 'highlighted' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('highlighted')}>Highlighted</button></li> */}
                </ul>
              </div>
              {this.state.filter == '' ? (
                <Posts
                  setState={this.setStateFunc}
                  latestpost={this.state.latestpost}
                  {...this.props}
                  refreshHighlights={this.refreshHighlights}
                />
              ) : (
                <FilteredPosts
                  setState={this.setStateFunc}
                  latestpost={this.state.latestpost}
                  {...this.props}
                  filter={this.state.filter}
                />
              )}

              {/* <!-- end post container --> */}
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <PopularArticles />
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
        {/* <!-- image Modal --> */}
        <div
          id="myModal"
          className="modal fade post-image-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <img
                  src={GetAssetImage('post-image@2x.png')}
                  className="img-responsive"
                />
              </div>
            </div>
          </div>
        </div>
        {/* <!-- end image Modal --> */}
        {/* <!-- Hide Modal --> */}
        <div
          className="modal fade dropdownModal"
          id="dropdownHideModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="dropdownHideModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header d-flex align-items-center">
                <img src={GetAssetImage('plus-icon.png')} alt="" />
                <h5 className="modal-title" id="dropdownHideModalLongTitle">
                  Confirmation
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Do you really want to see this post ever again?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary cancel-btn"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary yes-btn">
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Remove Modal --> */}
        <div
          className="modal fade dropdownModal"
          id="dropdownRemoveModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="dropdownRemoveModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header d-flex align-items-center">
                <img src={GetAssetImage('plus-icon.png')} alt="" />
                <h5 className="modal-title" id="dropdownRemoveModalLongTitle">
                  Confirmation
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Do you really want to remove this post?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary cancel-btn"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary yes-btn">
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyFeed;
