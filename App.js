import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeScreen from './HomeScreen';
import WorkoutScreen from './WorkoutScreen';
import { Provider } from 'react-redux';
import { Notifications } from 'expo';
import store from './store';
import { androidChannel, notificationActions } from './utils';

const MainNavigator = createStackNavigator({
  HomeScreen: {screen: HomeScreen},
  WorkoutScreen: {screen: WorkoutScreen},
});
const Navigation = createAppContainer(MainNavigator);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    Notifications.createChannelAndroidAsync("WerkDroid", androidChannel);
    Notifications.deleteCategoryAsync("Workout").then(() =>
      Notifications.createCategoryAsync("Workout", notificationActions)
    );
    Notifications.addListener(e => {
      console.log("notified ", e)
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
