import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import API, { DEBUG } from "./Api";
import ExerciseCard from "./ExerciseCard";
import Pagination from "./Pagination";
import "./WorkoutExercises.css";

import absIcon from "../assets/abs.png";
import armsIcon from "../assets/arms.png";
import legsIcon from "../assets/legs.png";
import backIcon from "../assets/back.png";
import shouldersIcon from "../assets/shoulders.png";
import chestIcon from "../assets/chest.png";
import fullbodyIcon from "../assets/fullbody.png";
import cardioIcon from "../assets/cardio.png";
import placeholderIcon from "../assets/placeholder.png";

const PAGE_SIZE = 16;
const SKILLS = ["all", "beginner", "intermediate", "advanced"];
const CATEGORIES = [
  { label: "All", value: "all", icon: fullbodyIcon },
  { label: "Chest", value: "Chest", icon: chestIcon },
  { label: "Back", value: "Back", icon: backIcon },
  { label: "Shoulders", value: "Shoulders", icon: shouldersIcon },
  { label: "Legs", value: "Legs", icon: legsIcon },
  { label: "Biceps", value: "Biceps", icon: armsIcon },
  { label: "Triceps", value: "Triceps", icon: armsIcon },
  { label: "Forearms", value: "Forearms", icon: armsIcon },
  { label: "Abs", value: "Abs", icon: absIcon },
  { label: "Cardio", value: "Cardio", icon: cardioIcon },
];

const SUBCATEGORIES = {
  Chest: ["Upper Chest", "Middle Chest", "Lower Chest"],
  Back: ["Lats", "Mid Back", "Traps", "Erector Spinae"],
  Shoulders: ["Front Delts", "Side Delts", "Rear Delts"],
  Legs: ["Quads", "Hamstrings", "Glutes", "Calves"],
  Biceps: ["Long Head", "Short Head", "Brachialis"],
  Triceps: ["Long Head", "Lateral Head", "Medial Head"],
  Forearms: ["Brachioradialis", "Wrist Flexors", "Wrist Extensors"],
  Abs: ["Upper Abs", "Lower Abs", "Obliques", "Static Core"],
  Cardio: ["Treadmill", "Cycling", "Rowing", "HIIT", "Jump Rope", "Stair Climber"],
};

const extractResults = (res) => {
  if (!res?.data) return [];
  if (Array.isArray(res.data)) return res.data;
  return Array.isArray(res.data.results) ? res.data.results : [];
};

export default function WorkoutExercises() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [skill, setSkill] = useState("all");
  const [muscleGroup, setMuscleGroup] = useState("all");
  const [subcategory, setSubcategory] = useState("all");
  const [equipment, setEquipment] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const fetchEquipment = useCallback(async () => {
    try {
      const res = await API.get("/api/equipment/", { params: { ordering: "name" } });
      setEquipmentList(extractResults(res));
    } catch (error) {
      if (DEBUG) console.error("[ExerciseLibrary] Equipment fetch failed:", error);
      setEquipmentList([]);
    }
  }, []);

  const fetchExercises = useCallback(async (nextPage = 1) => {
    setLoading(true);
    try {
      const params = { page: nextPage, page_size: PAGE_SIZE };
      if (skill !== "all") params.skill_level = skill;
      if (muscleGroup !== "all") params.muscle_group = muscleGroup;
      if (subcategory !== "all") params.subcategory = subcategory;
      if (equipment !== "all") params.equipment = equipment;
      if (query.trim()) params.search = query.trim();

      const res = await API.get("/api/exercises/", { params });
      const results = extractResults(res);
      setExercises(results);
      setCount(Array.isArray(res.data) ? results.length : Number(res.data?.count || results.length || 0));
      setPage(nextPage);
    } catch (error) {
      if (DEBUG) console.error("[ExerciseLibrary] Exercise fetch failed:", error);
      setExercises([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [equipment, muscleGroup, query, skill, subcategory]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  useEffect(() => {
    fetchExercises(1);
  }, [fetchExercises]);

  const activeCategory = useMemo(
    () => CATEGORIES.find((item) => item.value === muscleGroup) || CATEGORIES[0],
    [muscleGroup]
  );

  return (
    <main className="exerciseLibrary-page">
      <button className="exerciseLibrary-backButton" onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={22} />
      </button>

      <section className="exerciseLibrary-header">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <p className="exerciseLibrary-kicker">RedIron Training</p>
          <h1>EXERCISE LIBRARY</h1>
          <p>
            Explore professional exercise demonstrations, proper form guides, equipment references, and muscle-focused training resources.
          </p>
        </motion.div>
      </section>

      <nav className="exerciseLibrary-circleNav" aria-label="Exercise muscle groups">
        {CATEGORIES.map((category) => (
          <motion.button
            type="button"
            key={category.value}
            className={`exerciseLibrary-circle ${muscleGroup === category.value ? "exerciseLibrary-circleActive" : ""}`}
            onClick={() => {
              setMuscleGroup(category.value);
              setSubcategory("all");
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="exerciseLibrary-circleImage">
              <img src={category.icon || placeholderIcon} alt="" loading="lazy" />
            </span>
            <span>{category.label}</span>
          </motion.button>
        ))}
      </nav>

      {muscleGroup !== "all" && (
        <div className="exerciseLibrary-subcategoryBar" aria-label={`${muscleGroup} subcategories`}>
          <button
            type="button"
            className={subcategory === "all" ? "exerciseLibrary-subcategoryActive" : ""}
            onClick={() => setSubcategory("all")}
          >
            All {muscleGroup}
          </button>
          {(SUBCATEGORIES[muscleGroup] || []).map((item) => (
            <button
              type="button"
              key={item}
              className={subcategory === item ? "exerciseLibrary-subcategoryActive" : ""}
              onClick={() => setSubcategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <section className="exerciseLibrary-filterBar" aria-label="Exercise filters">
        <div className="exerciseLibrary-filterGroup">
          <label>Skill Level</label>
          <select value={skill} onChange={(event) => setSkill(event.target.value)}>
            {SKILLS.map((item) => (
              <option key={item} value={item}>{item === "all" ? "All" : item[0].toUpperCase() + item.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="exerciseLibrary-filterGroup">
          <label>Equipment</label>
          <select value={equipment} onChange={(event) => setEquipment(event.target.value)}>
            <option value="all">All</option>
            {equipmentList.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="exerciseLibrary-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && fetchExercises(1)}
            placeholder="Search exercise, equipment, muscle group, subcategory"
          />
          <button type="button" onClick={() => fetchExercises(1)}>
            <SlidersHorizontal size={17} />
            Search
          </button>
        </div>
      </section>

      <div className="exerciseLibrary-resultMeta">
        <span>{activeCategory.label}</span>
        <span>{loading ? "Loading exercises" : `Showing ${exercises.length} of ${count} exercises`}</span>
      </div>

      <section className="exerciseLibrary-grid" aria-live="polite">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => <div key={index} className="exerciseLibrary-skeleton" />)
          : exercises.length
            ? exercises.map((exercise) => <ExerciseCard key={exercise.id ?? exercise.slug} exercise={exercise} />)
            : <div className="exerciseLibrary-empty">No exercises found.</div>}
      </section>

      <Pagination page={page} pageCount={pageCount} onPage={(nextPage) => fetchExercises(nextPage)} />
    </main>
  );
}
