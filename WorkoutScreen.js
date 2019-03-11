import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import { Input } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";

export default class WorkoutScreen extends React.Component {
  state = {
    isDateTimePickerVisible: false
    , activeDeadzone: {index: -1, startOrEnd: null}
  };
  showDateTimePicker = dz => this.setState({ activeDeadzone: dz, isDateTimePickerVisible: true });
  hideDateTimePicker = () => this.setState({ activeDeadzone: {index: -1, startOrEnd: null}, isDateTimePickerVisible: false });
  handleDatePicked = (date, modifyDeadzone) => {
    console.log(date, modifyDeadzone);
    modifyDeadzone(date, this.state.activeDeadzone.index, this.state.activeDeadzone.startOrEnd);
    this.hideDateTimePicker();
  };

  render() {
    const params = this.props.navigation.state.params;

    let workoutName
      , deadzones
      , updateWorkoutName
      , modifyDeadzone;
    if(params){
      workoutName = params.workoutName || "pushups, situps, etc.";
      deadzones = params.deadzones || [];
      updateWorkoutName = params.updateWorkoutName || (() => console.log("updateWorkoutName funciton missing"));
      modifyDeadzone = params.modifyDeadzone || (() => console.log("modifyDeadzone funciton missing"));
    } else {
      console.log("no params");
    }
    return (
      <View style={styles.container}>
        <Input
          label="Workout Name"
          defaultValue={workoutName}
          onChangeText={updateWorkoutName}
        />
        <Text>Deadzones</Text>
        {deadzones.map((dz, index) => (
          <View key={index} style={{flexDirection: "row", width: '100%'}}>
          <Button onPress={dz => this.showDateTimePicker(index, "start")} title={dz.start.getHours().toString()} />
            <Text> to </Text>
          </View>
        ))}
        <TouchableOpacity onPress={this.showDateTimePicker}>
          <Text>New Deadzone</Text>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          mode="time"
      onConfirm={date => this.handleDatePicked(date, modifyDeadzone)}
          onCancel={this.hideDateTimePicker}

        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
    , justifyContent: 'flex-start'
    , padding: 20
  }
});
