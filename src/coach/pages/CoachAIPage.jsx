import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Bell, CalendarDays, Check, Copy, Dumbbell, Edit3, Eye, Menu, Pin, Plus, Save, Search, Send, Sparkles, Target, Trash2, Trophy, X } from "lucide-react";
import CoachShell from "../components/CoachShell";
import { CoachHeader, EmptyState, LoadingGrid, MarkdownLite, MetricCard, PlanResult, TodayStrip } from "../components/CoachWidgets";
import coachApi from "../lib/coachApi";
import "../styles/CoachAI.css";

const defaultWorkout = {
  goal: "muscle_gain",
  training_style: "hypertrophy",
  workout_split: "push_pull_legs",
  equipment: "gym",
  days_per_week: 5,
  workout_duration: 60,
  experience: "intermediate",
  available_equipment: "Dumbbells, cables, machines, barbell",
  focus_muscles: ["Chest"],
  injury_considerations: "",
};

const defaultNutrition = {
  calories: "",
  protein: "",
  diet_type: "non_veg",
  budget: "balanced",
  indian_meals: true,
  meal_timing: "training evening",
  hydration: "3 liters",
};

const choices = {
  goals: [
    ["weight_loss", "Lose fat"],
    ["muscle_gain", "Build muscle"],
    ["maintenance", "Maintain fitness"],
    ["endurance", "Improve endurance"],
    ["flexibility", "Mobility and flexibility"],
  ],
  styles: [["hypertrophy", "Muscle building"], ["strength", "Strength"], ["fat_loss", "Fat loss"], ["conditioning", "Conditioning"], ["mobility", "Mobility"]],
  splits: [["full_body", "Full body"], ["upper_lower", "Upper / lower"], ["push_pull_legs", "Push / pull / legs"], ["body_part", "Body part split"]],
  equipment: [["gym", "Full gym"], ["home", "Home equipment"], ["dumbbells", "Dumbbells only"], ["bodyweight", "Bodyweight"], ["mixed", "Mixed"]],
  experience: [["beginner", "Beginner"], ["intermediate", "Intermediate"], ["advanced", "Advanced"]],
  muscles: [["Chest"], ["Back"], ["Shoulders"], ["Legs"], ["Biceps"], ["Triceps"], ["Abs"], ["Cardio"]],
  hydration: [["2 liters", "Light activity"], ["2.5 liters", "Normal training"], ["3 liters", "Hard training"], ["3.5 liters", "Heavy sweat"]],
  diet: [["veg", "Vegetarian"], ["non_veg", "Non vegetarian"]],
  budget: [["budget", "Budget"], ["balanced", "Balanced"], ["premium", "Premium"]],
  gender: [["M", "Male"], ["F", "Female"], ["O", "Other"]],
};

function SelectField({ label, value, onChange, options }) {
  return (
    <label>{label}
      <select value={value || ""} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange, min, max, suffix }) {
  return (
    <label>{label}
      <div className="input-with-suffix">
        <input type="number" min={min} max={max} value={value || ""} onChange={(event) => onChange(event.target.value)} />
        {suffix && <span>{suffix}</span>}
      </div>
    </label>
  );
}

