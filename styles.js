import { StyleSheet } from "react-native";

export const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1
    , backgroundColor: '#fff'
    , alignItems: 'center'
    , justifyContent: 'center'
  },
});

export const WorkoutScreenStyles = StyleSheet.create({
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
