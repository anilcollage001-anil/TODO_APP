const express = require("express");
const jwt = require("jsonwebtoken");
const {authMiddleware } = require("./middileware");

const app = express();
app.use(express.json());

let USERS =[];
let TODOS = [];

let CURRENT_USER_ID = 1;
let CURRENT_TODO_ID = 1 ;

app.post("/signup",(req,res)=>{
const username = req.body.username ;
const password = req.body.password ;
const userExsist = USERS.find(u =>u.username === username );
if(userExsist){
    res.status(403).json({
        message : "userwith this name already exist "
    })
    return ;
}
    USERS.push({
        id : CURRENT_USER_ID ++,
        username ,
        password
    })
    res.json({
        id :CURRENT_TODO_ID - 1 
    })

})


app.post("/signin",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const userExist = USERS.find(u=> u.username === username && u.password === password );
    if(!userExist){
        res.status(403).json({
            message :"credential is invalied "
        })
    }
    const token = jwt.sign({
        userId : userExist.id 
    }, "anil123");

    res.json({
        token 
    })
})




app.post("/todo",authMiddleware, (req,res)=>{
      const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;

    TODOS.push({
        id: CURRENT_TODO_ID++,
        title: title,
        description: description,
        userId: userId
    })
    res.json({
        message: "Todo made"
    })
    
})
app.delete("/todos/:todoId",(req,res)=>{
  const userId = req.userId;
    const todoId = parseInt(req.params.todoId); /// string

    const doesUserOwnTodo = TODOS.find(t => t.id === todoId && t.userId === userId);

    if (doesUserOwnTodo) {
        TODOS = TODOS.filter(t => t.id === todoId);
        res.json({
            message: "Deleted"
        })
    } else {
        res.status(411).json({
            message: "Either todo doesnt exist or this is not your todo"
        })
    }
})
app.get("/todos",(req,res)=>{
 const userId = req.userId;
    const userTodos = TODOS.filter(t => t.userId === userId);
    res.json({
        todos: userTodos
    })
})

app.listen(3002);