function useAsync(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    loader()
      .then((value) => active && setData(value))
      .catch(() => active && setError("Unable to load Coach AI data. Please retry."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, loading, error, setData };
}

function CoachSetupCard({ dashboard, onSaved }) {
  const profile = dashboard?.profile || {};
  const [form, setForm] = useState({
    weight: profile.weight_kg || "",
    height: profile.height_cm || "",
    fitness_goal: profile.goal || "muscle_gain",
    experience_level: profile.experience || "beginner",
    gender: profile.gender || "M",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await coachApi.profileSetup(form);
      onSaved(await coachApi.dashboard());
    } catch {
      setError("Could not save Coach AI setup. Please check the values.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="coach-card setup-card">
      <span className="coach-pill">First setup</span>
      <h2>Set up your Coach AI profile</h2>
      <p>Coach AI needs these basics once so workouts, calories, protein, progress, and plans are not guessed.</p>
      {error && <div className="coach-error">{error}</div>}
      <form className="generator-form setup-form" onSubmit={save}>
        <NumberField label="Weight" suffix="kg" value={form.weight} min="25" max="250" onChange={(value) => set("weight", value)} />
        <NumberField label="Height" suffix="cm" value={form.height} min="100" max="230" onChange={(value) => set("height", value)} />
        <SelectField label="Main goal" value={form.fitness_goal} onChange={(value) => set("fitness_goal", value)} options={choices.goals} />
        <SelectField label="Experience" value={form.experience_level} onChange={(value) => set("experience_level", value)} options={choices.experience} />
        <SelectField label="Gender" value={form.gender} onChange={(value) => set("gender", value)} options={choices.gender} />
        <button className="coach-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save and open dashboard"}</button>
      </form>
    </div>
  );
}

function Dashboard() {
  const { data, loading, error, setData } = useAsync(coachApi.dashboard, []);
  if (loading) return <LoadingGrid />;
  if (error) return <EmptyState title="Coach AI could not load" text={error} />;
  if (data?.needs_setup) {
    return (
      <>
        <CoachHeader title="RedIron Coach AI" kicker="Personal setup" />
        <CoachSetupCard dashboard={data} onSaved={setData} />
      </>
    );
  }
  const progress = data?.progress_summary || {};
  return (
    <>
      <CoachHeader title="RedIron Coach AI" kicker="Dashboard" actions={<Link className="coach-primary" to="/coach-ai/workout-generator"><Sparkles size={17} /> Generate</Link>} />
      <TodayStrip dashboard={data} />
      <section className="coach-grid dashboard-grid">
        <div className="coach-card hero-card">
          <span className="coach-pill">Today</span>
          <h2>{data.today?.workout}</h2>
          <p>Your plan, nutrition targets, saved RedIron content, and recommendations stay synchronized with your profile.</p>
          <div className="hero-actions">
            <Link to="/coach-ai/chat">Ask Coach</Link>
            <Link to="/coach-ai/calendar">Calendar</Link>
          </div>
        </div>
        <MetricCard icon={Trophy} label="Challenge" value={data.current_challenge?.title || "Start one"} detail={`${data.current_challenge?.progress_percentage || 0}% complete`} />
        <MetricCard icon={Target} label="Coach streak" value={progress.streak || 0} detail="days" />
        <MetricCard icon={Dumbbell} label="Completed" value={progress.completed_workouts || 0} detail="workouts logged" />
        <div className="coach-card chart-card">
          <h3>Body Metrics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.body_metrics || []}>
              <XAxis dataKey="recorded_on" hide />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "#141414", border: "1px solid #3a1010" }} />
              <Line type="monotone" dataKey="weight" stroke="#ff3b3b" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="strength" stroke="#f8f8f8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="coach-card">
          <h3>Quick AI Shortcuts</h3>
          <div className="shortcut-grid">
            <Link to="/coach-ai/workout-generator">Workout Generator</Link>
            <Link to="/coach-ai/nutrition-planner">Nutrition Planner</Link>
            <Link to="/coach-ai/transformation-planner">Roadmap</Link>
            <Link to="/coach-ai/body-explorer">Body Explorer</Link>
          </div>
        </div>
        <div className="coach-card">
          <h3>Latest Recommendations</h3>
          {(data.latest_recommendations || []).slice(0, 5).map((item) => (
            <Link key={`${item.title}-${item.url}`} to={item.url} className="recommendation-item">
              <span>{item.title}</span>
              <small>{item.category}</small>
            </Link>
          ))}
        </div>
        <div className="coach-card">
          <h3>Notifications</h3>
          {(data.notifications || []).length ? data.notifications.map((item) => (
            <div key={item.id} className="notification-row"><Bell size={16} /><span>{item.title}</span></div>
          )) : <p className="muted">No unread Coach AI notifications.</p>}
        </div>
      </section>
    </>
  );
}

