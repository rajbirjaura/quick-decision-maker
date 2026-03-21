const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Poll = require("../server/models/poll");

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("api is running");
});

app.post("/api/polls",async(req,res)=>{
    try{
        const {question,options,expiresAt} = req.body;

        if(!question||!options||!expiresAt){
            return res.status(400).json({
                message:"please fill all fields"
            });
        }
        if(!Array.isArray(options)|| options.length<2||options.length>4){
            return res.status(400).json({
                message:"options must be between 2 and 4"
            });
        }
        const cleanoptions = options.map((opt)=>opt.trim()).filter((opt)=>opt !=="");

        if(cleanoptions.length<2||cleanoptions.length>4){
            return res.status(400).json({message:"please provide valid 2 to 4 options"});
        }

        const polls = await Poll.create({
            question:question.trim(),
            options: cleanoptions.map((opt) => ({ text: opt })),
            expiresAt
        });
        res.status(200).json({
            message:"poll created successfully",
            polls
        });
    }
    catch (error){
        res.status(500).json({
            message:error.message
        });
    }
});


app.get("/api/polls",async (req,res)=>{
    try {
        const polls = await Poll.find().sort({createdAt:-1});

        const updatedpolls = polls.map((poll)=>{
            const isexpired = new Date() > new Date(poll.expiresAt);

            const totalVotes = poll.options.reduce(
                (sum,opt) => sum + opt.votes,0          //it means default value is 0 
            );
            let winner = null;
            if(isexpired){
                const maxvotes = Math.max(...poll.options.map((o) => o.votes));
                const winningoption = poll.options.find((o)=>o.votes === maxvotes);
                winner = winningoption ? winningoption.text :null;  
            }
            return {
                ...poll._doc,
                status:isexpired ? "expired":"active",
                totalVotes: totalVotes,
                winner
            };

        });
        res.json(updatedpolls);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.post("/api/polls/:id/vote",async (req,res)=>{
    try {
        const {optionIndex} = req.body;
        
        const poll = await Poll.findById(req.params.id);

        if(!poll){
            return res.status(404).json({
                message:"poll not found"
            });
        }

        const isexpired = new Date() > new Date(poll.expiresAt);

        if(isexpired){
            return res.status(400).json({
                message:"poll has expired"
            });
        }
        if (optionIndex===undefined||optionIndex<0||optionIndex>=poll.options.length){
            return res.status(400).json({
                message:"invalid option index"
            });
        }
        poll.options[optionIndex].votes +=1;

        await poll.save();

        res.status(200).json({
            message:"vote submitted successfully",
            poll
        });

    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

app.delete("/api/polls/:id", async (req, res) => {
    try {
      const poll = await Poll.findByIdAndDelete(req.params.id);
  
      if (!poll) {
        return res.status(404).json({
          message: "Poll not found",
        });
      }
  
      res.json({
        message: "Poll deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });



mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))
app.listen(3000,()=>{
    console.log("server is running on port 3000");
})