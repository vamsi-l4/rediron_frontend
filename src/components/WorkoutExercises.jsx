// src/components/WorkoutExercises.jsx
import React, { useEffect, useState } from "react";
import API from "./Api";
import ExerciseCard from "./ExerciseCard";
import Pagination from "./Pagination";
import "./WorkoutExercises.css";

const PAGE_SIZE = 16;
const SKILLS = ["all", "beginner", "intermediate", "advanced"];
const TYPES = ["all", "strength", "cardio", "mobility", "hiit", "other"];

export default function WorkoutExercises() {
  const [exercises, setExercises] = useState([]);
  const [skill, setSkill] = useState("all");
  const [type, setType] = useState("all");
  const [bodyPart, setBodyPart] = useState("all");
  const [equipment, setEquipment] = useState("all");
  const [muscles, setMuscles] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const extractResults = (res) => {
    if (!res || !res.data) return [];
    if (Array.isArray(res.data)) return res.data;
    if (res.data.results && Array.isArray(res.data.results)) return res.data.results;
    return [];
  };

  const fetchMuscles = async () => {
    try {
      const res = await API.get("/api/muscle-groups/?ordering=name");
      setMuscles(extractResults(res) || []);
    } catch {
      setMuscles([]);
    }
  };

  const fetchEquipment = async () => {
    try {
      const res = await API.get("/api/equipment/?ordering=name");
      setEquipmentList(extractResults(res) || []);
    } catch {
      setEquipmentList([]);
    }
  };

  const fetchExercises = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, page_size: PAGE_SIZE };
      if (skill !== "all") params.skill_level = skill;
      if (type !== "all") params.exercise_type = type;
      if (bodyPart !== "all") params["primary_muscles__slug"] = bodyPart;
      if (equipment !== "all") {
        if (/^\d+$/.test(String(equipment))) params.equipment = equipment;
        else params["equipment__slug"] = equipment;
      }
      if (query.trim()) params.search = query.trim();

      const res = await API.get("/api/exercises/", { params });

      if (Array.isArray(res.data)) {
        setExercises(res.data);
        setCount(res.data.length);
        setPageCount(1);
      } else {
        const results = Array.isArray(res.data.results) ? res.data.results : [];
        const total = Number(res.data.count || results.length || 0);
        setExercises(results);
        setCount(total);
        setPageCount(Math.max(1, Math.ceil(total / PAGE_SIZE)));
      }
    } catch {
      setExercises([]);
      setCount(0);
      setPageCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMuscles();
    fetchEquipment();
    fetchExercises(1);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setPage(1);
    fetchExercises(1);
    // eslint-disable-next-line
  }, [skill, type, bodyPart, equipment]);

  return (
    <>

      <div className="ex-container">
        <header className="ex-hero">
          <h1>Exercise Videos</h1>
          <p>Browse exercises — filter by skill level, type, body part and equipment.</p>
        </header>

        <div className="ex-filters">
          <div className="ex-row">
            <label>Skill Level</label>
            <select value={skill} onChange={(e) => setSkill(e.target.value)}>
              {SKILLS.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="ex-row">
            <label>Exercise Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="ex-row">
            <label>Body Part</label>
            <select value={bodyPart} onChange={(e) => setBodyPart(e.target.value)} onFocus={fetchMuscles}>
              <option value="all">All</option>
              {muscles.map((m) => (
                <option key={m.id ?? m.slug} value={m.slug ?? m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="ex-row">
            <label>Equipment</label>
            <select value={equipment} onChange={(e) => setEquipment(e.target.value)} onFocus={fetchEquipment}>
              <option value="all">All</option>
              {equipmentList.map((eq) => (
                <option key={eq.id ?? eq.slug} value={eq.slug ?? eq.id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>

          <div className="ex-search">
            <input
              placeholder="Search exercises..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchExercises(1)}
            />
            <button onClick={() => fetchExercises(1)}>Search</button>
          </div>
        </div>

        <div className="ex-stats">
          Showing {exercises.length} of {count} exercises
        </div>

        <div className="ex-grid">
          {loading ? (
            <p className="loading">Loading exercises…</p>
          ) : exercises.length ? (
            exercises.map((ex) => <ExerciseCard key={ex.id ?? ex.slug} exercise={ex} />)
          ) : (
            <p className="no-results">No exercises found.</p>
          )}
        </div>

        <Pagination
          page={page}
          pageCount={pageCount}
          onPage={(p) => {
            setPage(p);
            fetchExercises(p);
          }}
        />
      </div>
     
    </>
  );
}