function GeneratorPage({ type }) {
  const [form, setForm] = useState(type === "nutrition" ? defaultNutrition : defaultWorkout);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const intent = type === "nutrition" ? "nutrition" : type === "transformation" ? "transformation" : "workout";
  const title = type === "nutrition" ? "AI Nutrition Planner" : type === "transformation" ? "Transformation Planner" : "AI Workout Generator";

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await coachApi.generate(intent, { ...form, title });
      setPlan(response.plan);
    } catch {
      setError("Coach AI could not generate this plan. Please adjust inputs and try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <CoachHeader title={title} kicker="Guided AI plan" />
      <form className="coach-card generator-form" onSubmit={submit}>
        {intent === "workout" && (
          <>
            <SelectField label="Goal" value={form.goal} onChange={(value) => update("goal", value)} options={choices.goals} />
            <SelectField label="Training style" value={form.training_style} onChange={(value) => update("training_style", value)} options={choices.styles} />
            <SelectField label="Workout split" value={form.workout_split} onChange={(value) => update("workout_split", value)} options={choices.splits} />
            <SelectField label="Equipment access" value={form.equipment} onChange={(value) => update("equipment", value)} options={choices.equipment} />
            <NumberField label="Days per week" value={form.days_per_week} min="1" max="7" onChange={(value) => update("days_per_week", value)} />
            <NumberField label="Workout duration" suffix="min" value={form.workout_duration} min="20" max="150" onChange={(value) => update("workout_duration", value)} />
            <SelectField label="Experience" value={form.experience} onChange={(value) => update("experience", value)} options={choices.experience} />
            <SelectField label="Focus muscle" value={form.focus_muscles[0]} onChange={(value) => update("focus_muscles", [value])} options={choices.muscles.map(([value]) => [value, value])} />
            <label>Injury Considerations<textarea value={form.injury_considerations} onChange={(e) => update("injury_considerations", e.target.value)} /></label>
            <label>Constraints or preferences<textarea placeholder="For example: no jumping, 45 minutes max, avoid shoulder loading" value={form.constraints || ""} onChange={(e) => update("constraints", e.target.value)} /></label>
          </>
        )}
        {intent === "nutrition" && (
          <>
            <NumberField label="Calories target" value={form.calories} min="1200" max="6000" onChange={(value) => update("calories", value)} />
            <NumberField label="Protein target" suffix="g" value={form.protein} min="40" max="350" onChange={(value) => update("protein", value)} />
            <SelectField label="Meal timing" value={form.meal_timing} onChange={(value) => update("meal_timing", value)} options={[["training morning", "Training morning"], ["training evening", "Training evening"], ["office day", "Office day"], ["late night", "Late night"]]} />
            <SelectField label="Hydration" value={form.hydration} onChange={(value) => update("hydration", value)} options={choices.hydration} />
            <SelectField label="Diet" value={form.diet_type} onChange={(value) => update("diet_type", value)} options={choices.diet} />
            <SelectField label="Budget" value={form.budget} onChange={(value) => update("budget", value)} options={choices.budget} />
            <label>Constraints or preferences<textarea placeholder="Allergies, foods to avoid, schedule, cooking limits" value={form.constraints || ""} onChange={(e) => update("constraints", e.target.value)} /></label>
          </>
        )}
        {intent === "transformation" && (
          <>
            <SelectField label="Transformation goal" value={form.goal || "muscle_gain"} onChange={(value) => update("goal", value)} options={choices.goals} />
            <SelectField label="Timeline" value={String(form.timeline_weeks || 12)} onChange={(value) => update("timeline_weeks", value)} options={[["8", "8 weeks"], ["12", "12 weeks"], ["16", "16 weeks"], ["24", "24 weeks"]]} />
            <label>Constraints<textarea placeholder="Injuries, time, travel, budget, foods or exercises to avoid" value={form.constraints || ""} onChange={(e) => update("constraints", e.target.value)} /></label>
          </>
        )}
        <button className="coach-primary" type="submit" disabled={loading}>{loading ? "Generating..." : "Generate & Save"}</button>
      </form>
      {error && <div className="coach-error">{error}</div>}
      <PlanResult plan={plan} />
    </>
  );
}

