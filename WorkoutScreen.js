import React from "react";
import { connect } from "react-redux";
import { Notifications } from 'expo';
import { View, Modal } from "react-native";
import { Input, Text, Button, Divider } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";
import { WorkoutScreenStyles as styles } from './styles';

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
    <Input
      style={{marginTop: 50}}
      label="Minutes between sets"
      labelStyle={styles.label}
      keyboardType="numeric"
      defaultValue={props.minutesBetweenSets.toString()}
      onChangeText={props.updateMinutesBetweenSets}
    />
    <Input
      style={{marginTop: 50}}
      label={`${props.workoutName} per set`}
      labelStyle={styles.label}
      keyboardType="numeric"
      defaultValue={props.actionsPerSet.toString()}
      onChangeText={props.updateActionsPerSet}
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
      <Button style={{marginTop: 5}} title="Save" onPress={props.scheduleNotifications(props.nIDs)} />
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


const mapStateToProps = state => ({
  workoutName: state.workoutName
  , dailyTotal: state.dailyTotal
  , minutesBetweenSets: state.minutesBetweenSets
  , actionsPerSet: state.actionsPerSet
  , deadzones: state.deadzones
  , isDateTimePickerVisible: state.isDateTimePickerVisible
  , endBeforeStartError: state.endBeforeStartError
  , nIDs: ["id1", "id2"]
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  updateWorkoutName: newName => dispatch({type: "updateWorkoutName", payload: newName})
  , updateDailyTotal: newDailyTotal => dispatch({type: "updateDailyTotal", payload: newDailyTotal})
  , updateMinutesBetweenSets: newMinutesBetweenSets => dispatch({type: "updateMinutesBetweenSets", payload: newMinutesBetweenSets})
  , updateActionsPerSet: newActionsPerSet => dispatch({type: "updateActionsPerSet", payload: newActionsPerSet})
  , handleDatePicked: date => dispatch({type: "handleDatePicked", payload: date})
  , createDeadzone: () => dispatch({type: "createDeadzone"})
  , showDateTimePicker: payload => dispatch({type: "showDateTimePicker", payload: payload})
  , hideDateTimePicker: () => dispatch({type: "hideDateTimePicker"})
  , dismissEndBeforeStartError: () => dispatch({type: "dismissEndBeforeStartError"})
  , scheduleNotifications: nIDs => e => nIDs.map(
    id => Notifications.scheduleLocalNotificationAsync({
        title: "newAction"
        , body: id
        , categoryId: "Workout"
        , sound: true
        , channelId: "WerkDroid"
      }
      , {time: (new Date()).getTime() + 2000}
    ).then(nID => dispatch({type: "addNID", payload: nID}))
  )
});
export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedWorkoutScreen)
