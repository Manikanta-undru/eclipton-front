import React from 'react';
import './style.scss';

function Modal(props) {
  const divStyle = {
    display: props.displayModal ? 'block' : 'none',
  };
  function closeModal(e) {
    e.stopPropagation();
    props.closeModal();
  }
  return (
    <div className="modal" onClick={closeModal} style={divStyle}>
      <div className="overlay close-modal" />
      <div className="content" role="document">
        {/* <div className="headTitle">
               <span 
                  className="close"
                  onClick={ closeModal }>&times;
               </span>
            </div> */}
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {props.children}
          <span className="close" onClick={closeModal}>
            &times;
          </span>
        </div>
      </div>
    </div>
  );
}
export default Modal;
