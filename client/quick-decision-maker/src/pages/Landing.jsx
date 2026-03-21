import React from "react";
import { Link } from "react-router-dom";
import image2 from "../assets/image2.png"

const Landing = () => {
  return (
    <div className=" flex items-center mt-4 px-6">
      <div className="m-20">
        <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
          🔥 Fast polls. Clear decisions.
        </div>

        <h1 className="font-manrope tracking-tight text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#430907]">
          Make quick decisions
          <br />
          without the chaos.
        </h1>

        <p className="text-lg text-gray-600 leading-8 max-w-2xl mb-8">
          Create elegant polls, collect answers fast, and help your team or
          friends decide in seconds.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/create"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl shadow-md font-medium transition"
          >
            Start a Poll
          </Link>

          <Link
            to="/polls"
            className="bg-[#ffc31b] hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-xl shadow-md font-medium transition"
          >
            View Polls
          </Link>
        </div>
        <div className="pt-5">
        <code>Created by Rajbir Singh</code>
        </div>
      </div>
      <div className="pl-8">
        <img src={image2}/>

      </div>
     
    </div>
  );
};

export default Landing;