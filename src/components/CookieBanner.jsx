import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiSettings, FiX } from "react-icons/fi";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setShowBanner(true);
  }, []);

  const acceptAllCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("analyticsCookies", "true");
    window.location.reload();
  };

  const savePreferences = () => {
    localStorage.setItem("cookieConsent", "custom");
    localStorage.setItem("analyticsCookies", analyticsEnabled);
    window.location.reload();
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-5 left-5 z-[9999] w-[92%] max-w-[430px]"
          >
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl p-5">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0"
                >
                  🍪
                </motion.div>

                <div className="flex-1">
                  <h2 className="text-sm font-black text-white">
                    We use cookies
                  </h2>

                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                    We use cookies to keep you logged in, improve your
                    experience, and understand platform usage.
                  </p>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => setShowManage(true)}
                      className="px-4 py-2 rounded-xl bg-white-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold flex items-center gap-2"
                    >
                      <FiSettings size={13} />
                      Manage
                    </button>

                    <button
                      onClick={acceptAllCookies}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black text-xs font-black flex items-center gap-2"
                    >
                      <FiCheck size={13} />
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showManage && (
          <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-black text-white">
                    Cookie Settings
                  </h2>

                  <p className="text-xs text-zinc-500 mt-1">
                    Choose what you want to allow.
                  </p>
                </div>

                <button
                  onClick={() => setShowManage(false)}
                  className="w-9 h-9 rounded-xl hover:bg-zinc-800 flex items-center justify-center"
                >
                  <FiX />
                </button>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Essential
                      </h3>

                      <p className="text-xs text-zinc-500 mt-1">
                        Login and security.
                      </p>
                    </div>

                    <span className="text-[10px] px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      Always on
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Analytics
                      </h3>

                      <p className="text-xs text-zinc-500 mt-1">
                        Helps improve CodeShareX.
                      </p>
                    </div>

                    <button
                      onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                      className={`w-12 h-7 rounded-full transition relative ${
                        analyticsEnabled ? "bg-cyan-500" : "bg-zinc-700"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
                          analyticsEnabled ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={savePreferences}
                className="w-full mt-5 p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-black"
              >
                Save Preferences
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}