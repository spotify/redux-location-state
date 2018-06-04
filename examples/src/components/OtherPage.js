import React from 'react';
import { Link } from 'react-router-dom';

export default class OtherPage extends React.Component {
  render() {
    return <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <h2>Other Page</h2>

          <p>Welcome to the other page</p>

          <p>
            <Link to="/redux-location-state/">Back to the counter</Link>
          </p>
        </div>
      </div>
    </div>;
  }
}
