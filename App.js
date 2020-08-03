/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Image,
    View,
    Text,
    Button,
    StatusBar,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import MyView from './dev/views/My';
import SearchView from './dev/views/SearchBooks';
import CurrentView from './dev/views/CurrentBooks';
import LoginView from './dev/views/Login';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const App = () => {
    return (

        <NavigationContainer>
            <Tab.Navigator initialRouteName="current"
                           screenOptions={
                               ({route}) => ({

                                   tabBarIcon: ({focused, color, size}) => {
                                      let icon = require('./dev/assets/book.png');
                                      if(route.name === 'current'){
                                        focused && (icon =  require('./dev/assets/book_active.png'));

                                      }else if(route.name === 'search'){
                                        icon =  require('./dev/assets/search.png');
                                        focused && (icon =  require('./dev/assets/search_active.png'));
                                      }else if(route.name === 'my'){
                                        icon =  require('./dev/assets/user.png');
                                        focused && (icon =  require('./dev/assets/user_active.png'));
                                      }
                                       return <Image style={{width: 20, height: 20}}
                                                     source={icon}/>;
                                   },
                               })
                           }
            >
                <Tab.Screen

                    options={{title: '书架'}}
                    name="current" component={CurrentView}/>
                <Tab.Screen
                    options={{title: '搜索'}}
                    name="search" component={SearchView}/>
                <Tab.Screen
                    options={{title: '我的'}}
                    name="my" component={MyView}/>

            </Tab.Navigator>
        </NavigationContainer>


    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

export default App;