function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [message, setMessage] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatListOpen, setChatListOpen] = useState(false);
  const skipAutoSelectRef = useRef(false);
  const startNewChat = () => {
    skipAutoSelectRef.current = true;
    setActive(null);
    setDraftTitle("");
    setMessage("");
    setError("");
    setChatListOpen(false);
  };
  const load = useCallback(() => coachApi.conversations(search).then((items) => {
    setConversations(items);
    if (!active && items.length && !skipAutoSelectRef.current) {
      setActive(items[0]);
      setDraftTitle(items[0].title);
    }
  }), [search, active]);
  useEffect(() => { load().catch(() => setError("Could not load conversations.")); }, [load]);
  useEffect(() => setDraftTitle(active?.title || ""), [active]);
  const send = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    const text = message;
    setMessage("");
    try {
      const next = active ? await coachApi.sendMessage(active.id, text) : await coachApi.startChat(text);
      skipAutoSelectRef.current = false;
      setActive(next);
      setDraftTitle(next.title);
      await load();
    } catch {
      setMessage(text);
      setError("Coach AI could not reply. Your message was restored so you can retry.");
    } finally {
      setLoading(false);
    }
  };
  const rename = async () => {
    if (!active || !draftTitle.trim()) return;
    try {
      const updated = await coachApi.updateConversation(active.id, { title: draftTitle.trim() });
      setActive(updated);
      await load();
    } catch {
      setError("Could not rename this chat.");
    }
  };
  const pinChat = async () => {
    if (!active) return;
    try {
      const updated = await coachApi.pinConversation(active.id);
      setActive(updated);
      await load();
    } catch {
      setError("Could not pin this chat.");
    }
  };
  const deleteChat = async () => {
    if (!active || !window.confirm("Delete this Coach AI conversation?")) return;
    try {
      await coachApi.deleteConversation(active.id);
      setActive(null);
      await coachApi.conversations(search).then(setConversations);
    } catch {
      setError("Could not delete this chat.");
    }
  };
  const copyMessage = (item) => navigator.clipboard?.writeText(item.content || item.structured_content?.answer || "");
  const editMessage = (item) => setMessage(item.content || item.structured_content?.answer || "");
  const suggestions = [
    "Build a 45 minute upper chest workout using RedIron exercises",
    "Review my current goal and suggest nutrition changes",
    "Create a recovery plan for missed workouts this week",
  ];
  const selectConversation = (item) => {
    skipAutoSelectRef.current = false;
    setActive(item);
    setDraftTitle(item.title);
    setChatListOpen(false);
  };
  return (
    <>
      <CoachHeader
        title="AI Coach Chat"
        kicker="Persistent memory"
        actions={<button type="button" className="chat-history-toggle" onClick={() => setChatListOpen(true)}><Menu size={16} /> Chats</button>}
      />
      <div className="chat-layout">
        {chatListOpen && <button type="button" className="chat-list-backdrop" aria-label="Close chat history" onClick={() => setChatListOpen(false)} />}
        <aside className={`coach-card chat-list${chatListOpen ? " open" : ""}`}>
          <div className="chat-list-top">
            <button type="button" className="new-chat-btn" onClick={startNewChat}><Plus size={16} /> New chat</button>
            <button type="button" className="chat-list-close" onClick={() => setChatListOpen(false)} aria-label="Close chat history"><X size={17} /></button>
          </div>
          <div className="chat-search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats" /></div>
          {conversations.map((item) => (
            <button key={item.id} className={active?.id === item.id ? "active" : ""} onClick={() => selectConversation(item)}>
              <strong>{item.title}</strong>
              <small>{new Date(item.last_message_at).toLocaleString()}</small>
            </button>
          ))}
        </aside>
        <section className="coach-card chat-panel">
          <div className="chat-toolbar">
            <input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="Conversation title" />
            <button type="button" onClick={rename} title="Rename chat" disabled={!active}><Edit3 size={16} /></button>
            <button type="button" onClick={pinChat} title="Pin chat" disabled={!active}><Pin size={16} /></button>
            <button type="button" onClick={deleteChat} title="Delete chat" disabled={!active}><Trash2 size={16} /></button>
          </div>
          {error && <div className="coach-error">{error}</div>}
          <div className="chat-messages">
            {(active?.messages || []).map((item) => (
              <div key={item.id} className={`chat-bubble ${item.role}`}>
                <MarkdownLite text={item.content || item.structured_content?.answer} />
                <div className="chat-bubble-actions">
                  <button
                    type="button"
                    onClick={(event) => {
                      const button = event.currentTarget;
                      copyMessage(item);
                      if (button?.dataset) button.dataset.copied = "true";
                      setTimeout(() => {
                        if (button?.dataset) button.dataset.copied = "false";
                      }, 1400);
                    }}
                    title="Copy"
                  >
                    <Copy size={14} />
                  </button>
                  {item.role === "user" && <button type="button" onClick={() => editMessage(item)} title="Edit prompt"><Edit3 size={14} /></button>}
                </div>
              </div>
            ))}
            {!active && (
              <div>
                <EmptyState title="Start with your real context" text="Coach AI remembers your profile, progress, saved plans, orders, products, equipment, and RedIron content." />
                <div className="suggestion-grid">
                  {suggestions.map((item) => <button type="button" key={item} onClick={() => setMessage(item)}>{item}</button>)}
                </div>
              </div>
            )}
            {loading && <div className="typing"><span /><span /><span /></div>}
          </div>
          <form className="chat-input" onSubmit={send}>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask Coach AI anything..." />
            <button type="submit" aria-label="Send"><Send size={18} /></button>
          </form>
        </section>
      </div>
    </>
  );
}

function ProgressPage() {
  const { data, loading, setData } = useAsync(coachApi.progress, []);
  const [entry, setEntry] = useState({ recorded_on: new Date().toISOString().slice(0, 10), weight: "", body_fat: "", waist: "", strength: "", completed_workouts: 0, streak: 0 });
  const [error, setError] = useState("");
  const fields = [
    ["recorded_on", "Date"],
    ["weight", "Weight (kg)"],
    ["body_fat", "Body fat (%)"],
    ["waist", "Waist (cm)"],
    ["strength", "Strength score"],
    ["completed_workouts", "Workouts completed"],
    ["streak", "Current streak"],
  ];
  const save = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const saved = await coachApi.saveProgress(entry);
      setData([saved, ...(data || [])]);
    } catch {
      setError("Could not save progress. Check the values and try again.");
    }
  };
  return (
    <>
      <CoachHeader title="Progress Tracker" kicker="Charts and history" />
      {error && <div className="coach-error">{error}</div>}
      {loading ? <LoadingGrid /> : (
        <>
          {(data || []).length ? (
            <div className="coach-card chart-card">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={[...(data || [])].reverse()}>
                  <XAxis dataKey="recorded_on" />
                  <YAxis />
                  <Tooltip contentStyle={{ background: "#141414", border: "1px solid #3a1010" }} />
                  <Line dataKey="weight" stroke="#ff3b3b" strokeWidth={3} />
                  <Line dataKey="body_fat" stroke="#fff" />
                  <Line dataKey="strength" stroke="#9ca3af" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="coach-card progress-empty-card">
              <EmptyState title="No progress logged yet" text="Add your first body metric or workout log to unlock trends here." />
            </div>
          )}
          <form className="coach-card generator-form compact" onSubmit={save}>
            {fields.map(([key, label]) => <label key={key}>{label}<input type={key === "recorded_on" ? "date" : "number"} value={entry[key]} onChange={(e) => setEntry({ ...entry, [key]: e.target.value })} /></label>)}
            <button className="coach-primary" type="submit"><Plus size={16} /> Log Progress</button>
          </form>
        </>
      )}
    </>
  );
}

