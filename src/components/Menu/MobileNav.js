import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { profilePic } from '../../globalFunctions';
import { getCurrentUser } from '../../http/token-interceptor';
import './styles.scss';

function MobileNav(props) {
  const [user, setUser] = useState();
  const { location } = props;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setUser(JSON.parse(getCurrentUser()));
  }, []);

  const isActive = (path) => (location.pathname === path ? 'active' : '');
  useEffect(() => {
    setUser(JSON.parse(getCurrentUser()));
  }, []);
  return (
    <>
      <div className="stackmobileNav" style={{ display: 'none' }}>
        <div className="pages ">
          <Link
            to="/home"
            className={` stackmobileNav_menu ${isActive('/home')}`}
          >
            <i className="fa-solid fa-house" />
          </Link>
          <Link
            to="/passionomy"
            className={`stackmobileNav_menu ${isActive('/passionomy')}`}
          >
            <i className="fa-solid fa-handshake-simple" />
          </Link>
          <Link
            to="/blogs/all"
            className={`stackmobileNav_menu ${isActive('/blogs/all')}`}
          >
            <i className="fa-brands fa-blogger-b" />
          </Link>

          <Link
            to="/wallet/deposit"
            className={`stackmobileNav_menu ${isActive('/wallet/deposit')}`}
          >
            <i className="fa-solid fa-wallet" />
          </Link>
          <Link
            to="/blogs"
            className={`stackmobileNav_menu ${isActive('/blogs')}`}
          >
            <i className="fa-solid fa-book-bookmark" />
          </Link>

          <Link
            to="/passionomy/gig/purchased"
            className={`stackmobileNav_menu ${isActive(
              '/passionomy/gig/purchased'
            )}`}
          >
            <i className="fa-solid fa-cubes" />
          </Link>
          <Link
            to="/passionomy/request/my"
            className={`stackmobileNav_menu ${isActive(
              '/passionomy/request/my'
            )}`}
          >
            <i className="fa-solid fa-star" />
          </Link>
        </div>
        <Link
          to="/profile"
          className={`rewards user-profile ${isActive('/profile')}`}
        >
          <img src={profilePic(user?.avatar, user?.name)} />
        </Link>
      </div>
      <div className="floating-action-menu">
        <div className={`floating-menu-nav shadow ${open ? 'open' : ''}`}>
          <Link
            to="/passionomy"
            className={`floating-menu-item ${isActive('/home')}`}
          >
            <i className="fa-solid fa-house" />
            <span> Home</span>
          </Link>
          <Link
            to="/passionomy"
            className={`floating-menu-item ${isActive('/passionomy')}`}
          >
            <i className="fa-solid fa-handshake-simple" />
            <span> Passionomy</span>
          </Link>
          <Link
            to="/blogs/all"
            className={`floating-menu-item ${isActive('/blogs/all')}`}
          >
            <i className="fa-brands fa-blogger-b" />
            <span> Blogs</span>
          </Link>

          <Link
            to="/wallet/deposit"
            className={`floating-menu-item ${isActive('/wallet/deposit')}`}
          >
            <i className="fa-solid fa-wallet" />
            <span>Wallet</span>
          </Link>
          <Link
            to="/blogs"
            className={`floating-menu-item ${isActive('/blogs')}`}
          >
            <i className="fa-solid fa-book-bookmark" />
            <span>My Blogs</span>
          </Link>

          <Link
            to="/passionomy/gig/purchased"
            className={`floating-menu-item ${isActive(
              '/passionomy/gig/purchased'
            )}`}
          >
            <i className="fa-solid fa-cubes" />
            <span>My Gigs</span>
          </Link>
          <Link
            to="/passionomy/request/my"
            className={`floating-menu-item ${isActive(
              '/passionomy/request/my'
            )}`}
          >
            <i className="fa-solid fa-star" />
            <span>Rewards</span>
          </Link>
          <Link
            to="/profile"
            className={`floating-menu-item user-profile ${isActive(
              '/profile'
            )}`}
          >
            <img src={profilePic(user?.avatar, user?.name)} />
            <span>{user?.name}</span>
          </Link>
        </div>
        <div
          type="checkbox"
          id="toggle-btn"
          className={`shadow-sm ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
        >
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </>
  );
}

export default withRouter(MobileNav);
