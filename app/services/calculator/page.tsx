"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { Paperclip, X, Repeat } from "lucide-react";
import type { AssignmentTask, SingleAssignment } from "@/app/types";
import { JSX } from "react";
import CustomDropdown from "@/app/components/ui/customDropdown";
import { showCustomToast } from "@/app/components/ui/customToast";
import { servicesData, topicOptions } from "@/data/servicesData";
import CheckoutButton from "@/app/components/checkoutButton";
import mammoth from "mammoth";

const ALLOWED_EXT = [".txt", ".doc", ".docx", ".odt", ".xml"];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const BASE_RATE_PER_WORD = 0.01;
const DEFAULT_FILE_WORDS = 500;

// --- Session utilities ---
function ensureSessionId() {
  if (typeof document === "undefined") {
    // If somehow called on server, just return null
    return null;
  }

  const cookieName = "sessionId";
  let sessionId = getSessionIdFromCookie();

  if (!sessionId) {
    sessionId = crypto.randomUUID(); // generate a new session ID
    // Set cookie for 7 days
    document.cookie = `${cookieName}=${sessionId}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }

  return sessionId;
}

function getSessionIdFromCookie(): string | null {
  if (typeof document === "undefined") return null; // safeguard for SSR
  const match = document.cookie.match(/(?:^|;\s*)sessionId=([^;]+)/);
  return match ? match[1] : null;
}

const CalculatorPage = (): JSX.Element => {
  const [projectType, setProjectType] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [urgencyType, setUrgencyType] = useState<"days" | "hours">("days");
  const [urgencyValue, setUrgencyValue] = useState<string>("");
  const [wordInput, setWordInput] = useState<string>("");

  const [stagingTasks, setStagingTasks] = useState<AssignmentTask[]>([]);
  const [assignments, setAssignments] = useState<SingleAssignment[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Ensure session cookie exists on mount (prevents "Session not found")
  useEffect(() => {
    const id = ensureSessionId(); // make sure a sessionId exists
    setSessionId(id) // get the current sessionId
  }, []);

  // --- Checkout handler ---
  const handleCheckout = async () => {
    if (assignments.length === 0) {
      showCustomToast("Error", "Add at least one assignment before checkout.");
      return;
    }

    setCheckoutLoading(true);

    try {
      const sessionId = ensureSessionId();
      if (!sessionId) throw new Error("Session not found. Please refresh the page and try again.");

      // Attach sessionId at save-time to avoid changing client types
      const payload = assignments.map((a) => ({ ...a, sessionId }));

      // 1) Save assignments
      const saveRes = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignments: payload }),
      });
      
      if (!saveRes.ok) {
        const errJson = await saveRes.json().catch(() => ({} as any));
        throw new Error(errJson.error || "Failed to save assignments");
      }

      // 2) Create checkout session (file-based pricing)
      const checkoutRes = await fetch("/api/checkout", { method: "POST" });
      if (!checkoutRes.ok) {
        const errJson = await checkoutRes.json().catch(() => ({} as any));
        throw new Error(errJson.error || "Failed to create checkout session");
      }

      const { url } = await checkoutRes.json();
      if (!url) throw new Error("No checkout URL returned");

      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      showCustomToast("Error", err?.message || "Network or server error during checkout.");
      setCheckoutLoading(false);
    }
  };

  // --- Helpers ---
  const pushError = (msg: string) => {
    setErrors((p) => [msg, ...p]);
    setTimeout(() => setErrors((p) => p.filter((m) => m !== msg)), 4200);
  };

  const extOf = (name: string) => {
    const idx = name.lastIndexOf(".");
    return idx >= 0 ? name.slice(idx).toLowerCase() : "";
  };
  const fileBase = (name: string) => {
    const idx = name.lastIndexOf(".");
    return idx >= 0 ? name.slice(0, idx) : name;
  };

  // --- File handling ---
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    handleFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files) handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    const newTasks: AssignmentTask[] = [];

    const processFile = async (file: File, index: number) => {
      const ext = extOf(file.name);
      if (!ALLOWED_EXT.includes(ext)) {
        pushError(`Unsupported file type: ${file.name}`);
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        pushError(`File too large (max 10MB): ${file.name}`);
        return;
      }

      try {
        if (ext === ".docx") {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          const wordCount = countWords(result.value);
          newTasks.push({ id: Date.now() + index, file, wordCount: wordCount.toString() });
        } else if (ext === ".txt" || ext === ".xml") {
          const text = await file.text();
          const wordCount = countWords(text);
          newTasks.push({ id: Date.now() + index, file, wordCount: wordCount.toString() });
        } else {
          // Other formats like .odt - fallback
          newTasks.push({ id: Date.now() + index, file, wordCount: DEFAULT_FILE_WORDS.toString() });
        }
      } catch {
        pushError(`Failed to parse ${file.name}, added with default word count.`);
        newTasks.push({ id: Date.now() + index, file, wordCount: DEFAULT_FILE_WORDS.toString() });
      }
    };

    Promise.all(Array.from(files).map(processFile)).then(() => {
      if (newTasks.length > 0) {
        setStagingTasks((p) => [...p, ...newTasks]);
        showCustomToast(
          `Added ${newTasks.length} file${newTasks.length > 1 ? "s" : ""}`,
          `${newTasks.map((f) => (f.file ? f.file.name : "")).join(", ")}`
        );
      }
    });
  };

  // --- Word count input handler ---
  const addWordTask = () => {
    const trimmed = wordInput.trim();
    if (!trimmed) {
      pushError("Enter a word count before adding.");
      return;
    }
    const n = Number(trimmed.replace(/,/g, ""));
    if (!Number.isFinite(n) || n <= 0) {
      pushError("Enter a valid positive number for words.");
      return;
    }
    const t: AssignmentTask = { id: Date.now(), wordCount: String(Math.round(n)) };
    setStagingTasks((p) => [...p, t]);
    setWordInput("");
    showCustomToast("Task added", `${n} words staged.`);
  };

  const removeStaged = (id: number) => setStagingTasks((p) => p.filter((t) => t.id !== id));

  // --- Finalize staged tasks into assignment ---
  const finalizeAssignment = async () => {
    if (!projectType.trim()) {
      showCustomToast("Validation Failed", "Please select a project type.");
      return;
    }
    if (!topic.trim()) {
      showCustomToast("Validation Failed", "Please select a topic.");
      return;
    }
    if (!urgencyValue.trim()) {
      showCustomToast("Validation Failed", `Please enter urgency in ${urgencyType}.`);
      return;
    }
    if (stagingTasks.length === 0) {
      showCustomToast("Validation Failed", "Add at least one task (file or word count).");
      return;
    }

    ensureSessionId(); // make sure sessionId cookie exists

    const newAssign: SingleAssignment = {
      id: Date.now(),
      projectType: projectType.trim(),
      topic: topic.trim(),
      urgencyType,
      urgencyValue: urgencyValue.trim(),
      tasks: stagingTasks,
      sessionId: getSessionIdFromCookie(), // <-- add this
    };

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignments: [newAssign] }),
      });
      const data = await res.json();

      // If your API returns an array of assignments, treat that as success
      if (!Array.isArray(data)) {
        throw new Error("Failed to save assignment.");
      }

      setAssignments((p) => [newAssign, ...p]);
      setStagingTasks([]);
      setProjectType("");
      setTopic("");
      setUrgencyValue("");
      setWordInput("");
      setPanelOpen(true);

      showCustomToast("Assignment created", `${newAssign.tasks.length} task(s) added.`);
    } catch (err) {
      console.error(err);
      showCustomToast("Error", "Failed to save assignment, try again.");
    }
  };


  const removeAssignment = async (id: number) => {
    // Remove from state immediately for instant UI update
    setAssignments((prev) => prev.filter((a) => a.id !== id));

    // Tell backend to delete it from file
    await fetch(`/api/assignments?id=${id}`, {
      method: "DELETE",
    });
  };

  const clearStaging = () => setStagingTasks([]);

  // --- Pricing helpers ---
  function urgencyMultiplier(urgencyType: "days" | "hours", urgencyValueNum: number) {
    if (urgencyType === "days") {
      if (urgencyValueNum <= 1) return 2.0;
      if (urgencyValueNum <= 2) return 1.5;
      if (urgencyValueNum <= 3) return 1.2;
      return 1.0;
    } else {
      if (urgencyValueNum <= 1) return 3.0;
      if (urgencyValueNum <= 3) return 2.0;
      if (urgencyValueNum <= 6) return 1.5;
      return 1.2;
    }
  }

  function calculateAssignmentPrice(a: SingleAssignment) {
    const wordsFromTasks = a.tasks.reduce((s, t) => {
      if (t.wordCount) return s + Number(t.wordCount);
      if (t.file) return s + DEFAULT_FILE_WORDS;
      return s;
    }, 0);

    const urgencyNum = Number(a.urgencyValue) || 1;
    const mult = urgencyMultiplier(a.urgencyType, urgencyNum);
    const raw = wordsFromTasks * BASE_RATE_PER_WORD * mult;
    return Number(raw.toFixed(2));
  }

  const totalPrice = assignments.reduce((sum, a) => sum + calculateAssignmentPrice(a), 0);

  // Aggregates for display
  const stagedCount = stagingTasks.length;
  const assignCount = assignments.length;
  const stagedWords = stagingTasks.reduce((s, t) => s + (t.wordCount ? Number(t.wordCount) : 0), 0);
  const totalAssignedWords = assignments.reduce(
    (a, asg) => a + asg.tasks.reduce((s, t) => s + (t.wordCount ? Number(t.wordCount) : 0), 0),
    0
  );

  // Dropdown options from services data
  const projectTypeOptions = servicesData ? servicesData.map((s) => s.title) : [];
  const topicOptionsCombined = topicOptions ?? [];

  return (
    <div className="m-24 mb-16 min-h-[70vh]">
      <div className="grid grid-cols-12 gap-6 text-gray-700">
        {/* LEFT: Form & Staging */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-md border border-gray-100 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Build Assignment</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Staged</span>
                <div className="bg-green-50 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                  <CountUp end={stagedCount} duration={0.6} className="text-green-600 font-medium" />
                  <span className="text-xs text-gray-500">items</span>
                </div>
              </div>
            </div>

            {/* Project & Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomDropdown
                label="Project Type"
                options={projectTypeOptions.length ? projectTypeOptions : ["Select project"]}
                selected={projectType}
                onChange={setProjectType}
              />
              <CustomDropdown
                label="Topic"
                options={topicOptionsCombined.length ? topicOptionsCombined : ["General"]}
                selected={topic}
                onChange={setTopic}
              />
            </div>

            {/* Urgency */}
            <div className="flex items-center gap-3 max-w-full">
              <div className="flex items-center w-full gap-2 px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => setUrgencyType(urgencyType === "days" ? "hours" : "days")}
                  className="flex items-center gap-1 bg-transparent outline-none text-sm text-gray-700 cursor-pointer select-none px-2 py-1 rounded transition 
                            hover:bg-gray-300 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500"
                  title="Click to toggle between Days and Hours"
                  aria-label="Toggle urgency type"
                >
                  <Repeat size={16} className="text-gray-700 hover:text-gray-900 pr-1 transition" />
                  {urgencyType === "days" ? "Days" : "Hours"}
                </button>
                <input
                  value={urgencyValue}
                  onChange={(e) => setUrgencyValue(e.target.value)}
                  placeholder="Urgency Value"
                  type="number"
                  min={0}
                  className="flex-grow text-sm bg-transparent outline-none text-gray-700"
                />
              </div>
              <span className="flex justify-end">
                <button
                  onClick={() => {
                    clearStaging();
                    showCustomToast("Cleared staging", "All staged tasks were removed.");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md transition"
                >
                  Clear staging
                </button>
              </span>
            </div>

            {/* Word count input */}
            <div className="flex items-center gap-3 max-w-full">
              <input
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                inputMode="numeric"
                placeholder="Add word count (e.g. 1200)"
                className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              />
              <button
                onClick={addWordTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
              >
                Add Task
              </button>
            </div>

            {/* File upload */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Upload files</p>
                  <p className="text-xs text-gray-400">.txt .doc .docx .odt .xml — max 10MB</p>
                </div>
                <p className="text-xs text-gray-500">Click or drop</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.doc,.docx,.odt,.xml"
                className="hidden"
                onChange={handleFilesSelected}
              />
            </div>

            {/* Staging list */}
            <div>
              <AnimatePresence>
                {stagingTasks.length > 0 ? (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    {stagingTasks.map((t) => (
                      <motion.li
                        key={t.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm"
                      >
                        {t.file ? (
                          <>
                            <Paperclip size={14} className="text-gray-500" />
                            <div className="flex-1 truncate">
                              <span className="font-medium">{fileBase(t.file.name)}</span>
                              <span className="text-xs text-gray-400 ml-2">{extOf(t.file.name)}</span>
                              <div className="text-xs text-gray-400">
                                {t.wordCount ? `${t.wordCount} words` : "Word count unknown"}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1">
                            <span className="font-medium text-gray-700">{t.wordCount} words</span>
                          </div>
                        )}
                        <button
                          onClick={() => removeStaged(t.id)}
                          className="p-1 rounded hover:bg-gray-100 transition"
                          aria-label="Remove task"
                        >
                          <X size={16} />
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-sm text-gray-400"
                  >
                    No tasks staged yet — add a word count or upload files.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={finalizeAssignment}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm"
              >
                Finalize Assignment
              </button>
              <button
                onClick={() => setPanelOpen((s) => !s)}
                className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md transition"
              >
                {panelOpen ? "Hide assignments" : `Show assignments (${assignCount})`}
              </button>
              <div className="ml-auto text-xs text-gray-500 whitespace-nowrap">
                <div>
                  Total staged words: {" "}
                  <span className="font-medium text-gray-700">{stagedWords}</span>
                </div>
                <div>
                  Assigned words: <CountUp end={totalAssignedWords} duration={0.8} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Assignments */}
        <div className="col-span-12 lg:col-span-5">
          <AnimatePresence>
            {panelOpen && (
              <motion.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
                className="sticky top-24 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 max-h-[70vh] overflow-y-auto"
              >
                <h3 className="text-lg font-semibold mb-3">Assignments</h3>
                {assignments.length === 0 ? (
                  <p className="text-sm text-gray-400">No assignments yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {assignments.map((a) => {
                      const price = calculateAssignmentPrice(a);
                      return (
                        <li
                          key={a.id}
                          className="border border-gray-200 shadow-sm rounded-lg p-3 bg-gray-50 relative"
                        >
                          <button
                            onClick={() => removeAssignment(a.id)}
                            className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200 transition"
                            aria-label="Remove assignment"
                          >
                            <X size={18} />
                          </button>
                          <div className="font-semibold">{a.projectType}</div>
                          <div className="text-sm text-gray-600 mb-1">{a.topic}</div>
                          <div className="text-xs text-gray-500 mb-1">
                            Urgency: {a.urgencyValue} {a.urgencyType}
                          </div>
                          <div className="text-sm font-medium">Tasks:</div>
                          <ul className="ml-4 list-disc text-gray-700 text-sm mb-2 max-h-36 overflow-y-auto">
                            {a.tasks.map((t) => (
                              <li key={t.id}>
                                {t.file ? (
                                  <>
                                    {t.file.name} — {t.wordCount || DEFAULT_FILE_WORDS} words
                                  </>
                                ) : (
                                  <>{t.wordCount} words</>
                                )}
                              </li>
                            ))}
                          </ul>
                          <div className="text-right font-semibold text-green-500">
                            Price: ${price.toFixed(2)}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="flex justify-center pt-2">
                  <CheckoutButton />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;

// Helper: count words in a string
function countWords(text: string): number {
  if (!text) return 0;
  const matches = text.match(/\b\w+\b/g);
  return matches ? matches.length : 0;
}
