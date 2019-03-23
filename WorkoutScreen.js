import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View, Modal } from "react-native";
import { Input, Text, Button, Divider } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";

const sortDeadzonesByStartTime = (a, b) => (
  (a.start.hour - b.start.hour === 0)
  ? (a.start.min - b.start.min)
  : (a.start.hour - b.start.hour)
);

export const UnconnectedWorkoutScreen = props => (
  <View style={styles.container}>
    <Input
      label="Workout Name"
      labelStyle={styles.label}
      defaultValue={props.workoutName}
      onChangeText={props.updateWorkoutName}
    />
    <Input
      style={{marginTop: 50}}
      label="Dialy total"
      labelStyle={styles.label}
      keyboardType="numeric"
      defaultValue={props.dailyTotal.toString()}
      onChangeText={props.updateDailyTotal}
    />
    <View style={styles.deadzonesContainer} >
      <Text style={styles.label}>Deadzones</Text>
      {Object.values(props.deadzones).sort(sortDeadzonesByStartTime).map(dz => (
        <View key={dz.id} style={styles.deadzone}>
          <Button
            onPress={() => props.showDateTimePicker({id: dz.id, startOrEnd: "start"})}
            title={dz.start.hour.toString().padStart(2, "0") + ':' + dz.start.min.toString().padStart(2, "0")}
          />
          <Text style={{fontSize: 20}}> to </Text>
          <Button
            onPress={() => props.showDateTimePicker({id: dz.id, startOrEnd: "end"})}
            title={dz.end.hour.toString().padStart(2, "0") + ':' + dz.end.min.toString().padStart(2, "0")}
          />
        </View>
      ))}
      <Button style={{marginTop: 5}} title="New Deadzone" onPress={props.createDeadzone} />
    </View>
    <DateTimePicker
      isVisible={props.isDateTimePickerVisible}
      mode="time"
      onConfirm={props.handleDatePicked}
      onCancel={props.hideDateTimePicker}
    />
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={props.endBeforeStartError}
      onRequestClose={props.dismissEndBeforeStartError}
    >
      <View style={styles.modalOuterView}>
        <View style={styles.modalInnerView}>
          <Text>End time must be after start time.</Text>
          <Button title="Dismiss" onPress={props.dismissEndBeforeStartError} />
        </View>
      </View>
    </Modal>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
    , justifyContent: 'flex-start'
    , padding: 20
  }
  , deadzonesContainer: {
    margin: 10
  }
  , deadzone: {
    flexDirection: "row"
    , alignItems: "center"
    , paddingVertical: 10
  }
  , label: {
    fontSize: 16
    , fontWeight: "bold"
    , color: "grey"
  }
  , modalOuterView: {
    flex: 1
    , flexDirection: 'column'
    , justifyContent: 'center'
    , alignItems: 'center'
  }
  , modalInnerView: {
    alignItems: 'center'
    , justifyContent: 'center'
    , borderWidth: 3
    , padding: 10
    , width: 300
    , height: 100
    , backgroundColor: "white"
  }
});

const mapStateToProps = state => ({
  workoutName: state.workoutName
  , dailyTotal: state.dailyTotal
  , deadzones: state.deadzones
  , isDateTimePickerVisible: state.isDateTimePickerVisible
  , endBeforeStartError: state.endBeforeStartError
});
const mapDispatchToProps = dispatch => ({
  updateWorkoutName: newName => dispatch({type: "updateWorkoutName", payload: newName})
  , updateDailyTotal: newDailyTotal => dispatch({type: "updateDailyTotal", payload: newDailyTotal})
  , handleDatePicked: date => dispatch({type: "handleDatePicked", payload: date})
  , createDeadzone: () => dispatch({type: "createDeadzone"})
  , showDateTimePicker: payload => dispatch({type: "showDateTimePicker", payload: payload})
  , hideDateTimePicker: () => dispatch({type: "hideDateTimePicker"})
  , dismissEndBeforeStartError: () => dispatch({type: "dismissEndBeforeStartError"})
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedWorkoutScreen)
