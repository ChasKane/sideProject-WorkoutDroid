import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, View, Switch } from 'react-native';
import { Input, Text, Button } from "react-native-elements";


export const UnconnectedHomeScreen = props => (
  <View style={styles.container}>
  <Text>Hey! I'm a simple workout droid, model 353xtra. I'm happy to help you. Tell me how many pushups you'd like to do today, and I'll break that daily total into bite-sized chuncks you can do a few times per hour to slowly get you to your goal. Right now, I'm down for maintenance, so my user-interface is all that works. Soon, my maker will have me able to customize more features of a workout, and allow you to have me help you with any number of seperate workouts. Right now, the main feature I'd normally provide doesnt work :( my main purpose is to send notifications throughout the day that tell you when to do how many reps of your workout, and my maker has the interface set up beautifully for those notificaitons, but has to rearchitect how they're saved on your device and how I dispatch them at specific intervals throughout the day. Come back from time to time to see progress! The link that got you here might go down, so tell my maker if you'd like to see me again! Ta-ta (real smooth da na na na)</Text>
    <Button
      title={props.workoutName}
      onPress={() => props.navigation.push("WorkoutScreen")}
    />
    <Switch
      value={props.workoutIsActive}
      onValueChange={props.handleWorkoutActiveChange}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
    , backgroundColor: '#fff'
    , alignItems: 'center'
    , justifyContent: 'center'
  },
});

const mapStateToProps = state => ({
  workoutName: state.workoutName
  , dailyTotal: state.dailyTotal
  , workoutIsActive: state.workoutIsActive
  , deadzones: state.deadzones
  , isDateTimePickerVisible: state.isDateTimePickerVisible
  , endBeforeStartError: state.endBeforeStartError
});
const mapDispatchToProps = dispatch => ({
  updateWorkoutName: newName => dispatch({type: "updateWorkoutName", payload: newName})
  , updateDailyTotal: newDailyTotal => dispatch({type: "updateDailyTotal", payload: newDailyTotal})
  , handleWorkoutActiveChange: isActive => dispatch({type: "handleWorkoutActiveChange", payload: isActive})
  , handleDatePicked: date => dispatch({type: "handleDatePicked", payload: date})
  , createDeadzone: () => dispatch({type: "createDeadzone"})
  , showDateTimePicker: payload => dispatch({type: "showDateTimePicker", payload: payload})
  , hideDateTimePicker: () => dispatch({type: "hideDateTimePicker"})
  , dismissEndBeforeStartError: () => dispatch({type: "dismissEndBeforeStartError"})
});

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedHomeScreen);
