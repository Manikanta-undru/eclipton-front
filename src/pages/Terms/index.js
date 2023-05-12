import React from 'react';
import { GetAssetImage } from '../../globalFunctions';

class TermsAndConditions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latestpost: {},
    };
  }

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {}

  render() {
    return (
      // <!-- Wall container -->
      <div>
        <div className="container my-wall-container">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column" />

            <div className="col-sm empty-container-with-border center-column">
              <h3 className="subtitle border-bottom pb-2">
                Terms and Conditions
              </h3>
            </div>

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column" />
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

export default TermsAndConditions;
