const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());


app.get('/', (req , res)=>{
    res.send('khan exhibit server is running')
})

app.listen(port , ()=>{
    console.log(`Khan exhibit server is running on port :${port}`);
})