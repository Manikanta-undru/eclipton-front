import React from 'react';
import AuthorBio from '../../components/Blog/AuthorBio';
import PopularThisWeek from '../../components/Blog/PopularThisWeek';
import CategoryBlogs from '../../components/Post/CategoryBlogs';
import { GetAssetImage } from '../../globalFunctions';

require('./styles.scss');

class AuthorWiseBlogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'General',
      refreshing: false,
      filter: '',
      authorid: null,
      latestpost: {},
    };
  }

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    if (this.props.match.params.id != undefined) {
      this.setState({
        authorid: this.props.match.params.id,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.category != prevProps.match.params.category) {
      if (this.props.match.params.category != 'all') {
        this.setState({
          current: this.props.match.params.category,
        });
      } else {
        this.setState({
          current: 'General',
        });
      }
    }
  }

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
      <div className="myBlogsPage">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              {this.state.authorid != null && (
                <AuthorBio
                  authorid={this.state.authorid}
                  {...this.props}
                  current={this.state.current}
                />
              )}
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column">
              <h2 className="subtitle mt-1">{this.state.current}</h2>

              <CategoryBlogs
                category={this.state.current}
                setState={this.setStateFunc}
                latestpost={this.state.latestpost}
                {...this.props}
                refreshHighlights={this.refreshHighlights}
                type="blogs"
              />
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <PopularThisWeek />
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

export default AuthorWiseBlogs;
