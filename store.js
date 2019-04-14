import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { makeID } from './utils';

const initialWorkoutID = makeID();
const initialDeadzoneCollectionID = makeID();
const initialDzID1 = makeID();
const initialDzID2 = makeID();
const initialNotificationCollectionID = makeID();
const INITIAL_STATE = {
  workouts: {
    byID: {
      [initialWorkoutID]: {
        id: initialWorkoutID
        ,workoutName:         "Pushups"
        ,dailyTotal:          1000
        ,minutesBetweenSets:  10
        ,actionsPerSet:       14
        ,workoutIsActive:     true
        ,notificationDelay1:  1
        ,notificationDelay2:  3
        ,endBeforeStartError: false
        ,notifications:       initialNotificationCollectionID
        ,deadzones:           initialDeadzoneCollectionID
      }
    }
    ,allIDs: [initialWorkoutID]
  }
  ,deadzoneCollections: {
    byID: {
      [initialDeadzoneCollectionID]: {
        [initialDzID1]:  new Deadzone(0, 0, 8, 0)
        ,[initialDzID2]: new Deadzone(20, 0, 24, 0)
      }
    }
    ,allIDs: [initialDeadzoneCollectionID]
  }
  ,notificationCollections: {
      [initialNotificationCollectionID]: {
        id: initialNotificationCollectionID
      }
    ,allIDs: [initialNotificationCollectionID]
  }
};

const reducer = (state=INITIAL_STATE, {type, payload}) => {
  console.log("state", state);
  console.log("type", type);
  console.log("payload", payload);
  let deadzones, dz;
  switch (type) {
    case "addNID":
      return {
        ...state
        ,nIDs: state.nIDs.concat(payload)
      }
    case "handleWorkoutActiveChange":
      if(!payload) {

      }
      return { ...state , workoutIsActive: payload };

    case "updateWorkoutName":
      return { ...state , workoutName: payload };
    case "updateDailyTotal":
      return { ...state , dailyTotal: parseInt(payload) };
    case "updateMinutesBetweenSets":
      return { ...state , minutesBetweenSets: parseInt(payload) };
    case "updateActionsPerSet":
      return { ...state , ActionsPerSet: parseInt(payload) };
    case "scheduleNotifications":
      return { ...state , notificationIDs: nIDs };

    case "createDeadzone":
      dz = {
        id: uuidGenerator()
        ,start: {hour: 0, min: 0}
        ,end: {hour: 8, min: 0}
      };
      deadzones = JSON.parse(JSON.stringify(state.deadzones));
      deadzones[dz.id] = dz
      return { ...state , deadzones: deadzones };

    case "handleDatePicked":
      //NOTE date can be current day + 1 with zeros for hours and mins; must handle this
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
          ,selectedDeadzoneID: null
          ,selectedStartOrEnd: null
          ,isDateTimePickerVisible: false
          ,endBeforeStartError: true
        };
      }
      dz[state.selectedStartOrEnd].hour = payload.getHours();
      dz[state.selectedStartOrEnd].min = payload.getMinutes();
      return {
        ...state
        ,deadzones: deadzones
        ,selectedDeadzoneID: null
        ,selectedStartOrEnd: null
        ,isDateTimePickerVisible: false
      };

    case "showDateTimePicker":
      return {
        ...state
        ,selectedDeadzoneID: payload.id
        ,selectedStartOrEnd: payload.startOrEnd
        ,isDateTimePickerVisible: true
      };

    case "hideDateTimePicker":
      return {
        ...state
        ,selectedDeadzoneID: null
        ,selectedStartOrEnd: null
        ,isDateTimePickerVisible: false
      };

    case "dismissEndBeforeStartError":
      return { ...state , endBeforeStartError: false }

    default:
      return state
  }
};

export default createStore(reducer, applyMiddleware(thunkMiddleware));
