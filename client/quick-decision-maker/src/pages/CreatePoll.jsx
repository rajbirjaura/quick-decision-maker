import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [question, setquestion] = useState("");
  const [options, setoptions] = useState(["", "", "", ""]);
  const [expiresAt, setexpiresAt] = useState("");

  const handleoptionchange = (index, value) => {
    const newoptions = [...options];
    newoptions[index] = value;
    setoptions(newoptions);
  };

  const handlecreatepoll = async (e) => {
    e.preventDefault();

    const filtered = options.filter((o) => o.trim() !== "");

    if (filtered.length < 2) {
      alert("At least 2 options required");
      return;
    }

    try {
      await API.post("/polls", {
        question,
        options: filtered,
        expiresAt: new Date(expiresAt).toISOString(),
      });

      navigate("/polls");
    } catch (err) {
      console.log(err);
      alert("Failed to create poll");
    }
  };

  return (
    <div className="min-h-screen px-6 py-1 text-[#430907]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <h1 className="font-manrope text-[34px] font-bold tracking-tight text-[#430907]">
            Quick Decision Maker
          </h1>
          <p className="mt-2 text-sm text-[#7a4d45]">
            Create a poll in seconds and let people decide fast.
          </p>
        </div>


        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-white/50 bg-white/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.10)] backdrop-blur-md">
            <div className="mb-6 inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-600 shadow-sm">
              🔥 Fast polls. Clear decisions.
            </div>

            <h2 className="mb-3 font-manrope text-4xl font-extrabold tracking-tight text-[#430907]">
              Create a new poll
            </h2>

            <p className="mb-8 max-w-2xl text-[#7a4d45]">
              Ask a question, add up to four options, choose an expiry time,
              and launch your poll instantly.
            </p>

            <form onSubmit={handlecreatepoll} className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#f84816]">
                  The Question
                </label>
                <input
                  type="text"
                  placeholder="What's on your mind today?"
                  value={question}
                  onChange={(e) => setquestion(e.target.value)}
                  className="w-full rounded-2xl border border-[#f3d9d2] bg-white px-4 py-4 text-lg outline-none transition focus:border-[#f84816]"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {options.map((opt, i) => (
                  <div key={i}>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#7a4d45]">
                      Option {String.fromCharCode(65 + i)}
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-[#f3d9d2] bg-white px-4 py-3">
                      <span className="font-bold text-[#f84816]">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        type="text"
                        placeholder={`Add option ${i + 1}`}
                        value={opt}
                        onChange={(e) => handleoptionchange(i, e.target.value)}
                        className="w-full border-none bg-transparent outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#f84816]">
                  Expiry Time
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setexpiresAt(e.target.value)}
                  className="w-full rounded-2xl border border-[#f3d9d2] bg-white px-4 py-4 outline-none transition focus:border-[#f84816]"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-2xl bg-[#f84816] px-6 py-4 font-semibold text-white shadow-md transition hover:bg-[#e92f0d]"
                >
                  Launch Poll
                </button>

                <Link
                  to="/polls"
                  className="rounded-2xl bg-[#fff3ec] px-6 py-4 text-center font-semibold text-[#430907] transition hover:bg-[#ffe7da]"
                >
                  Cancel & View Polls
                </Link>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/40 bg-[#fff8f4]/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-md">
            <h3 className="mb-6 font-manrope text-2xl font-bold text-[#430907]">
              Poll Settings
            </h3>

            <div className="space-y-6">
              <div className="rounded-2xl bg-white/80 p-4">
                <p className="font-semibold text-[#430907]">Quick Tips</p>
                <ul className="mt-3 space-y-2 text-sm text-[#7a4d45]">
                  <li>• Add at least 2 options</li>
                  <li>• Keep your question short and clear</li>
                  <li>• Choose a future expiry time</li>
                  <li>• Best polls are simple and direct</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-[#fff3ec] p-4">
                <p className="font-semibold text-[#430907]">Preview</p>
                <div className="mt-3 space-y-2 text-sm text-[#7a4d45]">
                  <p>
                    <span className="font-medium text-[#430907]">Question:</span>{" "}
                    {question || "Your question will appear here"}
                  </p>
                  <p>
                    <span className="font-medium text-[#430907]">Options:</span>{" "}
                    {options.filter((o) => o.trim() !== "").length}
                  </p>
                  <p>
                    <span className="font-medium text-[#430907]">Expires:</span>{" "}
                    {expiresAt
                      ? new Date(expiresAt).toLocaleString()
                      : "Not selected yet"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#430907] p-5 text-white">
                <p className="text-sm font-semibold">Ready to launch?</p>
                <p className="mt-2 text-sm text-white/80">
                  Once created, your poll will appear in the polls section and
                  users can start voting immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;