import React from 'react';
import SideMenu1 from '../../_widgets/sideMenu1';

import imageIcon from '../../../../assets/images/icons/icon-upload-image.png';
import videoIcon from '../../../../assets/images/icons/icon-upload-video.png';
import A from '../../../../components/A';

require('../../_styles/market-area.scss');
require('./product-gallery.scss');

class MarketProductGallery extends React.Component {
  fileObj = [];

  fileArray = [];

  constructor(props) {
    super(props);
    this.state = {
      file: [null],
    };
    this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  uploadMultipleFiles(e) {
    this.fileObj.push(e.target.files);
    for (const element of this.fileObj[0]) {
      this.fileArray.push(URL.createObjectURL(element));
    }
    this.setState({ file: this.fileArray });
  }

  render() {
    return (
      <div className="market-place-styles">
        <div className="container-fluid container-layout">
          <div className="layout-2">
            {/* BEGIN :: LEFT */}
            <div className="left">
              <SideMenu1 />
            </div>
            {/* END :: LEFT */}

            {/* BEGIN :: RIGHT */}
            <div className="right">
              {/* BEGIN :: FORM HOLDER 1 */}
              <div className="form-holder-1">
                <div className="title-with-button-block">
                  <div className="title-block">
                    <h2> Upload Your Product Images </h2>
                  </div>
                  <div className="button-block pull-right ms-auto me-2">
                    <button className="btn-2"> Save as Draft </button>
                  </div>
                </div>

                <form action="">
                  {/* BEGIN :: FORM GROUP */}
                  <div className="upload-gallery-box photo">
                    <div className="holder">
                      <input type="file" id="uploadImage" />
                      <img src={imageIcon} alt="" className="icon" />
                      <p>
                        {' '}
                        Drag & drop your product image or{' '}
                        <label htmlFor="uploadImage" className="browse">
                          {' '}
                          Browse{' '}
                        </label>{' '}
                      </p>
                      <p> PNG or JPG no bigger than 500px </p>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  {/* BEGIN :: FORM GROUP */}
                  <div className="upload-gallery-box video">
                    <div className="holder">
                      <input type="file" id="uploadVideo" />
                      <img src={videoIcon} alt="" className="icon" />
                      <p>
                        {' '}
                        Drag & drop your product image or{' '}
                        <label htmlFor="uploadVideo" className="browse">
                          {' '}
                          Browse{' '}
                        </label>{' '}
                      </p>
                      <p> PNG or JPG no bigger than 500px </p>
                    </div>
                  </div>
                  {/* END :: FORM GROUP */}

                  <div className="btn-groups pull-right ms-auto me-2">
                    <A href="/market-product-pricing">
                      <button className="btn-2"> Move to Previous </button>
                    </A>
                    <A href="/market-product-gallery-preview">
                      {' '}
                      <button className="btn-1"> Save & Continue </button>
                    </A>
                  </div>
                </form>
              </div>
              {/* END :: FORM HOLDER 1 */}
            </div>
            {/* END :: RIGHT */}
          </div>
        </div>
      </div>
    );
  }
}

export default MarketProductGallery;
