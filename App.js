import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeScreen from './HomeScreen';
import WorkoutScreen from './WorkoutScreen';

const MainNavigator = createStackNavigator({
  HomeScreen: {screen: HomeScreen},
  WorkoutScreen: {screen: WorkoutScreen},
});
export default App = createAppContainer(MainNavigator);
