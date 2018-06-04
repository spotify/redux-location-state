import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import actions from '../actions';


class CounterPage extends React.Component {
  constructor(props) {
    super(props);
    this.incrementOne = this.props.onIncrement.bind(this, 1);
    this.incrementFive = this.props.onIncrement.bind(this, 5);
    this.decrementOne = this.props.onDecrement.bind(this, 1);
    this.decrementFive = this.props.onDecrement.bind(this, 5);
  }
  render() {  
    return <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <h2>Counter Page</h2>

          <div style={{textAlign: 'center'}}>
            <h4>Counter State: {this.props.count}</h4>
            <p>
              <button onClick={this.decrementFive}>-5</button>
              <button onClick={this.decrementOne}>-1</button>
              <button onClick={this.incrementOne}>+1</button>
              <button onClick={this.incrementFive}>+5</button>
            </p>
          </div>

          <p>
            <Link to="/redux-location-state/other">Go to page two.</Link>
          </p>
        </div>
      </div>
    </div>;
  }
}

const ConnectedPage = connect(
  (state) => ({ // map app state to component props
    count: state.count
  }),
  (dispatch) => ({ // callback props which dispatch actions
    onIncrement: (count = 1) => dispatch(actions.counter.increment(count)),
    onDecrement: (count = 1) => dispatch(actions.counter.decrement(count))
  })
)(CounterPage);

export default ConnectedPage;
