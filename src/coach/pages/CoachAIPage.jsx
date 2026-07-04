import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Bell, CalendarDays, Check, Dumbbell, Plus, Save, Search, Send, Sparkles, Target, Trophy } from "lucide-react";
import CoachShell from "../components/CoachShell";
import { CoachHeader, EmptyState, LoadingGrid, MetricCard, PlanResult, TodayStrip } from "../components/CoachWidgets";
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

function Dashboard() {
  const { data, loading, error } = useAsync(coachApi.dashboard, []);
  if (loading) return <LoadingGrid />;
  if (error) return <EmptyState title="Coach AI could not load" text={error} />;
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
  const duplicate = async () => plan && setPlan(await coachApi.duplicatePlan(plan.id));

  return (
    <>
      <CoachHeader title={title} kicker="Structured AI plan" />
      <form className="coach-card generator-form" onSubmit={submit}>
        {intent === "workout" && (
          <>
            <label>Goal<input value={form.goal} onChange={(e) => update("goal", e.target.value)} /></label>
            <label>Training Style<input value={form.training_style} onChange={(e) => update("training_style", e.target.value)} /></label>
            <label>Workout Split<input value={form.workout_split} onChange={(e) => update("workout_split", e.target.value)} /></label>
            <label>Equipment<input value={form.equipment} onChange={(e) => update("equipment", e.target.value)} /></label>
            <label>Days Per Week<input type="number" min="1" max="7" value={form.days_per_week} onChange={(e) => update("days_per_week", e.target.value)} /></label>
            <label>Workout Duration<input type="number" min="20" max="150" value={form.workout_duration} onChange={(e) => update("workout_duration", e.target.value)} /></label>
            <label>Experience<input value={form.experience} onChange={(e) => update("experience", e.target.value)} /></label>
            <label>Available Equipment<textarea value={form.available_equipment} onChange={(e) => update("available_equipment", e.target.value)} /></label>
            <label>Focus Muscles<input value={form.focus_muscles.join(", ")} onChange={(e) => update("focus_muscles", e.target.value.split(",").map((v) => v.trim()).filter(Boolean))} /></label>
            <label>Injury Considerations<textarea value={form.injury_considerations} onChange={(e) => update("injury_considerations", e.target.value)} /></label>
          </>
        )}
        {intent === "nutrition" && (
          <>
            <label>Calories<input value={form.calories} onChange={(e) => update("calories", e.target.value)} /></label>
            <label>Protein<input value={form.protein} onChange={(e) => update("protein", e.target.value)} /></label>
            <label>Meal Timing<input value={form.meal_timing} onChange={(e) => update("meal_timing", e.target.value)} /></label>
            <label>Hydration<input value={form.hydration} onChange={(e) => update("hydration", e.target.value)} /></label>
            <label>Diet<select value={form.diet_type} onChange={(e) => update("diet_type", e.target.value)}><option value="veg">Veg</option><option value="non_veg">Non Veg</option></select></label>
            <label>Budget<select value={form.budget} onChange={(e) => update("budget", e.target.value)}><option value="budget">Budget</option><option value="balanced">Balanced</option><option value="premium">Premium</option></select></label>
          </>
        )}
        {intent === "transformation" && (
          <>
            <label>Goal<input value={form.goal || "lean muscle transformation"} onChange={(e) => update("goal", e.target.value)} /></label>
            <label>Timeline Weeks<input type="number" min="4" max="52" value={form.timeline_weeks || 12} onChange={(e) => update("timeline_weeks", e.target.value)} /></label>
            <label>Constraints<textarea value={form.constraints || ""} onChange={(e) => update("constraints", e.target.value)} /></label>
          </>
        )}
        <button className="coach-primary" type="submit" disabled={loading}>{loading ? "Generating..." : "Generate & Save"}</button>
      </form>
      {error && <div className="coach-error">{error}</div>}
      <PlanResult plan={plan} onDuplicate={duplicate} />
    </>
  );
}

