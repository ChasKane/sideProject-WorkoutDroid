import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeScreen from './HomeScreen';
import WorkoutScreen from './WorkoutScreen';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Notifications } from 'expo';

// https://gist.github.com/jed/982883
function uuidGenerator(a) {return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuidGenerator)};


const INITIAL_STATE = {
  workoutName: "Pushups"
  , dailyTotal: 1000
  , workoutIsActive: true
  , deadzones: {}
  , notificationDelay1: 1
  , notificationDelay2: 3
  , endBeforeStartError: false
};
const store = createStore((state=INITIAL_STATE, {type, payload}) => {
  console.log("state", state);
  console.log("type", type);
  console.log("payload", payload);
  let deadzones, dz;
  switch (type) {
    case "updateWorkoutName":
      return {
        ...state
        , workoutName: payload
      };

    case "updateDailyTotal":
      return {
        ...state
        , dailyTotal: parseInt(payload)
      };

    case "handleWorkoutActiveChange":
      return {
        ...state
        , workoutIsActive: payload
      };

    case "createDeadzone":
      dz = {
        id: uuidGenerator()
        , start: {hour: 0, min: 0}
        , end: {hour: 8, min: 0}
      };
      deadzones = JSON.parse(JSON.stringify(state.deadzones));
      deadzones[dz.id] = dz
      return {
        ...state
        , deadzones: deadzones
      };

    case "handleDatePicked":
      deadzones = JSON.parse(JSON.stringify(state.deadzones));
      dz = deadzones[state.selectedDeadzoneID];
      // if end time ends up before or on start time, don't modify deadzone
      if(
        (state.selectedStartOrEnd === "end"
          && (dz.start.hour > payload.getHours()
            || (dz.start.hour === payload.getHours() && dz.start.min >= payload.getMinutes())
          )
        )
        || (state.selectedStartOrEnd === "start"
          && (dz.end.hour < payload.getHours()
            || (dz.end.hour === payload.getHours() && dz.end.min <= payload.getMinutes())
          )
        )
      ) {
        return {
          ...state
          , selectedDeadzoneID: null
          , selectedStartOrEnd: null
          , isDateTimePickerVisible: false
          , endBeforeStartError: true
        };
      }
      dz[state.selectedStartOrEnd].hour = payload.getHours();
      dz[state.selectedStartOrEnd].min = payload.getMinutes();
      return {
        ...state
        , deadzones: deadzones
        , selectedDeadzoneID: null
        , selectedStartOrEnd: null
        , isDateTimePickerVisible: false
      };

    case "showDateTimePicker":
      return {
        ...state
        , selectedDeadzoneID: payload.id
        , selectedStartOrEnd: payload.startOrEnd
        , isDateTimePickerVisible: true
      };

    case "hideDateTimePicker":
      return {
        ...state
        , selectedDeadzoneID: null
        , selectedStartOrEnd: null
        , isDateTimePickerVisible: false
      };

    case "dismissEndBeforeStartError":
      return {
        ...state
        , endBeforeStartError: false
      }

    default:
      return state
  }
});

const MainNavigator = createStackNavigator({
  HomeScreen: {screen: HomeScreen},
  WorkoutScreen: {screen: WorkoutScreen},
});
const Navigation = createAppContainer(MainNavigator);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    Notifications.addListener(e => {
      console.log("notified ", e)
    });
    Notifications.createChannelAndroidAsync("WerkDroid", androidChannel);
    Notifications.deleteCategoryAsync("Workout").then(() =>
      Notifications.createCategoryAsync("Workout", notificationActions)
    );
  }

  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}

const notificationActions = [
  {
    actionId: "New Deadzone"
    , buttonTitle: "New Deadzone"
    , textInput: {
      submitButtonTitle: "New Deadzone"
      , placeholder: "How many minutes? (enter a number)"
    }
  }
  , {
    actionId: "Done"
    , buttonTitle: "👌"
  }
  , {
    actionId: "delay1"
    , buttonTitle: `⏱  min`
  }
  , {
    actionId: "delay2"
    , buttonTitle: `⏱  min`
  }
];

const androidChannel = {
  name: "WerkDroid"
  , sound: true
  , vibrate: true
}

