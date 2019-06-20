// react packages
import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

// style packages
import {fadeIn, fromBottom, zoomIn} from 'react-navigation-transitions'

// pages
import Loading from "./Loading";
import Login from "./Login";
import Home from "./Home";
import Pings from "./Pings";

// custom animation transitions
const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  if(prevScene
    && prevScene.route.routeName == "Loading"
    && nextScene.route.routeName == "Login") {
      // fade in from the loading to login page
      return fadeIn();
    } else if(prevScene
    && prevScene.route.routeName == "Home"
    && nextScene.route.routeName == "Pings") {
      // transition from the bottom from the home to pings page
      return fromBottom();
    }
  // by default, open the page by zooming in
  return zoomIn();
}

// create the stackNavigator that holds all the pages (Intents)
const Navigation = createStackNavigator({
  Loading: {
    screen: Loading,
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
      headerLeft: null,
      gesturesEnabled: false
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
      headerLeft: null,
      gesturesEnabled: false
    }
  },
  Pings: {
    screen: Pings
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