function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const load = useCallback(() => coachApi.conversations(search).then(setConversations), [search]);
  useEffect(() => { load(); }, [load]);
  const send = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    const text = message;
    setMessage("");
    const next = active ? await coachApi.sendMessage(active.id, text) : await coachApi.startChat(text);
    setActive(next);
    await load();
    setLoading(false);
  };
  return (
    <>
      <CoachHeader title="AI Coach Chat" kicker="Persistent memory" />
      <div className="chat-layout">
        <aside className="coach-card chat-list">
          <div className="chat-search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats" /></div>
          {conversations.map((item) => (
            <button key={item.id} className={active?.id === item.id ? "active" : ""} onClick={() => setActive(item)}>
              <strong>{item.title}</strong>
              <small>{new Date(item.last_message_at).toLocaleString()}</small>
            </button>
          ))}
        </aside>
        <section className="coach-card chat-panel">
          <div className="chat-messages">
            {(active?.messages || []).map((item) => (
              <div key={item.id} className={`chat-bubble ${item.role}`}>
                <p>{item.content || item.structured_content?.answer}</p>
              </div>
            ))}
            {!active && <EmptyState title="Start with your real context" text="Coach AI remembers your profile, progress, saved plans, orders, products, equipment, and RedIron content." />}
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
  const [entry, setEntry] = useState({ recorded_on: new Date().toISOString().slice(0, 10), weight: "", body_fat: "", waist: "", strength: "", completed_workouts: 1, streak: 1 });
  const save = async (event) => {
    event.preventDefault();
    const saved = await coachApi.saveProgress(entry);
    setData([saved, ...(data || [])]);
  };
  return (
    <>
      <CoachHeader title="Progress Tracker" kicker="Charts and history" />
      {loading ? <LoadingGrid /> : (
        <>
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
          <form className="coach-card generator-form compact" onSubmit={save}>
            {Object.keys(entry).map((key) => <label key={key}>{key.replaceAll("_", " ")}<input value={entry[key]} onChange={(e) => setEntry({ ...entry, [key]: e.target.value })} /></label>)}
            <button className="coach-primary" type="submit"><Plus size={16} /> Log Progress</button>
          </form>
        </>
      )}
    </>
  );
}

function ChallengesPage() {
  const { data, loading, setData } = useAsync(coachApi.challenges, []);
  const start = async (title) => setData([await coachApi.saveChallenge({ title, duration_days: 30, badge: `${title} Badge` }), ...(data || [])]);
  return (
    <>
      <CoachHeader title="Challenges" kicker="30 day plans, badges, certificates" />
      <div className="coach-grid">
        {["30 Day Strength Builder", "30 Day Fat Loss Sprint", "30 Day Mobility Reset"].map((title) => (
          <div className="coach-card challenge-card" key={title}>
            <Trophy size={24} />
            <h3>{title}</h3>
            <p>Completion tracking, progress percentage, badge, and leaderboard scoring.</p>
            <button onClick={() => start(title)}>Start Challenge</button>
          </div>
        ))}
      </div>
      {loading ? <LoadingGrid /> : <div className="coach-grid">{(data || []).map((item) => <div className="coach-card" key={item.id}><h3>{item.title}</h3><div className="progress-bar"><span style={{ width: `${item.progress_percentage}%` }} /></div><p>{item.progress_percentage}% complete · {item.badge}</p></div>)}</div>}
    </>
  );
}

