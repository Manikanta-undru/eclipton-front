import React from 'react';
import A from '../../A';

function CreateGigWidget(props) {
  return (
    <div className="text-left gigCreateMenu">
      <A href="/passionomy/gigs/add" className="widgetButtonMenu ">
        <i className="fa fa-plus" /> Create Gig
      </A>
      {/* 
    <A href="/passionomy/request" className="widgetButtonMenu mt-4">
    <i className="fa fa-plus"></i> Create Gig Request
    </A> */}
      {props.extra && (
        <>
          <A href="/passionomy/my-gigs" className="widgetButtonMenu mt-3">
            <i className="fa fa-handshake-o" /> My Gigs
          </A>

          {/* <A href="/passionomy/requests" className="widgetButtonMenu mt-3">
    <i className="fa fa-send"></i> All Gig Requests
    </A> */}
        </>
      )}
    </div>
  );
}

export default CreateGigWidget;