function ChallengesPage() {
  const { data, loading, setData } = useAsync(coachApi.challenges, []);
  const [error, setError] = useState("");
  const start = async (title) => {
    setError("");
    try {
      setData([await coachApi.saveChallenge({ title, duration_days: 30, badge: `${title} Badge` }), ...(data || [])]);
    } catch {
      setError("Could not start this challenge.");
    }
  };
  const remove = async (id) => {
    try {
      await coachApi.deleteChallenge(id);
      setData((data || []).filter((item) => item.id !== id));
    } catch {
      setError("Could not delete this challenge.");
    }
  };
  const challengeTemplates = [
    ["30 Day Strength Builder", "Build a repeatable lifting habit with clear daily completion tracking."],
    ["30 Day Fat Loss Sprint", "Stack walking, training, nutrition, and water consistency into one score."],
    ["30 Day Mobility Reset", "Improve joints, posture, and recovery with a low-stress daily plan."],
  ];
  return (
    <>
      <CoachHeader title="Challenges" kicker="Choose one habit mission and track it daily" />
      {error && <div className="coach-error">{error}</div>}
      <div className="coach-grid">
        {challengeTemplates.map(([title, text]) => (
          <div className="coach-card challenge-card" key={title}>
            <Trophy size={24} />
            <h3>{title}</h3>
            <p>{text}</p>
            <button onClick={() => start(title)}>Start Challenge</button>
          </div>
        ))}
      </div>
      {loading ? <LoadingGrid /> : <div className="coach-grid">{(data || []).map((item) => <div className="coach-card" key={item.id}><h3>{item.title}</h3><div className="progress-bar"><span style={{ width: `${item.progress_percentage}%` }} /></div><p>{item.completed_days} of {item.duration_days} days · {item.progress_percentage}% complete</p><button type="button" onClick={() => remove(item.id)}><Trash2 size={15} /> Delete</button></div>)}</div>}
    </>
  );
}

const bodyExplorerContent = {
  Chest: {
    label: "Chest",
    subtitle: "Upper, mid, and lower pressing map",
    frontImage: "/assets/BE_CHEST.png",
    detailImage: "/assets/BE_CHEST1.png",
    stats: ["Primary: pectoralis major", "Best angle: incline + flat", "Priority: control before load"],
    cues: ["Drive elbows under the wrist", "Keep shoulder blades set", "Finish each rep with chest tension"],
  },
  Back: {
    label: "Back",
    subtitle: "Width, thickness, and posture map",
    frontImage: "/assets/BE_BACK.png",
    detailImage: "/assets/BE_BACK1.png",
    stats: ["Primary: lats and mid-back", "Best angle: pulls + rows", "Priority: scapular control"],
    cues: ["Pull elbows toward the hip", "Avoid shrugging into the neck", "Pause rows for one clean count"],
  },
  Shoulders: {
    label: "Shoulders",
    subtitle: "Delts, stability, and press mechanics",
    frontImage: "/assets/BE_SHOULDERS.png",
    detailImage: "/assets/BE_SHOULDERS1.png",
    stats: ["Primary: front, side, rear delts", "Best angle: press + raise", "Priority: pain-free range"],
    cues: ["Lead raises with elbows", "Keep ribs down on presses", "Train rear delts every week"],
  },
  Biceps: {
    label: "Biceps",
    subtitle: "Curl path and arm detail map",
    frontImage: "/assets/BE_BICEPS.png",
    detailImage: "/assets/BE_BICEPS1.png",
    stats: ["Primary: biceps brachii", "Best angle: supinated curls", "Priority: full extension"],
    cues: ["Pin elbows near the ribs", "Do not swing the torso", "Squeeze hard at the top"],
  },
  Forearms: {
    label: "Forearms",
    subtitle: "Grip strength, wrist control, and arm finish",
    frontImage: "/assets/BE_FOREARMS.png",
    detailImage: "/assets/BE_FOREARMS1.png",
    stats: ["Primary: wrist flexors and extensors", "Best angle: curls + carries", "Priority: controlled wrist path"],
    cues: ["Keep the wrist stacked under load", "Use slow lower phases", "Train grip without elbow pain"],
  },
  Triceps: {
    label: "Triceps",
    subtitle: "Lockout strength and arm size map",
    frontImage: "/assets/BE_TRICEPS.png",
    detailImage: "/assets/BE_TRICEPS1.png",
    stats: ["Primary: long, lateral, medial heads", "Best angle: pushdowns + overhead", "Priority: elbow comfort"],
    cues: ["Keep wrists stacked", "Let the long head stretch overhead", "Lock out without snapping elbows"],
  },
  Abs: {
    label: "Abs",
    subtitle: "Core bracing and trunk control map",
    frontImage: "/assets/BE_ABS.png",
    detailImage: "/assets/BE_ABS1.png",
    stats: ["Primary: rectus abdominis", "Best angle: flexion + anti-extension", "Priority: bracing quality"],
    cues: ["Exhale before crunching", "Keep pelvis tucked", "Move slow enough to own the rep"],
  },
  Legs: {
    label: "Legs",
    subtitle: "Quads, hamstrings, glutes, and calves",
    frontImage: "/assets/BE_LEGS.png",
    detailImage: "/assets/BE_LEGS1.png",
    stats: ["Primary: quads and posterior chain", "Best angle: squat + hinge", "Priority: knee tracking"],
    cues: ["Push through full foot", "Control the bottom position", "Match depth to mobility"],
  },
};

