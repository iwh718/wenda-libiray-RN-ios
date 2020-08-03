import React from 'react';
import {TextInput,Modal, SafeAreaView, ScrollView, Text, TouchableHighlight, View,Image,TouchableNativeFeedback,Button} from 'react-native';
import styles from '../assets/styles';
import Toast, {DURATION} from 'react-native-easy-toast';
import  Store from 'react-native-simple-store';
import RequestQ from '../utils/RequestQ';
class My extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            isRefresh: false,
            loginModalStatus: false,
            name:'点击登录',
            account:'',
            password:''
        };
    }

   async componentDidMount() {

        // RequestQ.historyBooks();

       console.log('checkISlogin')
       console.log(await Store.keys())
        if(await Store.get('user_name')){

            this.setState({
                name:await Store.get('user_name'),
                // isLogin:true
            });

        }
    }

    __saveAccount(e){


        this.setState({
            account:e
        })

    }
    __savePass(e){

        this.setState({
            password:e
        })
    }

    subLogin(){
        RequestQ.login();
        // if(this.state.account.length > 0 && this.state.password.length >0){
        //     this.refs.toast.show('模拟登录！',1000);
        //     RequestQ.login(this.state.account,this.state.password);
        //
        // }else{
        //     this.refs.toast.show('请补全信息！',1000);
        // }

    }
    __openLogin(){
        if(!this.state.isLogin){
            this.setState({
                loginModalStatus:true
            })
        }
    }
    __renderLogin() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                presentationStyle='formSheet'
                visible={this.state.loginModalStatus}
                onRequestClose={() => {
                    alert('Modal has been closed.');
                }}
            >
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
                                <Text style={styles.header.header__title}>登录文达图书馆</Text>
                                <Text style={styles.header.header__desc}>秋果工作室</Text>
                            </View>
                            <TouchableNativeFeedback onPress={()=>{
                                this.setState({
                                    loginModalStatus:false
                                })
                            }}><Text>关闭</Text></TouchableNativeFeedback>
                        </View>

                        <View style={{width:"95%",marginLeft:"2.5%",marginTop:20}}>
                            <Text style={{marginBottom:5}}>输入账号</Text>
                            <TextInput onChangeText={this.__saveAccount.bind(this)} style={{marginBottom:10,borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1,padding:10,borderRadius:5}} placeholder='图书卡号' />
                            <Text style={{marginBottom:5}}>输入密码</Text>
                            <TextInput onChangeText={this.__savePass.bind(this)} style={{marginBottom:10,borderColor: 'rgba(0,0,0,0.2)', borderWidth: 1,padding:10,borderRadius:5}} placeholder='默认同卡号'/>
                            <Button onPress={this.subLogin.bind(this)} title='登录'/>
                        </View>

                    </View>
                </View>
            </Modal>
        );
    }

    render() {
        return (
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={{width: '100%', height: '100%'}}>

                    <View style={{
                        alignItems: 'center',
                        width: '95%',
                        marginLeft: '2.5%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <View>
                            <Text style={styles.header.header__title}>我的❤️</Text>
                            <Text style={styles.header.header__desc}>Nice</Text>
                        </View>
                    </View>
                    <View style={{width:"100%",display:"flex",alignItems:"center",marginTop:60}}><Image source={require('../assets/read.png')} style={{width:80,height:80,borderRadius:80}}/></View>
                  <View style={{width:"100%"}}>
                      <TouchableNativeFeedback onPress={this.__openLogin.bind(this)}>
                          <Text style={{textAlign:"center",marginTop:20}}>点击登录:{this.state.name}</Text>
                      </TouchableNativeFeedback>
                  </View>
                    <View style={{marginTop:20,width:"90%",marginLeft:"5%",backgroundColor:"#fff",borderRadius:10,padding:10}}>
                        <View style={{marginTop:5}}><Text>开发者：秋果工作室</Text></View>
                        <View style={{marginTop:5}}><Text>交流群啊：630020826</Text></View>
                        <View style={{marginTop:5}}><Text>版本：v1.0.0-RN0.62</Text></View>
                    </View>
                    <View style={{marginTop:20,width:"90%",marginLeft:"5%",padding:10}}>
                        <View><Text>Tips:本应用仅限于文达学院内网使用。</Text></View>
                    </View>
                    {this.state.isLogin ?
                        <View style={{width:"100%",textAlignc:"center",marginTop:20}}>
                            <TouchableNativeFeedback onPress={()=>alert('退出！ ')}>
                                <Text style={{textAlign:"center",color:"red"}}>退出登录</Text>
                            </TouchableNativeFeedback>
                        </View>:null}

                </ScrollView>
                {this.__renderLogin()}
                <Toast  //提示
                    ref="toast"
                    style={{backgroundColor:'#1260ff'}}
                    position='bottom'
                    positionValue={200}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
            </SafeAreaView>);
    }

}

export default My;
