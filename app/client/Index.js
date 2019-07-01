// react packages
import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

// style packages
import {fadeIn, fromBottom, fromTop, fromLeft, zoomIn} from 'react-navigation-transitions';

// account screens
import Login from "./screens/account/Login";
import Register from "./screens/account/Register";
import Menu from "./screens/account/Menu";
import EditAccount from "./screens/account/EditAccount";

// leaderboard screens
import Leaderboards from "./screens/leaderboard/Leaderboards";

// loading screens
import Loading from "./screens/loading/Loading";

// map screens
import Home from "./screens/map/Home";

// ping screens
import Pings from "./screens/ping/Pings";
import AddPing from "./screens/ping/AddPing";
import Search from "./screens/ping/Search";
import MyPings from "./screens/ping/MyPings";

// custom animation transitions
const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  if(prevScene
    && prevScene.route.routeName == "Login"
    && nextScene.route.routeName == "Register") {
      // transition from the bottom from the login to register page
      return fromBottom();
  } else if(prevScene
    && prevScene.route.routeName == "Home"
    && nextScene.route.routeName == "Pings") {
      // transition from the bottom from the home to pings page
      return fromBottom();
  } else if(prevScene
    && prevScene.route.routeName == "Home"
    && nextScene.route.routeName == "Search") {
      // transition from the top from the home to search page
      return fromTop();
  } else if(prevScene
    && prevScene.route.routeName == "Home"
    && nextScene.route.routeName == "Menu") {
      // transition from the left from the home to menu page
      return fromLeft();
  } else if(prevScene
    && prevScene.route.routeName == "Pings"
    && nextScene.route.routeName == "AddPing") {
      // transition fade in from the pings to the add ping page
      return fadeIn();
  } else if(prevScene && prevScene.route.routeName == "Menu") {
      // transition from the the bottom from the menu to any other page
      return fromBottom();
  }
  // by default, open the page by zooming in
  return zoomIn();
}

// create the stackNavigator that holds all the pages (Intents)
const Navigation = createStackNavigator({
  Loading: {
    screen: Loading
  },
  Login: {
    screen: Login
  },
  Register: {
    screen: Register
  },
  Home: {
    screen: Home
  },
  Pings: {
    screen: Pings
  },
  AddPing: {
    screen: AddPing
  },
  Search: {
    screen: Search
  },
  Menu: {
    screen: Menu
  },
  EditAccount: {
    screen: EditAccount
  },
  MyPings: {
    screen: MyPings
  },
  Leaderboards: {
    screen: Leaderboards
  }
}, {
  // create a padding to avoid overlapping the navbar of the device
  cardStyle: {
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
  },
  // default navigation options
  defaultNavigationOptions: {
    header: null
  },
  // transition animations to other pages
  transitionConfig: (nav) => handleCustomTransition(nav)
});

// export the Index class as an app container
const Index = createAppContainer(Navigation);
export default Index;
