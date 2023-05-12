import React from 'react';
import FileViewer from 'react-file-viewer';

import './styles.scss';

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: decodeURIComponent(this.props.match.params.file),
      type: this.props.match.params.type,
    };
  }

  componentDidMount() {
    const restrict_type = ['audio', 'video'];
    for (let index = 0; index < restrict_type.length; index++) {
      const element = restrict_type[index];
      const data_dat = document.getElementsByTagName(element)[0];
      if (data_dat) {
        data_dat.setAttribute('controlslist', 'nodownload');
      }
    }
  }

  render() {
    return (
      <div className="container my-wall-container depositPage ">
        {/* <img src={this.state.file} /> */}
        <div className="watermark" />
        {this.state.type != 'txt' ? (
          <FileViewer fileType={this.state.type} filePath={this.state.file} />
        ) : (
          <iframe
            src={this.state.file}
            width="50%"
            align="center"
            height="600"
          />
        )}
      </div>
    );
  }
}

export default Preview;