function BodyExplorer() {
  const [muscle, setMuscle] = useState("Upper Chest");
  const [plan, setPlan] = useState(null);
  const loadMuscle = async (next) => {
    setMuscle(next);
    const response = await coachApi.generate("body_explorer", { muscle: next, title: `${next} Body Explorer` });
    setPlan(response.plan);
  };
  const muscles = ["Upper Chest", "Back", "Shoulders", "Biceps", "Triceps", "Abs", "Legs"];
  return (
    <>
      <CoachHeader title="Body Explorer" kicker="Interactive RedIron content map" />
      <div className="body-layout">
        <div className="coach-card body-map">
          {muscles.map((item, index) => <button key={item} style={{ top: `${13 + index * 11}%` }} className={item === muscle ? "active" : ""} onClick={() => loadMuscle(item)}>{item}</button>)}
          <div className="body-silhouette" />
        </div>
        <PlanResult plan={plan} />
      </div>
    </>
  );
}

function AdvisorPage({ type }) {
  const [plan, setPlan] = useState(null);
  const title = type === "supplement" ? "Supplement Advisor" : "Equipment Advisor";
  const run = async () => setPlan((await coachApi.generate(type, { title })).plan);
  return (
    <>
      <CoachHeader title={title} kicker="Catalog-native recommendations" actions={<button className="coach-primary" onClick={run}><Sparkles size={16} /> Analyze</button>} />
      {!plan ? <EmptyState title="Ready when you are" text="Recommendations are matched against existing RedIron records and saved to PostgreSQL." /> : <PlanResult plan={plan} />}
    </>
  );
}

function CalendarPage() {
  const { data, loading, setData } = useAsync(coachApi.calendar, []);
  const add = async (status) => setData([await coachApi.saveCalendarEvent({ title: `${status} workout`, event_date: new Date().toISOString().slice(0, 10), status }), ...(data || [])]);
  return (
    <>
      <CoachHeader title="Workout Calendar" kicker="Planned, completed, rest, missed" />
      <div className="calendar-actions">{["planned", "completed", "rest", "missed"].map((status) => <button key={status} onClick={() => add(status)}>{status}</button>)}</div>
      {loading ? <LoadingGrid /> : <div className="coach-grid">{(data || []).map((event) => <div className="coach-card event-card" key={event.id}><CalendarDays size={18} /><h3>{event.title}</h3><p>{event.event_date} · {event.status}</p></div>)}</div>}
    </>
  );
}

function ReportsPage() {
  const { data, loading, setData } = useAsync(coachApi.reports, []);
  const generate = async () => setData([await coachApi.generateReport(), ...(data || [])]);
  return (
    <>
      <CoachHeader title="Weekly Reports" kicker="Consistency, strength, recommendations" actions={<button className="coach-primary" onClick={generate}><Check size={16} /> Generate Report</button>} />
      {loading ? <LoadingGrid /> : <div className="coach-grid">{(data || []).map((report) => <div className="coach-card" key={report.id}><span className="coach-pill">{report.score}/100</span><h3>{report.week_start} - {report.week_end}</h3>{Object.entries(report.summary_json || {}).map(([key, value]) => <p key={key}><strong>{key.replaceAll("_", " ")}:</strong> {Array.isArray(value) ? value.join(", ") : String(value)}</p>)}</div>)}</div>}
    </>
  );
}

function NotificationsPage() {
  const { data, loading } = useAsync(coachApi.notifications, []);
  return (
    <>
      <CoachHeader title="Notifications" kicker="Reminders and recommendations" />
      {loading ? <LoadingGrid /> : <div className="coach-grid">{(data || []).map((item) => <div className="coach-card notification-card" key={item.id}><Bell size={20} /><h3>{item.title}</h3><p>{item.message}</p><small>{item.notification_type}</small></div>)}</div>}
    </>
  );
}

function SavedPlansPage() {
  const { data, loading } = useAsync(coachApi.plans, []);
  return (
    <>
      <CoachHeader title="Saved Plans" kicker="Every AI response is persisted" />
      {loading ? <LoadingGrid /> : <div className="coach-grid">{(data || []).map((plan) => <PlanResult key={plan.id} plan={plan} />)}</div>}
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
        <MetricCard icon={Trophy} label="Current challenge" value={data.current_challenge?.title || "None"} />
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
