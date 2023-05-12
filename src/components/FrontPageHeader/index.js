import React, { useState } from 'react';
import A from '../A';
import { GetAssetImage } from '../../globalFunctions';
import './styles.scss';
import { history } from '../../store';
import Button from '../Button';

function FrontPageHeader(props) {
  const [layout, setLayout] = useState(
    props.layout != undefined ? props.layout : 'default'
  );
  // const [size, setSize] = useState(props.size != undefined ? props.size : "");
  const openMobNav = () => {
    props.openMobNav();
  };
  return (
    <header className="frontHeader">
      <div className="container">
        <div>
          <A href="/">
            <img className="logo" src={GetAssetImage('logo-main.png')} alt="" />
          </A>
          {/* <select className="lang-switch ml-3">
          <option>EN</option>
          <option>DE</option>
        </select> */}
        </div>
        <button className="mob-show" onClick={openMobNav}>
          <i className="fa fa-bars" />
        </button>
        <div className="mob-hide">
          <Button
            onClick={() => {
              history.push('/login');
            }}
            variant="primary-outline"
            className="box big "
          >
            Log in
          </Button>
          <Button
            onClick={() => {
              history.push('/register/new');
            }}
            variant="primary"
            className="box big ml-4"
          >
            Sign up
          </Button>
        </div>
      </div>
      <div className="mob-menu">
        <Button
          onClick={() => {
            openMobNav();
            history.push('/login');
          }}
          variant="primary-outline"
          className="box big mb-3"
        >
          Log in
        </Button>
        <Button
          onClick={() => {
            openMobNav();
            history.push('/register/new');
          }}
          variant="primary"
          className="box big ml-4"
        >
          Sign up
        </Button>
        <A href="#">Privacy Policy</A>
        <A href="#">User Agreement</A>
        <A href="#">Contact Us</A>
        <A href="#">Request Partnership</A>
      </div>
    </header>
  );
}

export default FrontPageHeader;
