import DOMParser from 'react-native-html-parser';
import Toast, {DURATION} from 'react-native-easy-toast';
import Store from 'react-native-simple-store';
import {acc} from 'react-native-reanimated';
import cheerio from 'cheerio';

const parser = new DOMParser.DOMParser();

let URLS = {
    loginUrl: 'http://172.16.1.43/dzjs/login.asp',
    logUrl: 'http://172.16.1.43/dzjs/login.asp',//登录url
    myBrowUrl: 'http://172.16.1.43/dzjs/jhcx.asp',//我的借阅
    myContinueUrl: 'http://172.16.1.43/dzxj/dzxj.asp',//我的图书续借
    myHiStoryUrl: 'http://172.16.1.43/dzjs/dztj.asp',//我的借阅历史
    bookInfoUrl: 'http://172.16.1.43/showmarc/table.asp?nTmpKzh=',//图书详情信息
    bookSearchUrl: 'http://172.16.1.43/wxjs/tmjs.asp',//搜索地址

};

//基础请求
let baseQ = async (url) => {
    try {
        let response = await fetch(url);
        return response;
    } catch (error) {
        console.error(error);
    }
    return false;
};


//登录
let login = async (account = '0035752', password = '0035752') => {
    console.log('登录开始');
    let data = {code: 500, data: null};
    const isFailLogin = /.*window.history.back.*/;  //判断是否失败
    const isSuccessLogin = /.*dzjs.login_form.*/; //判断是否成功
    try {
        let loginInfo = await fetch(URLS.loginUrl, {
            method: 'POST',
            headers: {
                credentials: 'include',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'imageField.x=42&imageField.y=10&user=' + account + '&pw=' + password,
        });
        console.log('返回信息');
        let res = await loginInfo.text();
        console.log(res);
        if (isSuccessLogin.test(res)) {
            //检查登录
            console.log('登录成功！');
            let doc = cheerio.load(res);
            res = doc('script').html().replace('，欢迎您登录！\\n离开时,不要忘记安全退出！");', '')
                .replace('window.alert("', '')
                .replace('window.location="../dzjs/login_form.asp";', '')
                .replace('\$nbsp;', '')
                .replace(' ', '').trim();
            console.log('用户名');
            console.log(res);
        }
        data.code = 200;
        data.name = res;

        Store.save('user_name', res);
        Store.save('user_account', account);
        Store.save('user_password', password);


    } catch (e) {
        data.data = e;
    }

    return data;

};


//搜索图书
let searchBooks = async (bname, mode = '1', sort = '正题名') => {

    console.log('search开始');
    let data = {code: 500, data: null};

    try {
    let searchInfo = await fetch(URLS.bookSearchUrl, {
        method: 'POST',
        headers: {
            credentials: 'include',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'txtWxlx=CN&hidWxlx=spanCNLx&txtPY=HZ&txtTm=' + bname + '&txtLx=%&txtSearchType=' + mode + '&nMaxCount=5000&nSetPageSize=50&cSortFld=' + sort + '&B1=检索',
    });
    let res = await searchInfo.text();

    let $ = cheerio.load(res);
    console.log('搜索结果')
    let searchList = [];
    $('.tableblack tbody tr:first-child table tr:nth-of-type(2) table:nth-of-type(2) tr').each((index, row) => {
        console.log('遍历搜索结果')
        let json = {};
        json.id =     $('td:nth-of-type(7) a', row).attr('href').replace('../dzyy/default.asp?nTmpKzh=', '');
        json.name =   $('td:nth-of-type(3) a', row).text();
        json.time =   $('td:nth-of-type(6)',row).text();
        json.author = $('td:nth-of-type(2)', row).text();
        json.number = $('td:nth-of-type(4)', row).text();
        searchList.push(json);
    });

    data.code = 200;
    data.list = searchList;
    console.log(searchList)

    } catch (e) {
        data.data = e;
    }

    return data;


};
//获取借阅图书
let currentBooks = async () => {

    let data = {code: 500, data: null};
    try {
        let browInfo = await fetch(URLS.myBrowUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        let doc = cheerio.load(await browInfo.text());
        console.log(doc);
        let brows = doc('table[width=\"98%\"] tbody tr:not(table[width=\"98%\"] tbody tr:first-child)');
        let browList = [];
        brows.each((index, row) => {
            let json = {};
            json.name = $('td:nth-child(2)', row).outerHTML;
            json.start_time = $('td:nth-child(4)', row).outerHTML;
            json.end_time = $('td:nth-child(5)', row).outerHTML;
            json.id = $('td:nth-child(8) a').attr('href').replace('../dzxj/dzxj.asp?nbsl=', '', row);
            browList.push(json);
        });
        data.code = 200;
        data.list = browList;

    } catch (e) {
        data.data = e;
    }

    return data;


};
//获取借阅历史
let historyBooks = async () => {

    let data = {code: 500, data: null};
    try {
        let HistoryInfo = await fetch(URLS.myHiStoryUrl, {
            method: 'GET',
            headers: {
                credentials: 'include',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        let res = await HistoryInfo.text();
        let $ = cheerio.load(res);
        let historysList = [];

        let list = $('.pmain table:nth-of-type(4)').html();
        // console.log(list)
        let trs = $('tr', list).each((index, row) => {
            let name = $('td:nth-of-type(3)', row).text();
            let number = $('td:nth-of-type(2)', row).text();
            // console.log('name:')
            // console.log(name)
            // console.log('number:')
            // console.log(number);
            let jn = {};
            jn.name = name.trim();
            jn.number = number.trim();
            historysList.push(jn);
        });
        data.code = 200;
        data.list = historysList;
        console.log(JSON.stringify(data.list[0]));
    } catch (e) {
        data.data = e;
    }

    return data;
};
//续借
let continueBooks = async (id) => {
    let data = {code: 500, data: null};
    try {
        let cns = await fetch(URLS.myContinueUrl + '?nbsl=' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log(cns);
        let doc = parser.parseFromString(cns.text(), 'text/html');
        let sc = doc.querySelector('script');
        if (!/.*?\u6700\u9ad8\u7eed\u501f.*?/.test(sc.outerHTML)) {
            data.status = 1;
            data.code = 200;
        } else {
            data.status = 0;
            //已经续借过！
            data.code = 201;
        }

    } catch (e) {
        data.data = e;
        data.status = 0;
    }
    return data;

};
//详情
let detailBooks = async (id) => {

    let data = {code: 500, data: null};
    try {
        let binfo = await fetch(URLS.bookInfoUrl + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log(binfo);
        let doc = parser.parseFromString(binfo.text(), 'text/html');
        let sc = doc.querySelector('.panelContentContainer div:nth-of-type(3) table tr:nth-of-type(7)').outerHTML;
        sc = sc.replace('&nbsp;', '').replace('<td>', '')
            .replace('</td>', '').replace('<tr>', '')
            .replace('</tr>', '')
            .replace(' ', '');//移除空格编码
        if (sc.length > 5) {
            data.status = 1;
            data.info = sc;
        } else {
            data.status = 0;
            //没有简介
            data.code = 201;
        }

    } catch (e) {
        data.data = e;
        data.status = 0;
    }
    return data;
};


export default {
    login,
    currentBooks,
    historyBooks,
    continueBooks,
    searchBooks,

};
