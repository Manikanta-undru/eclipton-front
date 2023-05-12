import React, { useEffect, useState } from 'react';
import { getMetaDataURL } from '../../http/http-calls';

function UrlPreview({ url }) {
  const [data, setData] = useState();

  useEffect(() => {
    getMetaDataURL({ url })
      .then((resp) => {
        const metadata = {
          title: resp.metadata.title || 'Could not fetch preview',
          image: resp.metadata.image || null,
          author: resp.metadata.author || '',
          description: resp.metadata.description || '',
          keywords: resp.metadata.keywords || '',
        };
        setData(metadata);
      })
      .catch((error) => {
        console.log('error');
        setData({
          title: 'Could not fetch preview',
          image: null,
          author: '',
          description: '',
          keywords: '',
        });
      });
  }, [url]);
  return (
    <a href={url} target="_blank" className="w-100" rel="noreferrer">
      <div className="url-preview-component">
        <div className="image-block">
          {data?.title ? (
            data?.image ? (
              <div
                className="image"
                style={{ backgroundImage: `url(${data.image})` }}
              />
            ) : (
              <div className="loading">
                <i className="fa fa-link" />
              </div>
            )
          ) : (
            <div className="loading">
              <div className="spinner-border text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
        <div className="info-block">
          {data?.title ? (
            <h5 className="title">{data.title}</h5>
          ) : (
            <h5 className="card-title placeholder-glow">
              <span className="placeholder col-10" />
            </h5>
          )}
          <p className="card-text placeholder-glow d-flex flex-column meta-data">
            {data?.title ? (
              <span className="author">{data.author}</span>
            ) : (
              <span className="placeholder col-7" />
            )}
            {data?.title ? (
              <span className="description">{data.description}</span>
            ) : (
              <span className="placeholder col-4" />
            )}
            {data?.title ? (
              <span className="keywords">{data.keywords}</span>
            ) : (
              <span className="placeholder col-4" />
            )}
            {data?.title ? (
              <span className="source">{data.source}</span>
            ) : (
              <span className="placeholder col-6" />
            )}
          </p>
        </div>
      </div>
    </a>
  );
}

export default UrlPreview;
