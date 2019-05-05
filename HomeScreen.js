import React from 'react';
import { connect } from 'react-redux'
import { ScrollView, View, Switch } from 'react-native';
import { Input, Text, Button } from "react-native-elements";
import { Notifications } from 'expo';
import { HomeScreenStyles as styles } from './styles';


export class UnconnectedHomeScreen extends React.Component {
  constructor(props) {
    super(props);

  }
  render = () => (
    <View style={styles.container}>
      <Button
        title={this.props.workoutName}
        onPress={() => this.props.navigation.push("WorkoutScreen")}
      />
      <Switch
        value={this.props.workoutIsActive}
        onValueChange={this.props.handleWorkoutActiveChange}
      />
    </View>
  );
}

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
