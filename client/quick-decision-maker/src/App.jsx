import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePoll from "./pages/CreatePoll";
import Landing from "./pages/Landing";
import logo from "/logo.png"
import bg from "/bg.png" 
import About from "./pages/about";

const App = () => {
  return (
    <div  className="bg-cover bg-center min-h-screen"
    style={{ backgroundImage: `url(${bg})` }} >
      <div className="flex w-full">
      <Link to={"/"}> <div className=" flex">
       <img className="w-14 h-14 p-2 mt-1 ml-12" src={logo}/>
        <h1 className="text-[32px] text-[#7c1912] font-manrope font-bold py-2 tracking-tighter ">duple</h1>
      </div></Link>
      
      <div className="flex justify-center text-center py-6 gap-4 align-center ml-250">
        <Link to={"/about"} className="text-[#431807] font-manrope text-lg">About Us</Link>
        <Link  className="text-[#431807] font-manrope text-lg">Services</Link>
        <Link  className="text-[#431807] font-manrope text-lg">Get In Touch</Link>
  
      </div>


      </div>
    

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/polls" element={<Home />} />
      </Routes>
    </div>
    
  );
};

export default App;