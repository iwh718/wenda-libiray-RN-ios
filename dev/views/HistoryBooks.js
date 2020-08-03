import React from 'react';
import {Text, View, Modal, TouchableNativeFeedback, TextInput, Button, SafeAreaView, ScrollView} from 'react-native';
import styles from '../assets/styles';
import MockData from '../utils/MockData';
import RequestQ from '../utils/RequestQ';
import Store from 'react-native-simple-store'
import Toast from 'react-native-easy-toast';


/**
 * 借阅历史
 */
class HistoryBooks extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            isLoad:true,
            loadTips:"加载中...",
            historyList:MockData.mockHistoryData
        }
    }
   async  componentDidMount() {

        if(await Store.get('user_name')){
           let r = await RequestQ.login(await Store.get('user_account'),await Store.get('user_password'));
           if(r.code === 200){
               let his =  await RequestQ.historyBooks();
               if(his.code === 200){
                   this.setState({
                       historyList:his.list,
                       isLoad:false
                   })
               }else{
                   this.setState({
                       loadTips:his.data
                   })
                   this.refs.toast.show('数据异常！')
                   console.log('借阅历史异常：'+ his.data)
               }

           }else{
               this.refs.toast.show(r.data);
               this.setState({
                   loadTips:r.data
               })
           }


        }

    }

    render(){
        return (
            <Modal
                animationType="slide"
                transparent={false}
                presentationStyle='formSheet'
                visible={this.props.status}
                onRequestClose={() => {
                    alert('Modal has been closed.');
                }}
            >
                <Toast  //提示
                    ref="toast"
                    style={{backgroundColor:'#1260ff'}}
                    position='bottom'
                    positionValue={200}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
                <View style={{marginTop: 10}}>
                    <View>
                        <View style={{
                            alignItems: 'center',
                            width: '95%',
                            marginLeft: '2.5%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <View>
                                <Text style={styles.header.header__title}>借阅历史</Text>
                                <Text style={styles.header.header__desc}>点滴之间</Text>
                            </View>
                            <TouchableNativeFeedback onPress={()=>{
                                this.props.closeHistory()
                            }}><Text>关闭</Text></TouchableNativeFeedback>
                        </View>

                        <ScrollView style={{width:"100%",height:"100%"}}>
                           {
                               this.state.isLoad ? <Text>加载中...</Text> :
                                   this.state.historyList.map((row, index) => {
                                       if(index === 0)return;
                                       return (
                                           <View style={styles.current.books__item} key={index}>
                                               <View style={styles.current.books__item__left}>
                                                   <View style={{width: '100%', textAlign: 'left'}}><Text
                                                       style={styles.current.books__title}>{row.name}</Text></View>

                                                   <Text key={index + 1}
                                                         style={styles.current.books__time}>索引号：{row.number}</Text>
                                               </View>

                                           </View>
                                       );
                                   })
                           }
                       </ScrollView>



                    </View>
                </View>
            </Modal>
        );
    }

}

export default HistoryBooks;
