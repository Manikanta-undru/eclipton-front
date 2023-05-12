import React from 'react';
import './ImageView.scss';

export class Tiles extends React.Component {
  render() {
    // Create tile for each item in data array
    // Pass data to each tile and assign a key
    return (
      <div className="tiles">
        {this.props.data.map((img, i) => (
          <Tile img={img} key={i} />
        ))}
      </div>
    );
  }
}

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      mouseOver: false,
    };
    // Bind properties to class instance
    this._clickHandler = this._clickHandler.bind(this);
    this._mouseEnter = this._mouseEnter.bind(this);
    this._mouseLeave = this._mouseLeave.bind(this);
  }

  // Event handlers to modify state values
  _mouseEnter(e) {
    e.preventDefault();
    if (this.state.mouseOver === false) {
      console.log(this.props.data.name);
      this.setState({
        mouseOver: true,
      });
    }
  }

  _mouseLeave(e) {
    e.preventDefault();
    if (this.state.mouseOver === true) {
      this.setState({
        mouseOver: false,
      });
    }
  }

  _clickHandler(e) {
    e.preventDefault();
    if (this.state.open === false) {
      this.setState({
        open: true,
      });
    } else {
      this.setState({
        open: false,
      });
    }
  }

  clickView = (urlattach, urltype) => {
    console.log(urlattach, 'test');
    // if(urltype == "pdf"){
    //     var type = 'application/pdf'
    // }else{
    //     var type = '';
    // }
    // const file = new Blob([urlattach], { type: type })
    // const fileURL = URL.createObjectURL(file)
    let pdfWindow;
    // pdfWindow = window.open(urlattach,"<iframe>", "width=1000, height=1000")
    pdfWindow = window.open(
      `/passionomy/preview/${encodeURIComponent(urlattach)}/${urltype}`,
      'pdfWindow',
      'width=1000, height=1000'
    ); // Opens a new window
  };

  render() {
    // Modify styles based on state values
    let tileStyle = {};
    const headerStyle = {};
    const zoom = {};
    const { img } = this.props;
    // When tile clicked
    if (this.state.open) {
      tileStyle = {
        height: '80vh',
        width: '80vh',
        position: 'absolute',
        top: '0%',
        left: '0%',
        right: '0%',
        bottom: '0%',
        boxShadow: '0 0 40px 5px rgba(0, 0, 0, 0.3)',
        transform: 'none',
        zIndex: '1000',
      };
    } else {
      tileStyle = {
        // width: '10vw',
      };
    }

    return (
      <div className="tile">
        {/* <img
					onMouseEnter={this._mouseEnter}
					onMouseLeave={this._mouseLeave}
					onClick={this._clickHandler}
					src={this.props.data.image}
					alt={this.props.data.name}
					style={tileStyle}
				/> */}
        {img.contenttype == 'pdf' ? (
          <div
            onClick={(e) => this.clickView(img.content_url, img.contenttype)}
          >
            <i className="fa fa-file-pdf-o imageSec_pdf" aria-hidden="true" />
            <span
              className="pl-2"
              style={{ cursor: 'pointer' }}
              onClick={(e) => this.clickView(img.content_url, img.contenttype)}
            />
          </div>
        ) : null}
        {img.contenttype == 'docx' ? (
          <div
            onClick={(e) => this.clickView(img.content_url, img.contenttype)}
          >
            <i className="fa fa-file-word-o imageSec_pdf" aria-hidden="true" />
            <span
              className="pl-2"
              style={{ cursor: 'pointer' }}
              onClick={(e) => this.clickView(img.content_url, img.contenttype)}
            />
          </div>
        ) : null}
        {img.contenttype == 'xls' || img.contenttype == 'xlsx' ? (
          <div
            onClick={(e) => this.clickView(img.content_url, img.contenttype)}
          >
            <i className="fa fa-file-excel-o imageSec_pdf" aria-hidden="true" />
            <span
              className="pl-2"
              style={{ cursor: 'pointer' }}
              onClick={(e) => this.clickView(img.content_url, img.contenttype)}
            />
          </div>
        ) : null}

        {img.contenttype == 'txt' ? (
          <div
            onClick={(e) => this.clickView(img.content_url, img.contenttype)}
          >
            <i className="fa fa-file-text-o imageSec_pdf" aria-hidden="true" />
            <span
              className="pl-2"
              style={{ cursor: 'pointer' }}
              onClick={(e) => this.clickView(img.content_url, img.contenttype)}
            />
          </div>
        ) : null}

        {img.contenttype == 'mp4' ? (
          <div
            onClick={(e) => this.clickView(img.content_url, img.contenttype)}
          >
            <i className="fa fa-file-video-o imageSec_pdf" aria-hidden="true" />
          </div>
        ) : null}

        {img.contenttype == 'mp3' ? (
          <div
            onClick={(e) => this.clickView(img.content_url, img.contenttype)}
          >
            <i className="fa fa-file-audio-o imageSec_pdf" aria-hidden="true" />
          </div>
        ) : null}

        {img.contenttype == 'png' ||
        img.contenttype == 'jpeg' ||
        img.contenttype == 'jpg' ||
        img.contenttype == 'gif' ? (
          <div
            onClick={(e) => this.clickView(img.content_url, img.contenttype)}
          >
            <i className="fa fa-file-image-o imageSec_pdf" aria-hidden="true" />
          </div>
        ) : null}

        {/* {
					img.contenttype == "png" || img.contenttype == "jpeg" || img.contenttype == "jpg" || img.contenttype == "gif" ? <><img src={img.content_url} onClick={this._clickHandler} style={tileStyle}></img></> : null
				} */}
      </div>
    );
  }
}
