const express=require("express")
const cors=require("cors")
const app=express();
app.use(express.json());
app.use(cors());
require('dotenv').config()
const port=process.env.PORT||3000;
app.use("/",require("./routes/loanRoutes"))
app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`)
})