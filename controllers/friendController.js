

//DB 연결에 필요한 부분
const mysql = require('mysql2');
const conn = {  // mysql 접속 설정
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '1968',
    database: 'compTodo'
};

let connection = mysql.createConnection(conn); // DB 커넥션 생성
connection.connect();   // DB 접속

require('dotenv').config();
const dbCreds = {
    //environment variable 이용해서 sql 인증 정보 안전하게 저장
}

const fetchUserName = require('./usernameController').tellUserName;

const handleFriendSearch = async (req, res) => {
    const { targetUser } = req.body;
    var sql;
    if(!targetUser) //만약 targetUser이 비어있으면 
        return res.status(400).json({ msg: "empty request; need username to search" });
    //DB에 있는지 확인
    
    sql="select id from user where id='"+targetUser+"' or email='"+targetUser+"';";
    console.log("handleFriendSearch: "+sql);

    var results;
    try { //excute query
        connection.query(sql, function (err, results, fields) { 
            if (err) {
                console.log(err);
            }
            console.log(results);
            /*git test*/
        });
    } catch (err) {
        console.log("error")
    }

    if(results==undefined){ //찾는 유저 없음
        res.status(401).json({msg: "찾는 유저 없음"});
    }
    else{
        res.status(200).json(results); //체크해봐야 함.
    }
}

const handleNewFriendship = async (req, res) => {
    const { person1, person2 } = req.body;
    const isFriend = null;
    var sql;
    //person1과 person2가 이미 친구인지 확인
    try {
        //DB검색
        sql="select *from friends"+ 
        "where (myid='"+person1+"' and friendid='"+person2+"') "+
        "or (myid='"+person2+"' and friendid='"+person1+"')";

        console.log("friends Search: "+sql);

        try { //excute query
            connection.query(sql, function (err, results, fields) { 
                if (err) {
                    console.log(err);
                }
                console.log(results);
                /*git test*/
            });
        } catch (err) {
            console.log("error")
        }
    }
    catch {
        //DB 오류
        return res.status(500).json({ msg: "Internal Server Err: 친구 검색 재시도 바람."});
    }
    if(isFriend)
        return res.status(409).json({ msg: "이미 친구입니다." });

    //DB애서 친구추가 작업 진행
    try {
        //DB에서 친구 추가

        /*양 컬럼에 모두 추가함*/
        sql="insert into friends values('"+person1+"','"+person2+"');"+
        "insert into friends values('"+person2+"','"+person1+"');"

        try { //excute query
            connection.query(sql, function (err, results, fields) { 
                if (err) {
                    console.log(err);
                }
                console.log(results);
                /*git test*/
            });
        } catch (err) {
            console.log("error")
        }

    }
    catch {
        //DB 오류
        return res.status(500).json({ msg: "Internal Server Err: 친구 추가 재시도 바람."});
    }
    //
}   

const handleMyFriends = async(req, res) => {
    try {
        
    }
    catch {

    }
}

module.exports = { handleFriendSearch , handleNewFriendship };