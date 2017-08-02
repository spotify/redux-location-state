# redux-location-state
Utilities for reading & writing Redux store state to & from the URL

## Development Status

2.0 is updated for release of React Router V4

## How it works


### setup before compose
The basic idea is that you pass a config object and based on when the state gets updated, certain query params will follow along, and if a user goes back or forward the state gets updated based on query params. For example
```javascript
{
  p: {stateKey: 'foo', initialState: 'bazz', options: {shouldPush: true}},
}
```
will make a query param of `p` equal to the state that is passed in with the value on `foo`


#### config
First you need to create a config object
```javascript
const paramSetup = {
    '/': {
      p: {stateKey: 'foo', initialState: 'bazz', options: {shouldPush: true}},
      s: {stateKey: 'bar', initialState: {}, options: {isFlags: true}},
    }
    global: {
      split: {stateKey: 'baz'},
    }
  };
```
Each page that you have declared should have an object of what to track. since you most likely don't want to track all of your state in the url this is helpful to pair down what you need

Each key should be the path. If you have a variable path you can add '/*` to show that it is a variable

Additionally, if you would like to track state no matter which page you're on, create an object with a key of `global`.

the idea is that you declare the name you would like the url param to be, and then declare where that state lives in your state object for redux-location-state to map.

#### mapLocationToState
Redux-location-state relies on redux reducers to update the state if the url changes. for this Parameter, pass in a reducer that you would use to parse the returned data
```javascript
//location is a React location object with the query object updated with the mapped values
function mapLocationToState(state, location) {
  switch (location.pathname) {
    case "/":
      const queryState = location.query;

      //notice that it maps the query back to the stateKey
      state.foo = queryState.foo;
      state.bar = queryState.bar;
      return state;

    default:
      return state;
  }
}
```

#### history
this will be react-router's hashHistory or browserHistory

#### reducer
Redux-location-state relies on redux reducers to update the state if the url changes. if you already have other reducers that you've made, you can simply pass them in below and it will return a new function with all your previous reducers as well as a new location reducer attached.

### initialization

```javascript
import {createStore, applyMiddleware, compose} from 'redux';
import {Router} from 'react-router-dom';
import {createReduxLocationActions, listenForHistoryChange} from 'redux-location-state';
import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

const {locationMiddleware, reducersWithLocation} = createReduxLocationActions(paramSetup, mapLocationToState, history, reducers);
const store = compose(applyMiddleware([locationMiddleware]))(createStore)(reducersWithLocation);
```

you have now initialized your store with the location. Now all you have to do is start watching the url changes.

```javascript
listenForHistoryChange(store, history);
```

you have now turned on your location watcher!

## options
there are a lot of options that you have available in your config object.

for every type of item there is a couple of default options that you can pass.

### type

if your redux store value is anything other than a string, it will need to be defined in the `type` key

```javascript
{
  s: {stateKey: 'bar', type: 'object'},
  r: {stateKey: 'foo', type: 'date'},
  q: {stateKey: 'biz', type: 'number'},
  i: {stateKey: 'biz', type: 'array'},
  w: {stateKey: 'tan', type: 'bool'},
}
```

### initialState

this is declared on the top most level and will tell redux-location-state what the default is. if it is not declared it will assume `undefined` is the default.

```javascript
{
  s: {stateKey: 'bar', initialState: {}},
}
```

### serialize

if you'd like to control how your item is shown in the url, you can pass in a function on `options.serialize`, which expects a string ready to be put on the url

```javascript
p: {stateKey: 'foo', options: {
  serialize: (currentItemState) => {
    return currentItemState.join('I-like-to-join-by-hyphens-and-words');
  }
}}
```

### parse

converse to serialize, if you pass this function in your config you can set your store however you'd like
```javascript
p: {stateKey: 'foo', options: {
  parse: (urlPathReturned) => {
    return urlPathReturned.split('I-like-to-join-by-hyphens-and-words');
  }
}}
```

### shouldPush

by default, if there is a query param update it will only replace the url (it won't be added to your history), you can override it by adding `shouldPush` to your options

```
p: {stateKey: 'foo', options: {shouldPush: true}}
```

### delimiter 

this only applies to arrays and objects, but you can declare how you'd like to delimit your items. by default it is `-`, but it can be overwritten

### setAsEmptyItem

Another item that only applies to arrays or objects. if you've declared an empty object or array as the default, it will assume if it sees nothing in the query param that you want undefined. you can explicitly tell it to return an empty array or object by passing this flag as `true`.

### array

in addition, there are some array specific options

#### keepOrder

if you have an ordered array that you'd like to keep the order in the url, pass `keepOrder` as true

### object

#### isFlags

for objects, you have the ability to pass in an object that just has true/false values. by passing the `isFlags` boolean, it will serialize only the items that are `true` and inline them

if the config is
```javascript
{
  p: {stateKey: 'foo', defaultValue: {}, type: 'object', options: {isFlags: true, }},
}
```
and the state is 
```javascript
{
  '/': {
    foo: {
      bazz: true,
      bar: false,
      bin: true,
    }
  }
}
```
the url will be `?p=bazz-bar`

### experimental

if you'd like to parse all the objects in a custom way, you can add a fifth argument to `createReduxLocationActions` that will overwrite the function that maps the query params. this function will have to return a location object with the updated params in the query object.
```javascript
function overwriteLocationHandling(setupObject, nextState, location) {
  location.query.something = nextState;
  return location;
}
```

## Development

to work on the project, run an `npm install` then run the following commands for different uses:

* `npm run serve` to check localhost 8000 and see an example
* `npm run build` to build `src` into `lib` and run tests

## Code of Conduct
This project adheres to the [Open Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.

[code-of-conduct]: https://github.com/spotify/code-of-conduct/blob/master/code-of-conduct.md