import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Text,
    TouchableHighlight,
    View,
    Modal,
    Button,
    Image,
    ActionSheetIOS,
    TouchableNativeFeedback,
} from 'react-native';
import styles from '../assets/styles';
import History from './HistoryBooks';
import Store from 'react-native-simple-store';
import Toast, {DURATION} from 'react-native-easy-toast';
import RequestQ from '../utils/RequestQ';


/**
 * 2020.05.20 by 冬
 * 保留最初的想法
 */
class CurrentBooks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            isRefresh: false,
            loginModalStatus: false,
            historyModalStatus: false,
            booksList: require('../utils/MockData').default.mockCurrentData,
        };
    }

    closeHistory() {
        this.setState({
            historyModalStatus: false,
        });
    }

    openHistoryModal() {
        this.setState({
            historyModalStatus: true,
        });
    }

    async componentDidMount() {
        //检查本地账号
        if (await Store.get('user_name') && await Store.get('user_account') && await Store.get('user_password')) {
            RequestQ.login(await Store.get('user_account'), await Store.get('user_password')).then(async (res) => {
                if (res.code !== 200) {
                    this.refs.toast.show('请求错误:' + res.data, 2500);
                }
                if (res.code === 200) {

                    let brows = await RequestQ.currentBooks();
                    this.setState({
                        booksList: brows.list,
                    });
                }
                this.setState({
                    isLogin: true,
                });
            }).catch((error) => {
                this.refs.toast.show('请求错误:' + error, 2500);
            });
        } else {
            this.setState({
                isLogin: false,
            });
        }


        //test search


    }

    async __getBrows() {

    }

    __beginRefresh() {
        let _ = this;
        this.setState({
            isRefresh: true,
        }, () => {
            setTimeout(() => {
                _.setState({
                    isRefresh: false,
                });
                _.refs.toast.show('刷新完成', 1500);
            }, 1500);
        });
    }

    __showContinue() {
        ActionSheetIOS.showActionSheetWithOptions({
                options: ['取消', '确定'],
                title: '续借图书',
                message: '你最多可以在线续借一次，确定吗？',
                destructiveButtonIndex: 1,
                cancelButtonIndex: 0,
            },
            (buttonIndex) => {
                if (buttonIndex === 1) {

                    alert(buttonIndex);
                    //执行续借API


                }
            });
    }

    __renderBlank() {
        return (
            <View>
                <TouchableNativeFeedback onPress={() => {
                    this.props.navigation.navigate('search');
                }}>
                    <Text
                        style={{color: '#1260ff', width: '100%', textAlign: 'center', marginTop: 50}}>书架空空的，去找书！</Text>
                </TouchableNativeFeedback>
            </View>
        );
    }


    __renderNoLogin() {
        return (
            <View>
                <TouchableNativeFeedback onPress={() => {
                    this.props.navigation.navigate('my');
                }}>
                    <Text style={{
                        color: '#1260ff',
                        width: '100%',
                        textAlign: 'center',
                        marginTop: 50,
                    }}>你还未登录，点击去登录!</Text>
                </TouchableNativeFeedback>
            </View>
        );
    }

    render() {

        return (
            <>

                <SafeAreaView>
                    {/*{this.__renderNoLogin()}*/}

                    <ScrollView style={{width: '100%', height: '100%'}}
                                refreshControl={
                                    <RefreshControl
                                        title="正在刷新"
                                        refreshing={this.state.isRefresh}
                                        onRefresh={this.__beginRefresh.bind(this)}
                                    />
                                }
                    >
                        <View style={{
                            alignItems: 'center',
                            width: '95%',
                            marginLeft: '2.5%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <View>
                                <Text style={styles.header.header__title}>当前借阅</Text>
                                <Text style={styles.header.header__desc}>当前借阅</Text>
                            </View>
                            <TouchableNativeFeedback onPress={this.openHistoryModal.bind(this)}>
                                <Text>历史</Text>
                            </TouchableNativeFeedback>
                        </View>

                        <View style={{flex: 1}}>
                            <View style={styles.current.books__list}>
                                {
                                    this.state.booksList.map((row, index) => {
                                        return (
                                            <View style={styles.current.books__item} key={index}>
                                                <View style={styles.current.books__item__left}>
                                                    <View style={{width: '100%', textAlign: 'left'}}><Text
                                                        style={styles.current.books__title}>{row.name}</Text></View>

                                                    <Text key={index + 1}
                                                          style={styles.current.books__time}>借阅时间：{row.start_time}</Text>
                                                    <Text key={index + 2}
                                                          style={styles.current.books__time}>限还时间：{row.end_time}</Text>
                                                </View>
                                                <View style={styles.current.books__item__right}>
                                                    <Button onPress={this.__showContinue.bind(this)} title='续借'
                                                            style={styles.current.books__btn}/>
                                                </View>
                                            </View>
                                        );
                                    })
                                }
                            </View>
                        </View>
                        {this.state.booksList.length === 0 ? this.__renderBlank() : null}
                    </ScrollView>

                    {this.state.historyModalStatus ? <History status={this.state.historyModalStatus}
                                                              closeHistory={this.closeHistory.bind(this)}/> : null}

                    <Toast  //提示
                        ref="toast"
                        style={{backgroundColor: '#1260ff'}}
                        position='bottom'
                        positionValue={200}
                        opacity={0.8}
                        textStyle={{color: 'white'}}
                    />

                </SafeAreaView>


            </>
        );
    }

}

export default CurrentBooks;
