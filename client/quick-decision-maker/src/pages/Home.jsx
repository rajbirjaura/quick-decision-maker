import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

const Home = () => {
  const [polls, setpolls] = useState([]);
  const [time, setTime] = useState(0);

  const fetchpolls = async () => {
    try {
      const res = await API.get("/polls");
      setpolls(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      const votedPolls =
        JSON.parse(localStorage.getItem("votedPolls")) || [];

      if (votedPolls.includes(pollId)) {
        alert("You already voted");
        return;
      }

      await API.post(`/polls/${pollId}/vote`, { optionIndex });

      localStorage.setItem(
        "votedPolls",
        JSON.stringify([...votedPolls, pollId])
      );

      fetchpolls();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (pollId) => {
    try {
      const confirmDelete = window.confirm("Are you sure?");
      if (!confirmDelete) return;

      await API.delete(`/polls/${pollId}`);
      fetchpolls();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const getTimeLeft = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();

    if (diff <= 0) return "Expired";

    const s = Math.floor(diff / 1000) % 60;
    const m = Math.floor(diff / 60000) % 60;
    const h = Math.floor(diff / 3600000);

    return `${h}h ${m}m ${s}s`;
  };

  const getLiveStatus = (expiresAt) => {
    return new Date() > new Date(expiresAt) ? "expired" : "active";
  };

  const getLiveWinner = (poll) => {
    const isExpired = new Date() > new Date(poll.expiresAt);
    if (!isExpired) return null;

    const maxVotes = Math.max(...poll.options.map((o) => o.votes));
    const winningOption = poll.options.find((o) => o.votes === maxVotes);

    return winningOption ? winningOption.text : null;
  };

  useEffect(() => {
    fetchpolls();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((p) => p + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="text-center font-manrope text-[34px] font-bold tracking-tight text-[#430907]">
        Winners Will Be Announced Here
      </div>

      <div className="w-200 mx-auto space-y-6 mt-6">
        {polls.length === 0 && (
          <div>
            <p className="text-center text-gray-800 border border-none bg-white mt-6 rounded-2xl ">No polls found</p>
            <div className="flex justify-center mt-3">
            <Link
                        to="/create"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl shadow-md font-medium transition"
                      >
                        Start a Poll
                      </Link></div>
            </div>
          
        )}

        {polls.map((poll) => {
          const liveStatus = getLiveStatus(poll.expiresAt);
          const liveWinner = getLiveWinner(poll);

          return (
            <div
              key={poll._id}
              className="rounded-[28px] bg-[#f5f5f4] shadow-2xl border border-white/60 overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          liveStatus === "active"
                            ? "bg-[#fff2a8] text-[#7a5500]"
                            : "bg-[#fcd6cc] text-[#991b13]"
                        }`}
                      >
                        {liveStatus}
                      </span>

                      <span className="text-sm text-gray-500 font-manrope">
                        {new Date(poll.expiresAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-semibold text-[#430907] leading-tight">
                      {poll.question}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDelete(poll._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="rounded-2xl bg-[#fff8f3] p-5 border border-[#f3dfd5]">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                      Total Votes
                    </p>
                    <p className="text-3xl font-black text-[#ef6620]">
                      {poll.totalVotes}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fff8f3] p-5 border border-[#f3dfd5]">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                      Time Left
                    </p>
                    <p className="text-lg font-bold text-[#e92f0d]">
                      {getTimeLeft(poll.expiresAt, time)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {poll.options.map((option, index) => {
                    const votedPolls =
                      JSON.parse(localStorage.getItem("votedPolls")) || [];

                    const alreadyVoted = votedPolls.includes(poll._id);
                    const isWinner = liveWinner === option.text;
                    const percent =
                      poll.totalVotes === 0
                        ? 0
                        : Math.round((option.votes / poll.totalVotes) * 100);

                    return (
                      <div
                        key={index}
                        className={`rounded-2xl p-4 border transition-all ${
                          isWinner && liveStatus === "expired"
                            ? "bg-[#fff0d9] border-[#ffc31b]"
                            : "bg-[#fdead7] border-transparent"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#430907] text-lg">
                              {option.text}
                            </span>

                            {isWinner && liveStatus === "expired" && (
                              <span className="text-[#ef6620] text-sm font-bold">
                                Winner
                              </span>
                            )}
                          </div>

                          <span className="text-sm font-bold text-[#430907]">
                            {option.votes} votes
                          </span>
                        </div>

                        <div className="w-full h-3 rounded-full bg-white/80 overflow-hidden mb-4">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isWinner && liveStatus === "expired"
                                ? "bg-[#ffc31b]"
                                : "bg-[#ef6620]"
                            }`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">
                            {percent}%
                          </span>

                          {liveStatus === "active" && (
                            <button
                              disabled={alreadyVoted}
                              onClick={() => handleVote(poll._id, index)}
                              className={`px-4 py-2 rounded-xl text-white font-medium transition ${
                                alreadyVoted
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-[#ef6620] hover:bg-[#991b13]"
                              }`}
                            >
                              {alreadyVoted ? "Voted" : "Vote"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {liveWinner && (
                  <div className="mt-8 rounded-[24px] bg-[#fff3e5] border border-[#ffd89e] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-bold text-[#ef6620] mb-1">
                        Official Result
                      </p>
                      <p className="text-2xl font-black text-[#430907]">
                        Winner: {liveWinner}
                      </p>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>Expires: {new Date(poll.expiresAt).toLocaleDateString()}</p>
                      <p>{new Date(poll.expiresAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;