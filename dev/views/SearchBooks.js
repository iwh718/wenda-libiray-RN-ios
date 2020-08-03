import React from 'react';
import {SafeAreaView, ScrollView, Text, TouchableNativeFeedback, View,TextInput} from 'react-native';
import styles from '../assets/styles';
import RequestQ from '../utils/RequestQ';

class SearchBooks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue:'',
            searchList:[]
        }
    }

   async componentDidMount(){
      await  RequestQ.searchBooks('ps');
    }

    __saveSearchValue(text){
        console.log(text)
    }
    render() {
        return (<SafeAreaView>
            <ScrollView
                style={{width:"100%",height:"100%"}}
                contentInsetAdjustmentBehavior="automatic">

                <View style={{
                    alignItems: 'center',
                    width: '95%',
                    marginLeft: '2.5%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <View>
                        <Text style={styles.header.header__title}>搜索图书</Text>
                        <Text style={styles.header.header__desc}>探寻历史</Text>
                    </View>
                </View>

                <View style={{width:"90%",marginLeft:"5%",marginRight:"5%",display:"flex",flexDirection:"row",alignItems:"center"}}>
                    <TextInput placeholder='输入图书名' onChange={(text)=>this.__saveSearchValue(text)}
                               style={{width:"80%",marginTop:30,marginBottom:10,borderColor: 'rgba(0,0,0,0.2)', borderBottomWidth: 1,padding:10,borderRadius:5}}/>
                               <TouchableNativeFeedback onPress={()=>alert('searching')}>
                                   <Text>确定</Text>
                               </TouchableNativeFeedback>
                </View>

            </ScrollView>
        </SafeAreaView>);

    }

}

export default SearchBooks;
