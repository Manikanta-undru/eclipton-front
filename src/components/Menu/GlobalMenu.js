import React, { useState, useEffect } from 'react';
import A from '../A';
import { history } from '../../store';
import RewardsWidget from '../RewardsWidget/index';

function GlobalMenu(props) {
  const [current, setCurrent] = useState(props.location.pathname);
  // useEffect(() => {
  //     var path = props.location.pathname;
  //     if(path.indexOf("blogs") != -1){
  //         setCurrent("blogs");
  //     }else{
  //         setCurrent("/");
  //     }
  // },[props.location.pathname]);
  useEffect(() => {
    history.listen((location) => {
      const path = location.pathname.substr(
        location.pathname.lastIndexOf('/') + 1
      );
      // if(path == "blogs"){
      //     setCurrent("blogs");
      // }else{
      setCurrent(path);
      // }
    });
  }, [history]);
  return (
    <>
      <nav className=" navbar navbar-light bg-light navbar--header-bottom secondnav">
        <div className="container">
          <div className="d-flex justify-content-between">
            <A
              className={`nav-link${
                current == '/home' || current == '' ? ' active' : ''
              }`}
              href="/home"
            >
              Home
            </A>
          </div>
          <div className="d-flex justify-content-between">
            <A
              className={`nav-link${current == 'trading' ? ' active' : ''}`}
              href="/wallet/deposit"
            >
              My Wallet
            </A>
          </div>
          {/* <div className="d-flex justify-content-between">
                <A className={"nav-link"+(current == "feed" ? " active" : "")} href="/feed">Feed</A>
            </div> */}
          <div className="d-flex justify-content-between">
            <A
              className={`nav-link${current == 'blogs' ? ' active' : ''}`}
              href="/blogs"
            >
              My Blogs
            </A>
          </div>
          <div className="d-flex justify-content-between">
            <A
              className={`nav-link${current == 'gigs' ? ' active' : ''}`}
              href="/passionomy/dashboard"
            >
              My Gigs
            </A>
          </div>
          {/* <div className="d-flex justify-content-between">
                <A className={"nav-link"+(current == "courses" ? " active" : "")} href="/courses">Courses</A>
            </div>
            <div className="d-flex justify-content-between">
                <A className={"nav-link"+(current == "marketplace" ? " active" : "")} href="/marketplace">Marketplace</A>
            </div>
            <div className="d-flex justify-content-between">
                <A className={"nav-link"+(current == "events" ? " active" : "")} href="/events">Events</A>
            </div>
            <div className="d-flex justify-content-between">
                <A className={"nav-link"+(current == "jobs" ? " active" : "")} href="/jobs">Jobs</A>
            </div>
            <div className="d-flex justify-content-between">
                <A className={"nav-link"+(current == "gigs" ? " active" : "")} href="/passionomy">Gigs</A>
            </div> */}
          {/* <div className="d-flex justify-content-between">
              <a className="nav-link" href="#">+ More</a>
            </div> */}
        </div>
      </nav>
      <nav className=" navbar navbar-light bg-light navbar--header-bottom mobileNav">
        <div>
          <h3>Explore</h3>
        </div>
        <li
          className={`list-group-item d-flex justify-content-between align-items-center ${
            props.current == '/passionomy' && 'current'
          }`}
          onClick={props.openMobNav}
        >
          <A href="/passionomy" className="align-items-center d-flex">
            <i className="fa-solid fa-handshake-simple aicon" /> Passionomy
          </A>
        </li>
        <li
          className={`list-group-item d-flex justify-content-between align-items-center ${
            props.current == '/blogs/all' && 'current'
          }`}
          onClick={props.openMobNav}
        >
          <A href="/blogs/all" className="align-items-center d-flex">
            <i className="fa fa-book aicon" /> Blogs
          </A>
        </li>
        <li
          className={`list-group-item d-flex justify-content-between align-items-center ${
            props.current == '/market-default-view' && 'current'
          }`}
          onClick={props.openMobNav}
        >
          <A href="/market-default-view" className="align-items-center d-flex">
            <i className="fa fa-handshake-o aicon" /> Marketplace
          </A>
        </li>
        <div>
          <h3>My Pages</h3>
        </div>
        <ul className="list-group w-100">
          <li
            className={`list-group-item d-flex justify-content-between align-items-center ${
              props.current == '/profile' && 'current'
            }`}
            onClick={props.openMobNav}
          >
            <A href="/profile" className="align-items-center d-flex">
              <i className="fa fa-user aicon" /> My Profile
            </A>
          </li>
          <li
            className={`list-group-item d-flex justify-content-between align-items-center ${
              props.current == 'trading' && 'current'
            }`}
            onClick={props.openMobNav}
          >
            <A href="/wallet/deposit" className="align-items-center d-flex">
              <i className="fa-solid fa-wallet aicon" /> My Wallet
            </A>
          </li>
          <li
            className={`list-group-item d-flex justify-content-between align-items-center ${
              props.current == 'blogs' && 'current'
            }`}
            onClick={props.openMobNav}
          >
            <A href="/blogs" className="align-items-center d-flex">
              <i className="fa fa-book aicon" /> My Blogs
            </A>
          </li>
          <li
            className={`list-group-item d-flex justify-content-between align-items-center ${
              props.current == 'gigonomy' && 'current'
            }`}
            onClick={props.openMobNav}
          >
            <A
              href="/passionomy/dashboard"
              className="align-items-center d-flex"
            >
              <i className="fa-solid fa-handshake-simple aicon" /> My Gigs
            </A>
          </li>
          <li
            className={`list-group-item d-flex justify-content-between align-items-center ${
              props.current == 'gigonomy' && 'current'
            }`}
            onClick={props.openMobNav}
          >
            <A
              href="/passionomy/gig/purchased"
              className="align-items-center d-flex"
            >
              <i className="aicon fa fa-star-half-empty" /> Purchased Gigs
            </A>
          </li>
          <li
            className={`list-group-item d-flex justify-content-between align-items-center ${
              props.current == 'gigonomy' && 'current'
            }`}
            onClick={props.openMobNav}
          >
            <A
              href="/passionomy/request/my"
              className="align-items-center d-flex"
            >
              <i className="aicon fa fa-send" /> My Gig Requests
            </A>
          </li>

          {/* <li className={"list-group-item d-flex justify-content-between align-items-center "+(current == '/feed' && 'current')}>
                <A href="/feed" className="align-items-center d-flex"><span className="aicon groups"></span> Feed</A>
              </li> */}

          {/* <li className={"list-group-item d-flex justify-content-between align-items-center "+(current == '/courses' && 'current')}>
                <A href="/courses" className="align-items-center d-flex"><span className="aicon courses"></span> Courses</A>
              </li>
              <li className={"list-group-item d-flex justify-content-between align-items-center "+(current == '/events' && 'current')}>
                <A href="/events" className="align-items-center d-flex"><span className="aicon events"></span> Events</A>
              </li>
              <li className={"list-group-item d-flex justify-content-between align-items-center "+(current == '/jobs' && 'current')}>
                <A href="/jobs" className="align-items-center d-flex"><span className="aicon jobs"></span> Jobs</A>
              </li>
              <li className={"list-group-item d-flex justify-content-between align-items-center "+(current == '/passionomy' && 'current')}>
                <A href="/passionomy" className="align-items-center d-flex"><span className="aicon gigs"></span> Gigs</A>
              </li>
              <li className={"list-group-item d-flex justify-content-between align-items-center "+(current == '/marketplace' && 'current')}>
                <A href="/marketplace" className="align-items-center d-flex"><span className="aicon marketplace"></span> Marketplace</A>
              </li>
              <li className={"list-group-item d-flex justify-content-between align-items-center "+(current == '/forums' && 'current')}>
                <A href="/forums" className="align-items-center d-flex"><span className="aicon forums"></span> Forums</A>
              </li>
              <li className={"list-group-item d-flex justify-content-between align-items-center "+(current == 'wallet' && 'current')}>
                <A href="/wallet" className="align-items-center d-flex"><span className="aicon wallet"></span> Wallet</A>
              </li> */}
        </ul>
        <div>
          <h3 />
        </div>
        <RewardsWidget />
      </nav>
    </>
  );
}

export default GlobalMenu;
