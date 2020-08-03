import React from 'react';
import {StyleSheet, Text, View} from 'react-native';


let Header  =(props)=>{
    console.log({...props});
    return (
           <View style = {styles.__header__box}>
               <Text style = {styles.__header__title}>{props.title}</Text>
               <Text style = {styles.__header__second}>{props.second}</Text>
           </View>
    );
}
const styles = StyleSheet.create({
    __header__box:{
        height:'auto',
        textAlign:"left",
        marginTop:40,
      width:"100%"
    },
    __header__title:{
        textAlign:"left",
        fontSize:30,
        width:"100%"
    },
    __header__second:{

        textAlign:"left"
    }

});
export default Header;

