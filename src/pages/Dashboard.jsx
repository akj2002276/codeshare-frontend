import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import socket from "../socket";

export default function Dashboard() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [batches, setBatches] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [onlineUsers, setOnlineUsers] =
    useState([]);

  // BATCH FORM
  const [batchData, setBatchData] =
    useState({
      batchName: "",
      description: "",
      accessKey: "",
    });



  // FETCH BATCHES
  const fetchBatches = async () => {

    try {

      const response = await API.get(
        "/batches",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setBatches(response.data);

    } catch (error) {

      console.log(error);

    }

  };



  // CREATE BATCH
  const createBatch = async () => {

    try {

      const response = await API.post(
        "/batches",
        batchData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setBatches([
        ...batches,
        response.data.batch,
      ]);

      setShowModal(false);

      setBatchData({
        batchName: "",
        description: "",
        accessKey: "",
      });

    } catch (error) {

      console.log(error);

    }

  };



  // LOGOUT
  const logout = () => {

    localStorage.clear();

    window.location.href = "/";

  };



  // SOCKET + FETCH
  useEffect(() => {

    fetchBatches();

    // SEND ONLINE USER
    socket.emit(
      "user-online",
      user?._id
    );

    // RECEIVE ONLINE USERS
    socket.on(
      "online-users",
      (users) => {

        setOnlineUsers(users);

      }
    );

    return () => {

      socket.off("online-users");

    };

  }, []);



  return (

    <div className="min-h-screen bg-black text-white p-10">

      {/* TOPBAR */}
      <div className="flex items-center justify-between mb-12">

        <div>

          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">

            CodeShare

          </h1>

          <p className="text-zinc-400 mt-2">

            Welcome back, {user?.name}

          </p>

          {/* ACTIVE USERS */}
          <div className="flex items-center gap-2 mt-3">

            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

            <p className="text-green-400 font-medium">

              {onlineUsers.length} Active Users

            </p>

          </div>

        </div>



        <div className="flex items-center gap-4">

          {
            user?.role ===
              "trainer" && (

              <button
                onClick={() =>
                  setShowModal(true)
                }
                className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition"
              >

                <Plus size={18} />

                Create Batch

              </button>

            )
          }



          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </div>



      {/* BATCH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {
          batches.map((batch) => (

            <motion.div

              key={batch._id}

              whileHover={{
                scale: 1.03,
                y: -5,
              }}

              whileTap={{
                scale: 0.98,
              }}

              onClick={() => {

                const key = prompt(
                  "Enter Batch Access Key"
                );

                if (
                  key ===
                  batch.accessKey
                ) {

                  navigate(
                    `/workspace/${batch._id}`
                  );

                } else {

                  alert(
                    "Wrong Access Key"
                  );

                }

              }}

              className="cursor-pointer relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 hover:border-cyan-500 transition-all"
            >

              {/* GLOW */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full" />



              <div className="relative z-10">

                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">

                  <FolderKanban
                    size={30}
                    className="text-cyan-400"
                  />

                </div>



                <h2 className="text-3xl font-bold mb-3">

                  {batch.batchName}

                </h2>



                <p className="text-zinc-400 leading-relaxed">

                  {batch.description}

                </p>



                <div className="mt-8 flex items-center justify-between">

                  <span className="text-sm text-zinc-500">

                    Open Workspace

                  </span>

                  <span className="text-cyan-400">

                    →

                  </span>

                </div>

              </div>

            </motion.div>

          ))
        }

      </div>



      {/* CREATE MODAL */}
      {
        showModal && (

          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <motion.div

              initial={{
                opacity: 0,
                scale: 0.8,
              }}

              animate={{
                opacity: 1,
                scale: 1,
              }}

              className="w-[450px] bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
            >

              <h2 className="text-3xl font-bold mb-6">

                Create Batch

              </h2>



              {/* BATCH NAME */}
              <input
                type="text"
                placeholder="Batch Name"
                value={batchData.batchName}
                onChange={(e) =>
                  setBatchData({
                    ...batchData,
                    batchName:
                      e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 mb-4 outline-none"
              />



              {/* ACCESS KEY */}
              <input
                type="password"
                placeholder="Batch Access Key"
                value={batchData.accessKey}
                onChange={(e) =>
                  setBatchData({
                    ...batchData,
                    accessKey:
                      e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 mb-4 outline-none"
              />



              {/* DESCRIPTION */}
              <textarea
                placeholder="Description"
                value={batchData.description}
                onChange={(e) =>
                  setBatchData({
                    ...batchData,
                    description:
                      e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-zinc-800 border border-zinc-700 mb-6 outline-none h-32"
              />



              <div className="flex gap-4">

                <button
                  onClick={createBatch}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl"
                >

                  Create

                </button>



                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 p-4 rounded-2xl"
                >

                  Cancel

                </button>

              </div>

            </motion.div>

          </div>

        )
      }

    </div>

  );

}