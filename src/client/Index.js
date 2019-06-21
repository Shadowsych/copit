// react packages
import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

// style packages
import {fadeIn, fromBottom, fromTop, fromLeft, zoomIn} from 'react-navigation-transitions'

// pages
import Loading from "./Loading";
import Login from "./Login";
import Home from "./Home";
import Pings from "./Pings";
import Ping from "./Ping";
import Search from "./Search";
import Menu from "./Menu";

// custom animation transitions
const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  if(prevScene
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
    && nextScene.route.routeName == "Ping") {
      // transition fade in from the pings to the ping page
      return fadeIn();
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
  Home: {
    screen: Home
  },
  Pings: {
    screen: Pings
  },
  Ping: {
    screen: Ping
  },
  Search: {
    screen: Search
  },
  Menu: {
    screen: Menu
  }
}, {
  // create a padding to avoid overlapping the navbar of the device
  cardStyle: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
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
