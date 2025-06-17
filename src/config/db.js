let mysql=require("mysql2");
let conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"moive_recommendation_system"
});

conn.connect((err) =>{
    if(err){
        console.log("error is "+err);
    }
    else{
        console.log("database connected succesfully");
    }
});
module.exports=conn;
