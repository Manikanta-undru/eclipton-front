import React from 'react';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Carousel } from 'react-bootstrap';

require('./slider1.scss');

class Slider1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attachment: this.props.images,
    };
  }

  activeContent(attachment) {
    const ext = attachment.src.split('.');
    const extension = ext[ext.length - 1];
    const name = ext[ext.length - 2];
    if (extension === 'mp4') {
      return (
        <video controls style={{ width: '75%' }}>
          <source src={attachment.src} type="video/mp4" />{' '}
        </video>
      );
    }
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
      return <img src={attachment.src} alt={attachment.title} />;
    }
  }

  render() {
    return (
      <div className="markCarousel">
        <div className="container-fluid">
          <div className="row">
            <Carousel className="carouselFade" interval={20000}>
              {Object.keys(this.state.attachment).map((key, index) => (
                <Carousel.Item key={index}>
                  {this.activeContent(this.state.attachment[key])}
                  <Carousel.Caption />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    );
  }
}
export default Slider1;