function BodyExplorer() {
  const [muscle, setMuscle] = useState("Chest");
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const loadMuscle = async (next) => {
    setMuscle(next);
    setError("");
    try {
      const response = await coachApi.generate("body_explorer", { muscle: next, title: `${next} Body Explorer` });
      setPlan(response.plan);
    } catch {
      setError("Could not load this muscle map. Please retry.");
    }
  };
  const muscles = Object.keys(bodyExplorerContent);
  const selected = bodyExplorerContent[muscle] || bodyExplorerContent.Chest;
  return (
    <>
      <CoachHeader title="Body Explorer" kicker="Interactive RedIron content map" />
      {error && <div className="coach-error">{error}</div>}
      <div className="body-layout">
        <div className="coach-card body-map">
          <div className="body-map-toolbar">
            {muscles.map((item) => (
              <button key={item} className={item === muscle ? "active" : ""} onClick={() => loadMuscle(item)}>
                {bodyExplorerContent[item].label}
              </button>
            ))}
          </div>
          <div className="body-image-stage">
            <img src={selected.frontImage} alt={`${selected.label} muscle view`} />
          </div>
          <div className="body-map-caption">
            <span className="coach-pill">{selected.label}</span>
            <h2>{selected.subtitle}</h2>
          </div>
        </div>
        <div className="body-detail-stack">
          <div className="coach-card body-detail-card">
            <div className="body-detail-image">
              <img src={selected.detailImage} alt={`${selected.label} detail explorer`} />
            </div>
            <div className="body-detail-copy">
              <span className="coach-pill">Explorer details</span>
              <h2>{selected.label} Training Focus</h2>
              <div className="body-stat-grid">
                {selected.stats.map((item) => <span key={item}>{item}</span>)}
              </div>
              <div className="body-cue-list">
                {selected.cues.map((item) => <p key={item}><Check size={15} /> {item}</p>)}
              </div>
            </div>
          </div>
          <PlanResult plan={plan} compact />
        </div>
      </div>
    </>
  );
}

function AdvisorPage({ type }) {
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const title = type === "supplement" ? "Supplement Advisor" : "Equipment Advisor";
  const [form, setForm] = useState(type === "supplement"
    ? { goal: "muscle_gain", diet_type: "non_veg", budget: "balanced", issue: "protein gap" }
    : { goal: "muscle_gain", space: "home corner", budget: "balanced", training_style: "hypertrophy" });
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const run = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      setPlan((await coachApi.generate(type, { title, ...form })).plan);
    } catch {
      setError(`Could not run the ${title}. Please retry.`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <CoachHeader title={title} kicker="Catalog-native recommendations" actions={<button className="coach-primary" onClick={run} disabled={loading}><Sparkles size={16} /> {loading ? "Analyzing..." : "Analyze"}</button>} />
      {error && <div className="coach-error">{error}</div>}
      <div className="coach-card generator-form advisor-form">
        <SelectField label="Goal" value={form.goal} onChange={(value) => update("goal", value)} options={choices.goals} />
        {type === "supplement" ? (
          <>
            <SelectField label="Diet" value={form.diet_type} onChange={(value) => update("diet_type", value)} options={choices.diet} />
            <SelectField label="Budget" value={form.budget} onChange={(value) => update("budget", value)} options={choices.budget} />
            <SelectField label="Need help with" value={form.issue} onChange={(value) => update("issue", value)} options={[["protein gap", "Protein gap"], ["recovery", "Recovery"], ["strength", "Strength"], ["energy", "Workout energy"]]} />
            <label>Constraints or health notes<textarea placeholder="Allergies, caffeine sensitivity, dietary restrictions, medicines" value={form.constraints || ""} onChange={(e) => update("constraints", e.target.value)} /></label>
          </>
        ) : (
          <>
            <SelectField label="Space" value={form.space} onChange={(value) => update("space", value)} options={[["home corner", "Home corner"], ["small room", "Small room"], ["garage", "Garage"], ["commercial gym", "Commercial gym"]]} />
            <SelectField label="Budget" value={form.budget} onChange={(value) => update("budget", value)} options={choices.budget} />
            <SelectField label="Training style" value={form.training_style} onChange={(value) => update("training_style", value)} options={choices.styles} />
            <label>Constraints or preferences<textarea placeholder="Space limits, injury concerns, noise, budget, equipment to avoid" value={form.constraints || ""} onChange={(e) => update("constraints", e.target.value)} /></label>
          </>
        )}
      </div>
      {!plan ? <EmptyState title="Ready when you are" text="Recommendations are matched against existing RedIron records and saved to PostgreSQL." /> : <PlanResult plan={plan} />}
    </>
  );
}

