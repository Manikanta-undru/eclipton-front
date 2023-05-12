import React, { useState, useEffect, useRef } from 'react';
import { profilePic } from '../../globalFunctions';
import './style.scss';

function Dropdown(props) {
  const [isOpen, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const toggleDropdown = () => {
    setOpen(!isOpen);
  };
  useEffect(() => {
    document.body.addEventListener('click', handleClickOutsideDropdown);
    return function cleanup() {
      document.body.removeEventListener('click', handleClickOutsideDropdown);
    };
  }, []);

  const handleClickOutsideDropdown = (e) => {
    if (!triggerRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  return (
    <div className="new-dropdown ">
      <div
        className="new-dropdown-header"
        ref={triggerRef}
        onClick={toggleDropdown}
      >
        {props.children}
      </div>
      <div
        className={`new-dropdown-body ${isOpen && 'open'}`}
        style={{ right: `${props.flag == 'right' ? '0' : ''}` }}
      >
        {props.items &&
          props.items.map((item, i) => (
            <div className="new-dropdown-item" key={i}>
              <a className="" href={`/u/${item._id}`}>
                <img
                  className="media-object dropdown-pic"
                  src={profilePic(item.avatar, item.name)}
                  alt="..."
                />
                <span>{item.name}</span>
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}
export default Dropdown;
