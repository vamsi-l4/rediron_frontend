import React, { useState } from "react";
import "./FilterSidebar.css";

const DEFAULTS = {
  minPrice: "",
  maxPrice: "",
  discount: "",
  minRating: "",
  goals: []
};

const GOALS = [
  { name: "Muscle Recovery", value: "muscle-recovery" },
  { name: "Performance", value: "performance" },
  { name: "Lean Muscle Mass", value: "lean-muscle-mass" },
  { name: "Body Building", value: "body-building" }
];

const DISCOUNTS = [
  { label: "10% And Above", value: 10 },
  { label: "20% And Above", value: 20 },
  { label: "30% And Above", value: 30 },
  { label: "40% And Above", value: 40 }
];

const RATINGS = [
  { label: "4 & above", value: 4 },
  { label: "3 & above", value: 3 },
  { label: "2 & above", value: 2 },
  { label: "1 & above", value: 1 }
];

const FilterSidebar = ({ filters, onChange }) => {
  const [local, setLocal] = useState(filters);

  // Helper for onChange
  const update = newVals => {
    const updated = { ...local, ...newVals };
    setLocal(updated);
    onChange(updated);
  };

  return (
    <aside className="filtersidebar-main">
      <div className="filtersidebar-head">
        <h3>Filters</h3>
        <button
          className="filtersidebar-reset"
          onClick={() => {
            setLocal(DEFAULTS);
            onChange(DEFAULTS);
          }}
        >
          Reset
        </button>
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Price</div>
        <div className="filtersidebar-row">
          <input
            type="number"
            placeholder="Min"
            value={local.minPrice}
            onChange={e => update({ minPrice: e.target.value })}
          />
          <span className="filtersidebar-to">to</span>
          <input
            type="number"
            placeholder="Max"
            value={local.maxPrice}
            onChange={e => update({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Discount</div>
        {DISCOUNTS.map(disc => (
          <div key={disc.value}>
            <input
              type="radio"
              id={`discount${disc.value}`}
              name="discount"
              value={disc.value}
              checked={String(local.discount) === String(disc.value)}
              onChange={() => update({ discount: disc.value })}
            />
            <label htmlFor={`discount${disc.value}`}>{disc.label}</label>
          </div>
        ))}
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Ratings</div>
        {RATINGS.map(rat => (
          <div key={rat.value}>
            <input
              type="radio"
              id={`rating${rat.value}`}
              name="rating"
              value={rat.value}
              checked={String(local.minRating) === String(rat.value)}
              onChange={() => update({ minRating: rat.value })}
            />
            <label htmlFor={`rating${rat.value}`}>{rat.label}</label>
          </div>
        ))}
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Goals</div>
        {GOALS.map(goal => (
          <div key={goal.value}>
            <input
              type="checkbox"
              id={goal.value}
              name="goals"
              checked={local.goals.includes(goal.value)}
              onChange={e => {
                const selected = e.target.checked
                  ? [...local.goals, goal.value]
                  : local.goals.filter(g => g !== goal.value);
                update({ goals: selected });
              }}
            />
            <label htmlFor={goal.value}>{goal.name}</label>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
