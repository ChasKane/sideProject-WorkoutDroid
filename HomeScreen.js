import React from 'react';
import { Notifications } from 'expo';
import { StyleSheet, Button, View } from 'react-native';

const makeDeadzone = (start, end) => {
 dz = {
    start: new Date()
    , end: new Date()
  };
  dz.start.setHours(start);
  if(end == 24)
    dz.end.setHours(23, 59, 59);
  else
    dz.end.setHours(end);
  return dz;
};

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deadzones: [makeDeadzone(0, 8), makeDeadzone(20, 24)]
      , notificationDelay1: 1
      , notificationDelay2: 3
      , workoutName: "pushups"
    };

    Notifications.addListener(e => {
      console.log("notified ", e)
    });
    Notifications.createChannelAndroidAsync("WerkDroid", androidChannel);
    Notifications.deleteCategoryAsync("Workout").then(() =>
      Notifications.createCategoryAsync("Workout", notificationActions)
    );
    this.props.navigation.push(
      "WorkoutScreen"
      , {
        workoutName: this.state.workoutName
        , deadzones: this.state.deadzones
        , modifyDeadzone: this.modifyDeadzone
        , updateWorkoutName: this.updateWorkoutName
      }
    );
  }

  updateWorkoutName = (name) => {
    this.setState({workoutName: name});
  }

  modifyDeadzone(date, index, startOrEnd) {
    const deadzones = JSON.parse(JSON.stringify(this.state.deadzones));
    deadzones[index][startOrEnd] = date;
    this.setState({
      deadzones: deadzones
      , ...this.state
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="now"
          onPress={
            () => Notifications.presentLocalNotificationAsync({
              title: "notfiication title"
              , body: "notification body"
              , categoryId: "Workout"
              , android: {
                channelId: "WerkDroid"
              }
            })
          }
        ></Button>
        <Button
          title="3 seconds later"
          onPress={
            () => setTimeout(
              Notifications.scheduleLocalNotificationAsync({
                title: "title"
                , body: "body"
                , categoryId: "Workout"
                , android: {
                  channelId: "WerkDroid"
                }
              })
              , { time: (new Date()).getTime() + 3000 }
            )
          }
        ></Button>
        <Button
          title="Push-ups"
          onPress={() => this.props.navigation.push(
            "WorkoutScreen"
            , {
              workoutName: this.state.workoutName
              , deadzones: this.state.deadzones
              , addDeadzone: this.addDeadzone
              , updateWorkoutName: this.updateWorkoutName
            }
          )}
        ></Button>
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1
    , backgroundColor: '#fff'
    , alignItems: 'center'
    , justifyContent: 'center'
  },
});