function CalendarPage() {
  const { data, loading, setData } = useAsync(coachApi.calendar, []);
  const [error, setError] = useState("");
  const events = data || [];
  const add = async (status) => {
    setError("");
    try {
      const today = new Date().toISOString().slice(0, 10);
      const existing = events.find((event) => event.event_date === today);
      const titleMap = {
        planned: "Workout planned",
        completed: "Workout completed",
        rest: "Rest day",
        missed: "Missed workout",
      };
      const saved = existing
        ? await coachApi.updateCalendarEvent(existing.id, { status, title: titleMap[status] })
        : await coachApi.saveCalendarEvent({ title: titleMap[status], event_date: today, status });
      setData(existing ? events.map((event) => event.id === saved.id ? saved : event) : [saved, ...events]);
    } catch {
      setError("Could not save calendar event.");
    }
  };
  const removeEvent = async (id) => {
    try {
      await coachApi.deleteCalendarEvent(id);
      setData(events.filter((event) => event.id !== id));
    } catch {
      setError("Could not delete this calendar event.");
    }
  };
  const summary = ["planned", "completed", "rest", "missed"].map((status) => ({
    status,
    total: events.filter((event) => event.status === status).length,
  }));
  const week = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    return { key, label: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }), events: events.filter((event) => event.event_date === key) };
  });
  return (
    <>
      <CoachHeader title="Workout Calendar" kicker="Week view with reminders" />
      {error && <div className="coach-error">{error}</div>}
      <div className="calendar-actions">{["planned", "completed", "rest", "missed"].map((status) => <button key={status} onClick={() => add(status)}>{status}</button>)}</div>
      {loading ? <LoadingGrid /> : (
        <>
          <div className="today-strip calendar-summary">
            {summary.map((item) => <MetricCard key={item.status} icon={CalendarDays} label={item.status} value={item.total} />)}
          </div>
          <div className="calendar-board">
            {week.map((day) => (
              <section className="coach-card calendar-day" key={day.key}>
                <h3>{day.label}</h3>
                {day.events.length ? day.events.map((event) => (
                  <div className={`calendar-event ${event.status}`} key={event.id}>
                    <strong>{event.title}</strong>
                    <small>{event.status}</small>
                    <button type="button" onClick={() => removeEvent(event.id)}><Trash2 size={14} /> Delete</button>
                  </div>
                )) : <p className="muted">No workout planned</p>}
              </section>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function ReportsPage() {
  const { data, loading, setData } = useAsync(coachApi.reports, []);
  const [error, setError] = useState("");
  const generate = async () => {
    setError("");
    try {
      setData([await coachApi.generateReport(), ...(data || [])]);
    } catch {
      setError("Could not generate the weekly report.");
    }
  };
  return (
    <>
      <CoachHeader title="Weekly Reports" kicker="Consistency, strength, recommendations" actions={<button className="coach-primary" onClick={generate}><Check size={16} /> Generate Report</button>} />
      {error && <div className="coach-error">{error}</div>}
      {loading ? <LoadingGrid /> : <div className="coach-grid">{(data || []).map((report) => <div className="coach-card" key={report.id}><span className="coach-pill">{report.score}/100</span><h3>{report.week_start} - {report.week_end}</h3>{Object.entries(report.summary_json || {}).map(([key, value]) => <p key={key}><strong>{key.replaceAll("_", " ")}:</strong> {Array.isArray(value) ? value.join(", ") : String(value)}</p>)}</div>)}</div>}
    </>
  );
}

function NotificationsPage() {
  const { data, loading, setData } = useAsync(coachApi.notifications, []);
  const [error, setError] = useState("");
  const labels = {
    workout_reminder: "Workout reminder",
    meal_reminder: "Meal reminder",
    challenge_reminder: "Challenge reminder",
    report_ready: "Report ready",
    recommendation: "Recommendation",
  };
  const markRead = async (id) => {
    setError("");
    try {
      await coachApi.markNotificationRead(id);
      setData((data || []).filter((item) => item.id !== id));
    } catch {
      setError("Could not update this notification.");
    }
  };
  return (
    <>
      <CoachHeader title="Notifications" kicker="Actionable reminders" />
      {error && <div className="coach-error">{error}</div>}
      {loading ? <LoadingGrid /> : (data || []).length ? <div className="coach-grid">{(data || []).map((item) => (
        <div className="coach-card notification-card" key={item.id}>
          <Bell size={20} />
          <span className="coach-pill">{labels[item.notification_type] || "Coach alert"}</span>
          <h3>{item.title}</h3>
          <p>{item.message}</p>
          <button type="button" onClick={() => markRead(item.id)}><Check size={15} /> Mark read</button>
        </div>
      ))}</div> : <EmptyState title="You're caught up" text="Workout, meal, challenge, report, and recommendation alerts will appear here." />}
    </>
  );
}

function SavedPlansPage() {
  const { data, loading, setData } = useAsync(coachApi.plans, []);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const remove = async (id) => {
    try {
      await coachApi.deletePlan(id);
      setData((data || []).filter((plan) => plan.id !== id));
    } catch {
      setError("Could not delete this saved plan.");
    }
  };
  const summarize = (plan) => {
    const data = plan.response_json || {};
    return data.summary || data.answer || data.recommendations?.[0] || data.timeline?.[0] || "Saved Coach AI plan";
  };
  const linksFor = (plan) => {
    const data = plan.response_json || {};
    return [
      ...(data.products || []),
      ...(data.equipment || []),
      ...(data.exercises || []),
      ...(data.daily_workouts?.flatMap((day) => day.exercises || []) || []),
    ].filter((item) => item.url || item.product_url || item.exercise_url).slice(0, 3);
  };
  const copyPlan = (event, plan) => {
    const button = event.currentTarget;
    navigator.clipboard?.writeText(JSON.stringify(plan.response_json, null, 2));
    if (button?.dataset) button.dataset.copied = "true";
    setTimeout(() => {
      if (button?.dataset) button.dataset.copied = "false";
    }, 1400);
  };
  const formatDate = (value) => value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Saved recently";
  return (
    <>
      <CoachHeader title="Saved Plans" kicker="Every AI response is persisted" />
      {error && <div className="coach-error">{error}</div>}
      {loading ? <LoadingGrid /> : <div className="saved-plans-grid">{(data || []).map((plan) => (
        <article className="coach-card saved-plan-card" key={plan.id}>
          <div className="saved-plan-top">
            <span className="coach-pill">{plan.plan_type}</span>
            <button type="button" onClick={(event) => copyPlan(event, plan)}>
              <Copy size={15} />
              <span className="copy-label">Copy</span>
              <span className="copied-label">Copied</span>
            </button>
          </div>
          <small className="saved-plan-time">{formatDate(plan.created_at)}</small>
          <h2>{plan.title}</h2>
          <MarkdownLite text={summarize(plan)} />
          <div className="saved-plan-links">
            {linksFor(plan).map((item, index) => (
              <Link key={`${item.name || item.title}-${index}`} to={item.url || item.product_url || item.exercise_url || "#"}>
                <span>{item.name || item.title}</span>
              </Link>
            ))}
          </div>
          <div className="saved-plan-actions">
            <button type="button" onClick={() => setSelectedPlan(plan)}><Eye size={15} /> View</button>
            <button type="button" className="coach-danger" onClick={() => remove(plan.id)}><Trash2 size={15} /> Delete</button>
          </div>
        </article>
      ))}</div>}
      {selectedPlan && (
        <div className="coach-modal-backdrop" role="dialog" aria-modal="true" aria-label="Saved plan details" onClick={() => setSelectedPlan(null)}>
          <div className="coach-modal" onClick={(event) => event.stopPropagation()}>
            <div className="coach-modal-top">
              <div>
                <span className="coach-pill">{selectedPlan.plan_type}</span>
                <h2>{selectedPlan.title}</h2>
                <small>{formatDate(selectedPlan.created_at)}</small>
              </div>
              <button type="button" onClick={() => setSelectedPlan(null)} aria-label="Close saved plan"><X size={18} /></button>
            </div>
            <PlanResult plan={selectedPlan} />
          </div>
        </div>
      )}
    </>
  );
}

function ProfileIntegration() {
  const { data, loading } = useAsync(coachApi.dashboard, []);
  const counts = data?.plan_counts || {};
  return (
    <>
      <CoachHeader title="Profile Integration" kicker="Synced with Clerk and RedIron profile" />
      {loading ? <LoadingGrid /> : <div className="today-strip">
        <MetricCard icon={Save} label="AI plans" value={Object.values(counts).reduce((a, b) => a + b, 0)} />
        <MetricCard icon={Trophy} label="Current challenge" value={data?.current_challenge?.title || "None"} />
        <MetricCard icon={Sparkles} label="Weekly score" value={data.recent_reports?.[0]?.score || "--"} />
        <MetricCard icon={Target} label="Coach streak" value={data.progress_summary?.streak || 0} />
      </div>}
      <Link className="coach-primary" to="/profile">Open Full Profile</Link>
    </>
  );
}

export default function CoachAIPage() {
  return (
    <CoachShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="workout-generator" element={<GeneratorPage type="workout" />} />
          <Route path="nutrition-planner" element={<GeneratorPage type="nutrition" />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="transformation-planner" element={<GeneratorPage type="transformation" />} />
          <Route path="progress-tracker" element={<ProgressPage />} />
          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="body-explorer" element={<BodyExplorer />} />
          <Route path="supplement-advisor" element={<AdvisorPage type="supplement" />} />
          <Route path="equipment-advisor" element={<AdvisorPage type="equipment" />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="saved-plans" element={<SavedPlansPage />} />
          <Route path="profile" element={<ProfileIntegration />} />
        </Routes>
      </motion.div>
    </CoachShell>
  );
}
