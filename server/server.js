
const express = require('express');

require('dotenv').config();

const cors = require('cors');
const connectDB = require('./configs/db');
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const creditsRoutes = require("./routes/creditsRoutes");
const { stripeWebhooks } = require('./controllers/webhooks');
const app = express()

connectDB()
//stripe webhooks
app.post('/api/stripe',express.raw({type:"application/json"}),stripeWebhooks)
//middelewere
app.use(cors())
app.use(express.json())

//routes

app.get('/',(req,res)=>res.send("Server is Live"))
app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
app.use('/api/credit',creditsRoutes)
const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})