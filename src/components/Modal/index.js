import React from 'react';

require('./styles.scss');

function Modal(props) {
  return (
    <div
      className={`modal fade dropdownModal ${
        props.open ? 'show d-block' : 'hide d-none'
      }`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="dropdownHideModalCenterTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex align-items-center">
            <h5 className="modal-title" id="dropdownHideModalLongTitle">
              {props.title}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={(e) => props.handleclose(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>{props.content}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary cancel-btn"
              data-dismiss="modal"
              onClick={(e) => props.handleclose(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary yes-btn"
              onClick={(e) => props.handlenext()}
            >
              {props.yesBtnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
