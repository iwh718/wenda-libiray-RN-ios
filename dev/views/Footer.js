import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableNativeFeedback,
} from 'react-native';
import global_styles from '../assets/styles';
class Footers extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>

                <View

                    style={styles.footer}>

                    <View style={styles.footer_item}><Text style={this.props.navIndex === 0 ? styles.footer_text_hover:styles.footer_text}>首页</Text></View>

                    <View style={styles.footer_item_icon}><TouchableNativeFeedback onPress={this.props.search}>
                        <Image style={{width:40,height:40,marginLeft:5,marginTop:5}} source={require('../res/img/ok.png')}/>
                    </TouchableNativeFeedback></View>


                    <View style={styles.footer_item}><TouchableNativeFeedback onPress={()=>{
                        // console.log(this.props.navigation)
                        this.props.navigation.navigate('My')

                    }}><Text style={this.props.navIndex === 2 ? styles.footer_text_hover:styles.footer_text}>我的</Text></TouchableNativeFeedback></View>
                </View>


            </>
        );
    }
}

const styles = StyleSheet.create(global_styles);
export default Footers;
