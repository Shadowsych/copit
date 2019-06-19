// react packages
import React from 'react';
import {Platform, StatusBar} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

// style packages
import {fadeIn, fromLeft} from 'react-navigation-transitions'

// pages
import Loading from "./Loading";
import Login from "./Login";

// custom animation transitions
const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  if(prevScene
    && prevScene.route.routeName == "Loading"
    && nextScene.route.routeName == "Login") {
      // fade in from the loading to login page
      return fadeIn();
    }
  // by default, open the page from the left
  return fromLeft();
}

// create the stackNavigator that holds all the pages (Intents)
const Navigation = createStackNavigator({
  Loading: {
    screen: Loading,
    navigationOptions: {
      header: null
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  }
}, {
  // create a padding to avoid overlapping the navbar of the device
  cardStyle: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  },
  // transition animations to other pages
  transitionConfig: (nav) => handleCustomTransition(nav)
});

// export the Index class as an app container
const Index = createAppContainer(Navigation);
export default Index;
