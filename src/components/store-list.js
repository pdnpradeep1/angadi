// store-list.js
import React from 'react';
import { Link } from 'react-router-dom';

const StoreList = ({ stores }) => {
  return (
    <div className="stores-list">
      {stores.length === 0 ? (
        <p>No stores available</p>
      ) : (
        stores.map((store, index) => (
          <div key={index} className="store-item">
            {/* <a href={`https://${store.url}`} target="_blank" rel="noopener noreferrer"> */}
            <Link to={`/store-dashboard/${store.id}`}>
              <div className="store-box">
                <div className="store-name">{store.name}</div>
                <div className="store-url">{store.url}</div>
              </div>
              </Link>
            {/* </a> */}
          </div>
        ))
      )}
    </div>
  );
};

export default StoreList;
