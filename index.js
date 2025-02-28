const express =require("express");
const mongoose =require("mongoose");

const password = encodeURIComponent("Hemanth@5221");
const Port =process.env.PORT || 5000;
const app=express();

mongoose.connect(`mongodb+srv://hemanthchandrasekharv:${password}@rent.e31d7.mongodb.net/?retryWrites=true&w=majority&appName=rent`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection =mongoose.connection;
connection.once("open",() => {
    console.log("MongoDb Connected");
});


app.use(express.json());
const userRoute = require("./routes/user");
app.use("/user", userRoute);


app.route("/").get((req,res)=>res.json("Your first rest api 2"));

app.listen(Port, ()=>console.log(`your server is running on port ${Port}`));