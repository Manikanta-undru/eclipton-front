// Marker.js
import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  position: 'absolute',
  width: '38px',
  height: '37px',
  backgroundImage:
    'url(https://icon-library.com/images/pin-icon-png/pin-icon-png-9.jpg)',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  WebkitTransform: 'translate(-50%,-50%)',
  msTransform: 'translate(-50%,-50%)',
  transform: 'translate(-50%,-50%)',
  cursor: 'grab',
};
function Marker({ text, onClick }) {
  return <div style={styles} alt={text} onClick={onClick} />;
}

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Marker;
