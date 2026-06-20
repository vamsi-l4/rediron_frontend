import React, { useState, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaYoutube, FaMagic } from 'react-icons/fa';
import './BeginnerWorkoutPlan.css';

const workoutData = [
  {
    day: 1, week: 1,
    title: "Push Day — Chest, Shoulders & Triceps",
    focus: "push",
    tip: "Week 1: Focus on learning the movement patterns. Use light weight and nail the form first.",
    exercises: [
      {
        name: "Chest Press Machine",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Chest Press Machine",
        equipmentSlug: "chest-press-machine",
        videoLink: "https://www.youtube.com/watch?v=xUm0BiZCX_I",
        imageSrc: "/assets/exercises/bench_press.jpg",
        muscleGroup: "Chest",
        description: "Sit upright with back flat against pad. Grip handles at chest height. Press forward to full extension and squeeze chest at the end. Return slowly with control. Perfect starter exercise — the machine guides your path so you can focus on feeling the chest work."
      },
      {
        name: "Incline Chest Press Machine",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Incline Chest Press Machine",
        equipmentSlug: "incline-chest-press-machine",
        videoLink: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
        imageSrc: "/assets/exercises/incline_dumbbell_press.jpg",
        muscleGroup: "Upper Chest",
        description: "Set the seat so handles align with upper chest. Press upward at an angle targeting the upper pecs. Lower slowly until you feel a good stretch. Upper chest gives that full, rounded look to your chest development."
      },
      {
        name: "Pec Deck Machine (Chest Fly)",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Pec Deck Machine (Butterfly Machine)",
        equipmentSlug: "pec-deck-machine-butterfly-machine",
        videoLink: "https://www.youtube.com/watch?v=G_odjCsVxRk",
        imageSrc: "/assets/exercises/cable_fly.jpg",
        muscleGroup: "Chest",
        description: "Sit upright, arms on pads, elbows slightly bent. Bring arms together squeezing chest hard at the centre. Hold the peak contraction for 1 second. This isolates the chest perfectly — you should feel a deep burn."
      },
      {
        name: "Shoulder Press Machine",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Shoulder Press Machine",
        equipmentSlug: "shoulder-press-machine",
        videoLink: "https://www.youtube.com/watch?v=Wqq43dKW1TU",
        imageSrc: "/assets/exercises/overhead_press.jpg",
        muscleGroup: "Shoulders",
        description: "Adjust seat so handles are at shoulder height. Press overhead to full extension without locking out elbows. Lower slowly back to start. Trains all three deltoid heads safely on a guided path."
      },
      {
        name: "Dumbbell Lateral Raise",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=t2b8Udq9v6k",
        imageSrc: "/assets/exercises/lateral_raise.jpg",
        muscleGroup: "Side Delts",
        description: "Hold dumbbells at sides, slight bend in elbows. Raise arms out to the side until they reach shoulder height — no higher. Lead with your pinkies. Lower slowly over 3 seconds. This builds the wide, capped shoulder look."
      },
      {
        name: "Tricep Pushdown (Cable Rope)",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Tricep Pushdown Machine (Cable Pushdown Station)",
        equipmentSlug: "tricep-pushdown-machine-cable-pushdown-station",
        videoLink: "https://www.youtube.com/watch?v=2-LAMcpzODU",
        imageSrc: "/assets/exercises/cable_triceps_pushdown.jpg",
        muscleGroup: "Triceps",
        description: "Attach rope to high cable. Elbows pinned at sides — do not let them flare out. Push rope down to full lockout, flare rope ends out at the bottom for full contraction. Triceps make up 2/3 of your upper arm size!"
      }
    ]
  },
  {
    day: 2, week: 1,
    title: "Pull Day — Back & Biceps",
    focus: "pull",
    tip: "Feel your back muscles working — don't just pull with your arms. Think 'elbows to hips'.",
    exercises: [
      {
        name: "Lat Pulldown",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Lat Pulldown Machine",
        equipmentSlug: "lat-pulldown-machine",
        videoLink: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
        imageSrc: "/assets/exercises/lat_pulldown.jpg",
        muscleGroup: "Lats",
        description: "Grip bar wider than shoulder-width. Sit tall, thighs locked under pads. Pull bar to upper chest leading with elbows pointing down. Squeeze lats at bottom. Return with full control — the stretch at the top is just as important as the contraction."
      },
      {
        name: "Seated Row Machine",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Seated Row Machine",
        equipmentSlug: "seated-row-machine",
        videoLink: "https://www.youtube.com/watch?v=GZbfZ033f74",
        imageSrc: "/assets/exercises/seated_row.jpg",
        muscleGroup: "Mid Back",
        description: "Sit tall with chest against pad (if available). Pull handle to lower chest squeezing shoulder blades together at the end. Hold 1 second. Return slowly, allowing full stretch of back muscles. Builds that thick, dense mid-back."
      },
      {
        name: "Rear Delt Machine (Reverse Pec Deck)",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Rear Delt Machine (Reverse Pec Deck)",
        equipmentSlug: "rear-delt-machine-reverse-pec-deck",
        videoLink: "https://www.youtube.com/watch?v=EA7u4Q_8HQ0",
        imageSrc: "/assets/exercises/reverse_fly.jpg",
        muscleGroup: "Rear Delts",
        description: "Sit facing the pad, grip handles with arms in front. Pull arms back and out to your sides squeezing rear deltoids. Return slowly. This is the most neglected muscle for beginners — it prevents shoulder injuries and improves posture."
      },
      {
        name: "Dumbbell Bent-Over Row",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=pYj-582319U",
        imageSrc: "/assets/exercises/pendlay_row.jpg",
        muscleGroup: "Back",
        description: "Hinge forward at hips, back flat and parallel to floor. Pull dumbbell toward your hip, driving elbow back past your torso. Lower all the way down for a full stretch. Unilateral training helps fix strength imbalances between sides."
      },
      {
        name: "Dumbbell Bicep Curl",
        sets: 3, reps: "10-12", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=ykJmrZ5v0Kg",
        imageSrc: "/assets/exercises/dumbbell_bicep_curl.jpg",
        muscleGroup: "Biceps",
        description: "Stand tall, dumbbells at sides with palms forward. Curl both dumbbells to shoulder height — no body swinging! Squeeze biceps hard at the top. Lower fully over 2-3 seconds. Control the negative — that's where the growth happens."
      },
      {
        name: "Hammer Curl",
        sets: 3, reps: "10-12", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=zC3nLlEvin4",
        imageSrc: "/assets/exercises/hammer_curl.jpg",
        muscleGroup: "Brachialis / Forearms",
        description: "Hold dumbbells with thumbs pointing up (neutral grip). Curl without rotating your wrist. This hits the brachialis muscle underneath the bicep — making your arms look thicker and bigger. Essential for complete arm development."
      }
    ]
  },
  {
    day: 3, week: 1,
    title: "Leg Day — Quads, Hamstrings, Glutes & Calves",
    focus: "legs",
    tip: "Never skip leg day. Legs are 70% of your muscle mass — training them releases the most growth hormone!",
    exercises: [
      {
        name: "Leg Press",
        sets: 3, reps: "12-15", rest: "75s",
        equipment: "Leg Press Machine",
        equipmentSlug: "leg-press-machine",
        videoLink: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
        imageSrc: "/assets/exercises/smith_leg_press.jpg",
        muscleGroup: "Quads / Glutes",
        description: "Feet shoulder-width on platform, toes slightly out. Lower the sled until knees reach 90 degrees — no less. Press through heels to near lockout. Do NOT lock knees fully. Great starter exercise to load the legs safely before introducing squats."
      },
      {
        name: "Leg Extension",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Leg Extension Machine",
        equipmentSlug: "leg-extension-machine",
        videoLink: "https://www.youtube.com/watch?v=YyvSfVjQeL0",
        imageSrc: "/assets/exercises/squat.jpg",
        muscleGroup: "Quads",
        description: "Sit with back flat, pad resting on shins above ankles. Extend legs to full lockout, squeeze quads hard for 1 second at the top. Lower slowly. Pure quad isolation — builds that teardrop muscle above the knee."
      },
      {
        name: "Seated Leg Curl Machine",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Seated Leg Curl Machine",
        equipmentSlug: "seated-leg-curl-machine",
        videoLink: "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
        imageSrc: "/assets/exercises/single_leg_rdl.jpg",
        muscleGroup: "Hamstrings",
        description: "Adjust machine so knee joint is in line with the pivot. Pull heels toward glutes as far as possible. Squeeze hamstrings at peak and lower with full control. Hamstrings are frequently injured — this builds them safely."
      },
      {
        name: "Hip Abduction Machine",
        sets: 3, reps: "15", rest: "45s",
        equipment: "Hip Abduction Machine",
        equipmentSlug: "hip-abduction-machine",
        videoLink: "https://www.youtube.com/watch?v=Nj1uQMpJhZc",
        imageSrc: "/assets/exercises/hip_thrust.jpg",
        muscleGroup: "Glutes / Outer Thigh",
        description: "Sit with pads on the outside of your knees. Push legs outward against resistance. Squeeze glutes at the peak. Return slowly. Builds the outer glute and hip area — often neglected but key for lower body stability."
      },
      {
        name: "Dumbbell Goblet Squat",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=MEF-gN-L_10",
        imageSrc: "/assets/exercises/goblet_squat.jpg",
        muscleGroup: "Quads / Glutes",
        description: "Hold dumbbell vertically at chest height with both hands. Feet shoulder-width, toes out slightly. Squat until thighs are parallel to floor, keeping chest tall. Drive through heels to stand. Teaches perfect squat mechanics before adding a barbell."
      },
      {
        name: "Calf Raises (Bodyweight)",
        sets: 4, reps: "15-20", rest: "30s",
        equipment: "No Equipment",
        equipmentSlug: null,
        videoLink: "https://www.youtube.com/watch?v=gwLzBJYoWlI",
        imageSrc: "/assets/exercises/calf_raise.jpg",
        muscleGroup: "Calves",
        description: "Stand on the edge of a step or flat floor. Rise onto toes as high as possible, hold 1 second, lower heel below step level for full stretch. Slow controlled reps. Calves respond best to high reps and full range of motion."
      }
    ]
  },
  {
    day: 4, week: 1,
    title: "Push Day B — Chest, Shoulders & Triceps",
    focus: "push",
    tip: "Second push session this week. You'll notice the movements feel more natural — that's neuromuscular adaptation!",
    exercises: [
      {
        name: "Dumbbell Bench Press",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=VmB1G1K7v94",
        imageSrc: "/assets/exercises/bench_press.jpg",
        muscleGroup: "Chest",
        description: "Lie flat on bench, dumbbells at chest level, elbows at 45-degree angle. Press straight up and slightly inward — dumbbells nearly touch at the top. Lower slowly with control. Better range of motion than barbell bench press for beginners."
      },
      {
        name: "Incline Dumbbell Press",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
        imageSrc: "/assets/exercises/incline_dumbbell_press.jpg",
        muscleGroup: "Upper Chest",
        description: "Set bench to 30-45 degrees. Press dumbbells from chest level upward, feel the upper chest working. Do not flare elbows excessively — keep at 60-70 degrees from torso. Full stretch at bottom is key."
      },
      {
        name: "Dumbbell Overhead Press",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0",
        imageSrc: "/assets/exercises/seated_db_press.jpg",
        muscleGroup: "Shoulders",
        description: "Sit or stand, dumbbells at shoulder height, palms facing forward. Press overhead to full lockout. Lower to ear level. More natural movement arc than barbell — safer for beginners learning the overhead pressing pattern."
      },
      {
        name: "Lateral Raise Machine",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Lateral Raise Machine",
        equipmentSlug: "lateral-raise-machine",
        videoLink: "https://www.youtube.com/watch?v=PPbMhcnPWKY",
        imageSrc: "/assets/exercises/lateral_raise.jpg",
        muscleGroup: "Side Delts",
        description: "Adjust arm pads to align with elbows. Press arms up against pads to shoulder height. Lower with control. Machine provides constant resistance unlike dumbbells — excellent for burning side delts."
      },
      {
        name: "Diamond Push-Ups",
        sets: 3, reps: "8-12", rest: "45s",
        equipment: "Yoga Mat (Exercise Mat)",
        equipmentSlug: "yoga-mat-exercise-mat",
        videoLink: "https://www.youtube.com/watch?v=J0DXGHoB_Cs",
        imageSrc: "/assets/exercises/push_up.jpg",
        muscleGroup: "Triceps / Chest",
        description: "Hands form a diamond shape directly under your chest. Lower slowly until chest nearly touches hands. Press back up. If too difficult, do from knees. Primarily works all three heads of the triceps."
      },
      {
        name: "Overhead Dumbbell Tricep Extension",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=YbX7Wd8jQ-U",
        imageSrc: "/assets/exercises/overhead_triceps_extension.jpg",
        muscleGroup: "Triceps",
        description: "Hold one dumbbell with both hands overhead. Lower behind head until elbows reach 90 degrees — keep elbows pointing forward. Extend back up. This stretches the long head of the tricep, which is the biggest of the three heads."
      }
    ]
  },
  {
    day: 5, week: 1,
    title: "Pull Day B — Back & Biceps",
    focus: "pull",
    tip: "Progressive overload: try to do 1 more rep than Tuesday on each exercise this session.",
    exercises: [
      {
        name: "Assisted Pull-Up Machine",
        sets: 3, reps: "8-10", rest: "75s",
        equipment: "Assisted Pull-up Machine",
        equipmentSlug: "assisted-pull-up-machine",
        videoLink: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
        imageSrc: "/assets/exercises/pull_up.jpg",
        muscleGroup: "Lats / Biceps",
        description: "Select an assistance weight that lets you complete 8-10 reps with good form. Pull until chin is above bar. Lower with complete control. Each week, reduce the assistance weight slightly. The goal is unassisted pull-ups by end of 4 weeks."
      },
      {
        name: "Low Row Machine (Seated Cable Row)",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Low Row Machine (Seated Cable Row)",
        equipmentSlug: "low-row-machine-seated-cable-row",
        videoLink: "https://www.youtube.com/watch?v=GZbfZ033f74",
        imageSrc: "/assets/exercises/seated_row.jpg",
        muscleGroup: "Mid Back / Lats",
        description: "Feet on platform, knees slightly bent. Sit tall, pull handle to your navel squeezing shoulder blades. Hold 1 second. Row with your elbows — not your hands. This builds a strong, thick back."
      },
      {
        name: "T-Bar Row Machine",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "T-Bar Row Machine",
        equipmentSlug: "t-bar-row-machine",
        videoLink: "https://www.youtube.com/watch?v=j3TqFprnXDQ",
        imageSrc: "/assets/exercises/seated_row_wide.jpg",
        muscleGroup: "Back Thickness",
        description: "Straddle the machine, chest against pad. Pull handles to chest keeping elbows at 45-60 degrees. Squeeze shoulder blades together at the top. One of the best exercises for building back thickness and density."
      },
      {
        name: "Roman Chair Back Extension",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Roman Chair (Hyperextension Bench)",
        equipmentSlug: "roman-chair-hyperextension-bench",
        videoLink: "https://www.youtube.com/watch?v=ph3pBHHDnFQ",
        imageSrc: "/assets/exercises/back_extension.jpg",
        muscleGroup: "Lower Back / Glutes",
        description: "Secure heels under pads, body at 45 degrees. Cross arms on chest or hold a plate. Hinge forward at waist, lower torso, then extend back to parallel — no hyperextension. Crucial for lower back health."
      },
      {
        name: "Preacher Curl Machine",
        sets: 3, reps: "10-12", rest: "45s",
        equipment: "Preacher Curl Machine",
        equipmentSlug: "preacher-curl-machine",
        videoLink: "https://www.youtube.com/watch?v=fIWP-FRFNU0",
        imageSrc: "/assets/exercises/ez_bar_curl.jpg",
        muscleGroup: "Biceps",
        description: "Upper arms resting on the pad, no cheating possible. Curl to peak contraction, squeeze hard. Lower to full extension — feel the stretch. Eliminates body swing completely, forcing the biceps to do all the work."
      },
      {
        name: "Cable Bicep Curl",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Cable Machine (Cable Crossover / Pulley Machine)",
        equipmentSlug: "cable-machine-cable-crossover-pulley-machine",
        videoLink: "https://www.youtube.com/watch?v=NFzTWp2qpiE",
        imageSrc: "/assets/exercises/dumbbell_bicep_curl.jpg",
        muscleGroup: "Biceps",
        description: "Attach straight bar or EZ bar to low cable. Curl from full extension to chin height. Keep elbows pinned at sides. Cable provides constant tension throughout — unlike dumbbells which lose tension at the top."
      }
    ]
  },
  {
    day: 6, week: 1,
    title: "Leg Day B — Quads, Hamstrings, Glutes & Core",
    focus: "legs",
    tip: "Add core work at the end of leg day. Core and legs together = strongest base you can build.",
    exercises: [
      {
        name: "Hack Squat Machine",
        sets: 3, reps: "10-12", rest: "75s",
        equipment: "Hack Squat Machine",
        equipmentSlug: "hack-squat-machine",
        videoLink: "https://www.youtube.com/watch?v=EdtPMkRxGwQ",
        imageSrc: "/assets/exercises/barbell_back_squat.jpg",
        muscleGroup: "Quads / Glutes",
        description: "Back and hips against pads. Feet shoulder-width on platform. Lower until thighs are parallel — go deep for full quad activation. Press through heels to rise. Safe and effective squat alternative while learning form."
      },
      {
        name: "Dumbbell Romanian Deadlift",
        sets: 3, reps: "10-12", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4",
        imageSrc: "/assets/exercises/single_leg_rdl.jpg",
        muscleGroup: "Hamstrings / Glutes",
        description: "Hold dumbbells in front of thighs. Push hips back, keep back flat, lower dumbbells along legs until you feel a strong hamstring stretch. Drive hips forward to return — squeeze glutes at the top. This is the foundation of hip hinge mechanics."
      },
      {
        name: "Lying Leg Curl Machine",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Lying Leg Curl Machine",
        equipmentSlug: "lying-leg-curl-machine",
        videoLink: "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
        imageSrc: "/assets/exercises/glute_ham_raise.jpg",
        muscleGroup: "Hamstrings",
        description: "Lie face down, pad on lower legs above ankles. Curl heels toward glutes as far as possible. Pause and squeeze at the top for 1 second. Lower with control. Hamstrings are 50% of your leg — don't neglect them."
      },
      {
        name: "Hip Thrust Machine",
        sets: 3, reps: "12-15", rest: "60s",
        equipment: "Hip Thrust Machine",
        equipmentSlug: "hip-thrust-machine",
        videoLink: "https://www.youtube.com/watch?v=xDmFkJxPzeM",
        imageSrc: "/assets/exercises/hip_thrust.jpg",
        muscleGroup: "Glutes",
        description: "Drive hips up by squeezing glutes — not lower back. Hold at the top for 2 full seconds. Lower slowly. Glute bridges and hip thrusts are scientifically proven to be the best glute exercises available."
      },
      {
        name: "Plank",
        sets: 3, reps: "30-40 sec", rest: "45s",
        equipment: "Yoga Mat (Exercise Mat)",
        equipmentSlug: "yoga-mat-exercise-mat",
        videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU",
        imageSrc: "/assets/exercises/plank.jpg",
        muscleGroup: "Core",
        description: "Forearms on mat, body in a perfectly straight line from head to heels. Brace your core as if you're about to take a punch. Don't let hips sag or rise. Builds the anti-rotation core stability every athlete needs."
      },
      {
        name: "Crunches",
        sets: 3, reps: "15-20", rest: "30s",
        equipment: "Yoga Mat (Exercise Mat)",
        equipmentSlug: "yoga-mat-exercise-mat",
        videoLink: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
        imageSrc: "/assets/exercises/crunch.jpg",
        muscleGroup: "Abs",
        description: "Lie on back, knees bent, feet flat. Hands behind head lightly — don't pull your neck. Curl shoulders off floor using abs only. Exhale as you crunch up. Lower with control. Short range of motion is perfectly fine — quality over quantity."
      }
    ]
  },
  {
    day: 7, week: 1,
    title: "Rest Day — Recovery & Growth",
    focus: "rest",
    tip: "Muscles grow on rest days, not workout days. Sleep 7-9 hours, eat well, and come back stronger Monday.",
    exercises: []
  },
  {
    day: 8, week: 2,
    title: "Push Day A — Chest, Shoulders & Triceps",
    focus: "push",
    tip: "Week 2: Aim to increase weight by 5-10% on each exercise compared to last Monday.",
    exercises: [
      {
        name: "Chest Press Machine",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Chest Press Machine",
        equipmentSlug: "chest-press-machine",
        videoLink: "https://www.youtube.com/watch?v=xUm0BiZCX_I",
        imageSrc: "/assets/exercises/bench_press.jpg",
        muscleGroup: "Chest",
        description: "Add one extra set this week (4 sets vs 3 last week). Increase weight slightly if you completed all reps with good form last week. This is progressive overload — the most important principle in training."
      },
      {
        name: "Incline Chest Press Machine",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Incline Chest Press Machine",
        equipmentSlug: "incline-chest-press-machine",
        videoLink: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
        imageSrc: "/assets/exercises/incline_dumbbell_press.jpg",
        muscleGroup: "Upper Chest",
        description: "Focus on really feeling the upper chest this week. Slow the lowering phase to 3 seconds. Control builds more muscle than just moving the weight."
      },
      {
        name: "Pec Deck Machine (Chest Fly)",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Pec Deck Machine (Butterfly Machine)",
        equipmentSlug: "pec-deck-machine-butterfly-machine",
        videoLink: "https://www.youtube.com/watch?v=G_odjCsVxRk",
        imageSrc: "/assets/exercises/cable_fly.jpg",
        muscleGroup: "Chest",
        description: "Hold peak contraction for 2 seconds this week. You'll feel a much deeper burn — that's muscle fibers under maximum tension."
      },
      {
        name: "Dumbbell Lateral Raise",
        sets: 4, reps: "12-15", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=t2b8Udq9v6k",
        imageSrc: "/assets/exercises/lateral_raise.jpg",
        muscleGroup: "Side Delts",
        description: "4 sets this week. Slight increase in weight. Try pausing at shoulder height for 1 second before lowering. This increases time under tension significantly."
      },
      {
        name: "Shoulder Press Machine",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Shoulder Press Machine",
        equipmentSlug: "shoulder-press-machine",
        videoLink: "https://www.youtube.com/watch?v=Wqq43dKW1TU",
        imageSrc: "/assets/exercises/overhead_press.jpg",
        muscleGroup: "Shoulders",
        description: "Add 5kg to last week's weight. If you can still complete all reps with good form, you've successfully applied progressive overload."
      },
      {
        name: "Tricep Pushdown (Cable Rope)",
        sets: 4, reps: "12-15", rest: "45s",
        equipment: "Tricep Pushdown Machine (Cable Pushdown Station)",
        equipmentSlug: "tricep-pushdown-machine-cable-pushdown-station",
        videoLink: "https://www.youtube.com/watch?v=2-LAMcpzODU",
        imageSrc: "/assets/exercises/cable_triceps_pushdown.jpg",
        muscleGroup: "Triceps",
        description: "4 sets with a slight weight increase. Flare the rope out at the bottom more aggressively this week for a harder contraction."
      }
    ]
  },
  {
    day: 9, week: 2,
    title: "Pull Day A — Back & Biceps",
    focus: "pull",
    tip: "Week 2 pull: Add weight where possible. Try to beat last Tuesday's performance by at least 1 rep per set.",
    exercises: [
      {
        name: "Lat Pulldown",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Lat Pulldown Machine",
        equipmentSlug: "lat-pulldown-machine",
        videoLink: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
        imageSrc: "/assets/exercises/lat_pulldown.jpg",
        muscleGroup: "Lats",
        description: "4 sets with slightly more weight. Focus on initiating the pull with your lats — not your biceps. Imagine pushing your elbows into your back pockets."
      },
      {
        name: "Seated Row Machine",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Seated Row Machine",
        equipmentSlug: "seated-row-machine",
        videoLink: "https://www.youtube.com/watch?v=GZbfZ033f74",
        imageSrc: "/assets/exercises/seated_row.jpg",
        muscleGroup: "Mid Back",
        description: "Hold the peak contraction for 2 seconds this week. Feel your shoulder blades squeeze together. That sensation confirms you're recruiting the right muscles."
      },
      {
        name: "Rear Delt Machine",
        sets: 3, reps: "15", rest: "45s",
        equipment: "Rear Delt Machine (Reverse Pec Deck)",
        equipmentSlug: "rear-delt-machine-reverse-pec-deck",
        videoLink: "https://www.youtube.com/watch?v=EA7u4Q_8HQ0",
        imageSrc: "/assets/exercises/reverse_fly.jpg",
        muscleGroup: "Rear Delts",
        description: "Increase reps to 15 per set. These small muscles respond well to higher volume. Better posture is the most visible result of strong rear delts."
      },
      {
        name: "T-Bar Row Machine",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "T-Bar Row Machine",
        equipmentSlug: "t-bar-row-machine",
        videoLink: "https://www.youtube.com/watch?v=j3TqFprnXDQ",
        imageSrc: "/assets/exercises/seated_row_wide.jpg",
        muscleGroup: "Back Thickness",
        description: "New exercise introduced in Week 2. Great for building overall back thickness. Pull with elbows close to body for more lat activation, wider elbows for more mid-back."
      },
      {
        name: "Dumbbell Bicep Curl",
        sets: 3, reps: "10-12", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=ykJmrZ5v0Kg",
        imageSrc: "/assets/exercises/dumbbell_bicep_curl.jpg",
        muscleGroup: "Biceps",
        description: "Supinate (rotate) your wrist as you curl up for maximum bicep peak contraction. Small detail, big difference in activation."
      },
      {
        name: "Concentration Curl",
        sets: 3, reps: "12", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=Jvj2wV0vOYU",
        imageSrc: "/assets/exercises/dumbbell_bicep_curl.jpg",
        muscleGroup: "Biceps Peak",
        description: "Sit, elbow braced against inner thigh. Curl slowly to peak, squeeze incredibly hard for 2 seconds. Lower completely. Best exercise for building the bicep peak — the muscle that shows when you flex."
      }
    ]
  },
  {
    day: 10, week: 2,
    title: "Leg Day A — Quads, Hamstrings, Glutes & Calves",
    focus: "legs",
    tip: "Squat depth is the key this week — aim to break parallel (thighs below horizontal).",
    exercises: [
      {
        name: "Hack Squat Machine",
        sets: 4, reps: "10-12", rest: "75s",
        equipment: "Hack Squat Machine",
        equipmentSlug: "hack-squat-machine",
        videoLink: "https://www.youtube.com/watch?v=EdtPMkRxGwQ",
        imageSrc: "/assets/exercises/barbell_back_squat.jpg",
        muscleGroup: "Quads / Glutes",
        description: "4 sets with added weight. Aim to squat deeper this week. The deeper the squat, the more glute and quad activation — and the more muscle you build."
      },
      {
        name: "Leg Press",
        sets: 4, reps: "12-15", rest: "75s",
        equipment: "Leg Press Machine",
        equipmentSlug: "leg-press-machine",
        videoLink: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
        imageSrc: "/assets/exercises/smith_leg_press.jpg",
        muscleGroup: "Quads / Glutes",
        description: "After hack squats, leg press finishes off the quads and glutes. Try a high-foot placement variation this week for more glute and hamstring involvement."
      },
      {
        name: "Dumbbell Romanian Deadlift",
        sets: 3, reps: "10-12", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4",
        imageSrc: "/assets/exercises/single_leg_rdl.jpg",
        muscleGroup: "Hamstrings / Glutes",
        description: "Add 2-3kg per dumbbell this week. Focus on the hamstring stretch at the bottom — you should feel it strongly. The stretch reflex is what drives hamstring muscle growth."
      },
      {
        name: "Leg Extension",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Leg Extension Machine",
        equipmentSlug: "leg-extension-machine",
        videoLink: "https://www.youtube.com/watch?v=YyvSfVjQeL0",
        imageSrc: "/assets/exercises/squat.jpg",
        muscleGroup: "Quads",
        description: "Slight weight increase. Pause at the top for 2 seconds this week — you'll feel the quads screaming. That's exactly the stimulus needed for growth."
      },
      {
        name: "Hip Thrust Machine",
        sets: 3, reps: "12-15", rest: "60s",
        equipment: "Hip Thrust Machine",
        equipmentSlug: "hip-thrust-machine",
        videoLink: "https://www.youtube.com/watch?v=xDmFkJxPzeM",
        imageSrc: "/assets/exercises/hip_thrust.jpg",
        muscleGroup: "Glutes",
        description: "Add weight this week. Hold the top position for 2-3 seconds. Squeeze glutes maximally — not lower back. If you feel this in your lower back, reduce weight and focus on the squeeze."
      },
      {
        name: "Calf Raises (Bodyweight + Dumbbell)",
        sets: 4, reps: "15-20", rest: "30s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=gwLzBJYoWlI",
        imageSrc: "/assets/exercises/calf_raise.jpg",
        muscleGroup: "Calves",
        description: "Hold a dumbbell in one hand this week for added resistance. Calves are stubborn — the only way to grow them is consistent progressive overload with full range of motion."
      }
    ]
  },
  {
    day: 11, week: 2,
    title: "Push Day B — Chest, Shoulders & Triceps",
    focus: "push",
    tip: "Week 2 Thursday: You've now done push movements 3 times. Focus on mind-muscle connection today.",
    exercises: [
      {
        name: "Dumbbell Bench Press",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=VmB1G1K7v94",
        imageSrc: "/assets/exercises/bench_press.jpg",
        muscleGroup: "Chest",
        description: "4 sets. Use heavier dumbbells than last Thursday. The key cue: squeeze the dumbbells as hard as you can throughout the movement — this activates more chest muscle fibres."
      },
      {
        name: "Incline Dumbbell Press",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
        imageSrc: "/assets/exercises/incline_dumbbell_press.jpg",
        muscleGroup: "Upper Chest",
        description: "Increase weight by 2kg per dumbbell. Really try to feel the upper chest stretching at the bottom and contracting at the top."
      },
      {
        name: "Dumbbell Overhead Press",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0",
        imageSrc: "/assets/exercises/seated_db_press.jpg",
        muscleGroup: "Shoulders",
        description: "4 sets. Heavier than last week. Try the seated version on a bench for better stability if standing feels difficult to control."
      },
      {
        name: "Dumbbell Front Raise",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=sOoBQA-CNRQ",
        imageSrc: "/assets/exercises/lateral_raise.jpg",
        muscleGroup: "Front Delts",
        description: "Alternate arms or do both together. Raise straight in front to shoulder height. This targets the anterior deltoid — the front of the shoulder which is visible when arms are at your side."
      },
      {
        name: "Tricep Dip Machine (Assisted)",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Dip Machine (Assisted / Bodyweight Dip Station)",
        equipmentSlug: "dip-machine-assisted-bodyweight-dip-station",
        videoLink: "https://www.youtube.com/watch?v=2z8JmcrZBsA",
        imageSrc: "/assets/exercises/triceps_dip.jpg",
        muscleGroup: "Triceps / Chest",
        description: "Use machine assistance to complete full dips. Slight forward lean targets chest more, upright torso targets triceps more. Aim for less assistance than last week."
      },
      {
        name: "Overhead Dumbbell Tricep Extension",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=YbX7Wd8jQ-U",
        imageSrc: "/assets/exercises/overhead_triceps_extension.jpg",
        muscleGroup: "Triceps",
        description: "Heavier dumbbell than last Thursday. Deep stretch behind the head, full extension above. This long head tricep stretch is unmatched by any other exercise."
      }
    ]
  },
  {
    day: 12, week: 2,
    title: "Pull Day B — Back & Biceps",
    focus: "pull",
    tip: "Focus on back width today. Imagine trying to touch your elbows behind your back on every pull.",
    exercises: [
      {
        name: "Assisted Pull-Up Machine",
        sets: 4, reps: "8-10", rest: "75s",
        equipment: "Assisted Pull-up Machine",
        equipmentSlug: "assisted-pull-up-machine",
        videoLink: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
        imageSrc: "/assets/exercises/pull_up.jpg",
        muscleGroup: "Lats / Biceps",
        description: "4 sets. Reduce assistance weight by 5-10% compared to last Friday. The goal is to need less help each week until you can do them unassisted."
      },
      {
        name: "Lat Pulldown (Close Grip)",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Lat Pulldown Machine",
        equipmentSlug: "lat-pulldown-machine",
        videoLink: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
        imageSrc: "/assets/exercises/lat_pulldown.jpg",
        muscleGroup: "Lats / Mid Back",
        description: "Use a close neutral grip today (palms facing each other). This variation hits the lower lats and middle back differently than the wide grip. Pull to upper chest, elbows pointing straight down."
      },
      {
        name: "Dumbbell Bent-Over Row",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=pYj-582319U",
        imageSrc: "/assets/exercises/pendlay_row.jpg",
        muscleGroup: "Back",
        description: "4 sets. Heavier than last Tuesday. Try pulling your elbow as high as possible above your back for maximum lat contraction."
      },
      {
        name: "Roman Chair Back Extension",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Roman Chair (Hyperextension Bench)",
        equipmentSlug: "roman-chair-hyperextension-bench",
        videoLink: "https://www.youtube.com/watch?v=ph3pBHHDnFQ",
        imageSrc: "/assets/exercises/back_extension.jpg",
        muscleGroup: "Lower Back / Glutes",
        description: "Hold a 5kg plate this week for added resistance. Lower back strength is your foundation — a strong lower back prevents injury in every other exercise."
      },
      {
        name: "Hammer Curl",
        sets: 3, reps: "10-12", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=zC3nLlEvin4",
        imageSrc: "/assets/exercises/hammer_curl.jpg",
        muscleGroup: "Brachialis / Forearms",
        description: "Slightly heavier than Week 1. The brachialis muscle developed by hammer curls sits under the bicep — when it grows, it literally pushes the bicep up and makes the peak look higher."
      },
      {
        name: "Cable Bicep Curl",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Cable Machine (Cable Crossover / Pulley Machine)",
        equipmentSlug: "cable-machine-cable-crossover-pulley-machine",
        videoLink: "https://www.youtube.com/watch?v=NFzTWp2qpiE",
        imageSrc: "/assets/exercises/dumbbell_bicep_curl.jpg",
        muscleGroup: "Biceps",
        description: "Finish with cables for constant tension. Slightly more weight than last Friday. The final set should feel very challenging."
      }
    ]
  },
  {
    day: 13, week: 2,
    title: "Leg Day B — Quads, Hamstrings, Glutes & Core",
    focus: "legs",
    tip: "Add walking lunges today — single leg training fixes imbalances and improves overall leg development.",
    exercises: [
      {
        name: "Dumbbell Goblet Squat",
        sets: 4, reps: "10-12", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=MEF-gN-L_10",
        imageSrc: "/assets/exercises/goblet_squat.jpg",
        muscleGroup: "Quads / Glutes",
        description: "Heavier dumbbell than Week 1. Focus on sitting into the squat — knees tracking over toes, chest tall. This is building the motor pattern you'll use for barbell squats in Week 3."
      },
      {
        name: "Walking Lunges (Dumbbell)",
        sets: 3, reps: "10 each leg", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=L8fvypPrv9g",
        imageSrc: "/assets/exercises/walking_lunges.jpg",
        muscleGroup: "Quads / Glutes",
        description: "New exercise! Step forward, lower back knee to just above floor, push through front heel to step forward with other leg. Hold dumbbells at sides. Unilateral training reveals and fixes strength differences between legs."
      },
      {
        name: "Seated Leg Curl Machine",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Seated Leg Curl Machine",
        equipmentSlug: "seated-leg-curl-machine",
        videoLink: "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
        imageSrc: "/assets/exercises/single_leg_rdl.jpg",
        muscleGroup: "Hamstrings",
        description: "Add weight from last Wednesday. Full range of motion — stretch hamstrings fully at the top before pulling down."
      },
      {
        name: "Hip Abduction Machine",
        sets: 3, reps: "15", rest: "45s",
        equipment: "Hip Abduction Machine",
        equipmentSlug: "hip-abduction-machine",
        videoLink: "https://www.youtube.com/watch?v=Nj1uQMpJhZc",
        imageSrc: "/assets/exercises/hip_thrust.jpg",
        muscleGroup: "Glutes / Outer Thigh",
        description: "Add resistance this week. Slow controlled reps — 2 seconds out, 2 seconds back. The gluteus medius (outer glute) is critical for knee tracking during squats and lunges."
      },
      {
        name: "Plank",
        sets: 3, reps: "40-50 sec", rest: "45s",
        equipment: "Yoga Mat (Exercise Mat)",
        equipmentSlug: "yoga-mat-exercise-mat",
        videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU",
        imageSrc: "/assets/exercises/plank.jpg",
        muscleGroup: "Core",
        description: "Increase hold time by 10 seconds vs Week 1. Progress is the goal. If 50 seconds is easy, add a 5kg plate on your back."
      },
      {
        name: "Captain's Chair Knee Raise",
        sets: 3, reps: "12-15", rest: "30s",
        equipment: "Captain's Chair (Vertical Knee Raise Station)",
        equipmentSlug: "captains-chair-vertical-knee-raise-station",
        videoLink: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
        imageSrc: "/assets/exercises/hanging_leg_raise.jpg",
        muscleGroup: "Abs / Hip Flexors",
        description: "Hang in captain's chair, arms supporting body. Raise knees to 90 degrees contracting lower abs. Lower with control. No swinging — control every rep."
      }
    ]
  },
  {
    day: 14, week: 2,
    title: "Rest Day — Recovery & Growth",
    focus: "rest",
    tip: "Two full weeks complete! You're already stronger than Day 1. Rest fully — Week 3 introduces barbells.",
    exercises: []
  },
  {
    day: 15, week: 3,
    title: "Push Day A — Barbell Bench Press Introduced",
    focus: "push",
    tip: "Week 3: Barbells are introduced. Start light — master form before adding load.",
    exercises: [
      {
        name: "Barbell Bench Press",
        sets: 4, reps: "8-10", rest: "90s",
        equipment: "Power Rack (Squat Rack / Power Cage)",
        equipmentSlug: "power-rack-squat-rack-power-cage",
        videoLink: "https://www.youtube.com/watch?v=vcBig73ojpE",
        imageSrc: "/assets/exercises/bench_press.jpg",
        muscleGroup: "Chest",
        description: "FIRST BARBELL EXERCISE! Use the power rack with safeties set. Grip bar slightly wider than shoulders. Lower bar to lower chest (nipple line) with elbows at 60-75 degrees. Drive up explosively. Start with the bar only and add weight conservatively."
      },
      {
        name: "Incline Dumbbell Press",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
        imageSrc: "/assets/exercises/incline_dumbbell_press.jpg",
        muscleGroup: "Upper Chest",
        description: "Follow the heavy barbell bench with dumbbell incline to target upper chest. Heavier than Week 2."
      },
      {
        name: "Pec Deck Machine",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Pec Deck Machine (Butterfly Machine)",
        equipmentSlug: "pec-deck-machine-butterfly-machine",
        videoLink: "https://www.youtube.com/watch?v=G_odjCsVxRk",
        imageSrc: "/assets/exercises/cable_fly.jpg",
        muscleGroup: "Chest",
        description: "Isolation finisher after heavy pressing. Gets blood into the chest for maximum pump and nutrient delivery."
      },
      {
        name: "Dumbbell Overhead Press (Seated)",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0",
        imageSrc: "/assets/exercises/seated_db_press.jpg",
        muscleGroup: "Shoulders",
        description: "Seated for better stability as you increase weight. Aim for heavier dumbbells than Week 2."
      },
      {
        name: "Dumbbell Lateral Raise",
        sets: 4, reps: "12-15", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=t2b8Udq9v6k",
        imageSrc: "/assets/exercises/lateral_raise.jpg",
        muscleGroup: "Side Delts",
        description: "Week 3 laterals. Add 1-2kg. The side delt is what creates the visual width from the front — prioritise this muscle."
      },
      {
        name: "Tricep Pushdown + Overhead Extension Superset",
        sets: 3, reps: "12 + 12", rest: "60s",
        equipment: "Tricep Pushdown Machine (Cable Pushdown Station)",
        equipmentSlug: "tricep-pushdown-machine-cable-pushdown-station",
        videoLink: "https://www.youtube.com/watch?v=2-LAMcpzODU",
        imageSrc: "/assets/exercises/cable_triceps_pushdown.jpg",
        muscleGroup: "Triceps",
        description: "SUPERSET: Do 12 cable pushdowns immediately followed by 12 overhead dumbbell extensions — no rest between. Rest 60s after the pair. This technique maximises tricep fatigue in less time."
      }
    ]
  },
  {
    day: 16, week: 3,
    title: "Pull Day A — Barbell Row Introduced",
    focus: "pull",
    tip: "The barbell row is one of the best back exercises ever. Take time to nail the hip hinge position.",
    exercises: [
      {
        name: "Barbell Bent-Over Row",
        sets: 4, reps: "8-10", rest: "90s",
        equipment: "Power Rack (Squat Rack / Power Cage)",
        equipmentSlug: "power-rack-squat-rack-power-cage",
        videoLink: "https://www.youtube.com/watch?v=9efgcAjQe7E",
        imageSrc: "/assets/exercises/pendlay_row.jpg",
        muscleGroup: "Back",
        description: "Hinge forward at 45 degrees, back flat, bar hanging. Pull bar to lower chest (overhand grip) or navel (underhand grip). Squeeze shoulder blades at top. Lower with control. This is the single best back thickness builder — heavier than any machine."
      },
      {
        name: "Lat Pulldown",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Lat Pulldown Machine",
        equipmentSlug: "lat-pulldown-machine",
        videoLink: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
        imageSrc: "/assets/exercises/lat_pulldown.jpg",
        muscleGroup: "Lats",
        description: "After heavy rows, pulldowns target lat width. You should be lifting more weight now than Week 1."
      },
      {
        name: "Seated Row Machine",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Seated Row Machine",
        equipmentSlug: "seated-row-machine",
        videoLink: "https://www.youtube.com/watch?v=GZbfZ033f74",
        imageSrc: "/assets/exercises/seated_row.jpg",
        muscleGroup: "Mid Back",
        description: "Mid-back finisher. Focus on scapular retraction — squeezing your shoulder blades together. Better posture is the visible side effect of this exercise."
      },
      {
        name: "Roman Chair Back Extension",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Roman Chair (Hyperextension Bench)",
        equipmentSlug: "roman-chair-hyperextension-bench",
        videoLink: "https://www.youtube.com/watch?v=ph3pBHHDnFQ",
        imageSrc: "/assets/exercises/back_extension.jpg",
        muscleGroup: "Lower Back / Glutes",
        description: "Hold a 10kg plate for added resistance. Lower back strength is critical before deadlifting next week."
      },
      {
        name: "Preacher Curl Machine",
        sets: 3, reps: "10-12", rest: "45s",
        equipment: "Preacher Curl Machine",
        equipmentSlug: "preacher-curl-machine",
        videoLink: "https://www.youtube.com/watch?v=fIWP-FRFNU0",
        imageSrc: "/assets/exercises/ez_bar_curl.jpg",
        muscleGroup: "Biceps",
        description: "Heavier than Week 2. You should notice your arms are already more defined. Keep going!"
      },
      {
        name: "Hammer Curl",
        sets: 3, reps: "10-12", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=zC3nLlEvin4",
        imageSrc: "/assets/exercises/hammer_curl.jpg",
        muscleGroup: "Brachialis",
        description: "Finish with hammers for total arm thickness. Go heavier than Week 2."
      }
    ]
  },
  {
    day: 17, week: 3,
    title: "Leg Day A — Barbell Squat Introduced",
    focus: "legs",
    tip: "The barbell squat is THE most important exercise. Start with just the bar — form first, weight second.",
    exercises: [
      {
        name: "Barbell Back Squat",
        sets: 4, reps: "8-10", rest: "120s",
        equipment: "Squat Rack (Squat Stand)",
        equipmentSlug: "squat-rack-squat-stand",
        videoLink: "https://www.youtube.com/watch?v=ultWZbUMPL8",
        imageSrc: "/assets/exercises/barbell_back_squat.jpg",
        muscleGroup: "Full Legs",
        description: "THE KING OF ALL EXERCISES. Bar on upper traps, not neck. Feet shoulder-width, toes out 15-30 degrees. Push knees out tracking over toes. Squat below parallel — hip crease BELOW knee. Drive through the whole foot to stand. Start with the bar only today."
      },
      {
        name: "Leg Press",
        sets: 3, reps: "12-15", rest: "75s",
        equipment: "Leg Press Machine",
        equipmentSlug: "leg-press-machine",
        videoLink: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
        imageSrc: "/assets/exercises/smith_leg_press.jpg",
        muscleGroup: "Quads / Glutes",
        description: "After squats, legs will be fatigued. Use leg press for higher volume at lighter relative weight to fully exhaust the quads."
      },
      {
        name: "Dumbbell Romanian Deadlift",
        sets: 4, reps: "10-12", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4",
        imageSrc: "/assets/exercises/single_leg_rdl.jpg",
        muscleGroup: "Hamstrings / Glutes",
        description: "Heavier than Week 2. You're training the same hip hinge pattern as the barbell deadlift you'll do next Friday. Perfect preparation."
      },
      {
        name: "Lying Leg Curl Machine",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Lying Leg Curl Machine",
        equipmentSlug: "lying-leg-curl-machine",
        videoLink: "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
        imageSrc: "/assets/exercises/glute_ham_raise.jpg",
        muscleGroup: "Hamstrings",
        description: "Hamstring isolation after heavy RDLs. Pause at peak contraction 1 second."
      },
      {
        name: "Calf Raises",
        sets: 4, reps: "20", rest: "30s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=gwLzBJYoWlI",
        imageSrc: "/assets/exercises/calf_raise.jpg",
        muscleGroup: "Calves",
        description: "20 reps with heavy dumbbells. Calves need very high reps to grow — they are slow-twitch dominant."
      },
      {
        name: "Ab Wheel Rollout",
        sets: 3, reps: "8-12", rest: "60s",
        equipment: "Ab Wheel Roller",
        equipmentSlug: "ab-wheel-roller",
        videoLink: "https://www.youtube.com/watch?v=mGBHQMlMWHk",
        imageSrc: "/assets/exercises/plank.jpg",
        muscleGroup: "Core",
        description: "Kneeling, roll the wheel out slowly, extend as far as possible while keeping lower back flat. Pull back using your abs. The hardest core exercise — incredibly effective."
      }
    ]
  },
  {
    day: 18, week: 3,
    title: "Push Day B — Progressive Overload Push",
    focus: "push",
    tip: "Add weight to everything compared to Monday. This is where real strength gains happen.",
    exercises: [
      {
        name: "Barbell Bench Press",
        sets: 4, reps: "8-10", rest: "90s",
        equipment: "Power Rack (Squat Rack / Power Cage)",
        equipmentSlug: "power-rack-squat-rack-power-cage",
        videoLink: "https://www.youtube.com/watch?v=vcBig73ojpE",
        imageSrc: "/assets/exercises/bench_press.jpg",
        muscleGroup: "Chest",
        description: "Add 5kg to Monday's bench press. If Monday was the bar (20kg), aim for 25-30kg today. Progressive overload in action."
      },
      {
        name: "Dumbbell Bench Press",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=VmB1G1K7v94",
        imageSrc: "/assets/exercises/bench_press.jpg",
        muscleGroup: "Chest",
        description: "Dumbbells give greater range of motion. After barbell bench, the chest is already warmed up and you can focus on the stretch and contraction."
      },
      {
        name: "Chest Press Machine",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Chest Press Machine",
        equipmentSlug: "chest-press-machine",
        videoLink: "https://www.youtube.com/watch?v=xUm0BiZCX_I",
        imageSrc: "/assets/exercises/bench_press.jpg",
        muscleGroup: "Chest",
        description: "Finishing exercise for the chest. Machine allows you to push to near-failure safely after heavy barbell and dumbbell work."
      },
      {
        name: "Shoulder Press Machine",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Shoulder Press Machine",
        equipmentSlug: "shoulder-press-machine",
        videoLink: "https://www.youtube.com/watch?v=Wqq43dKW1TU",
        imageSrc: "/assets/exercises/overhead_press.jpg",
        muscleGroup: "Shoulders",
        description: "Heavier than any week so far. 4 sets. Your shoulder strength should have improved noticeably over the past 3 weeks."
      },
      {
        name: "Lateral Raise Machine",
        sets: 3, reps: "15", rest: "45s",
        equipment: "Lateral Raise Machine",
        equipmentSlug: "lateral-raise-machine",
        videoLink: "https://www.youtube.com/watch?v=PPbMhcnPWKY",
        imageSrc: "/assets/exercises/lateral_raise.jpg",
        muscleGroup: "Side Delts",
        description: "Machine for constant tension. Side delts should be noticeably more defined than Week 1."
      },
      {
        name: "Tricep Pushdown (Cable)",
        sets: 4, reps: "12-15", rest: "45s",
        equipment: "Tricep Pushdown Machine (Cable Pushdown Station)",
        equipmentSlug: "tricep-pushdown-machine-cable-pushdown-station",
        videoLink: "https://www.youtube.com/watch?v=2-LAMcpzODU",
        imageSrc: "/assets/exercises/cable_triceps_pushdown.jpg",
        muscleGroup: "Triceps",
        description: "Heavier and more reps than Week 2. Triceps should be visibly larger than when you started."
      }
    ]
  },
  {
    day: 19, week: 3,
    title: "Pull Day B — Deadlift Introduced",
    focus: "pull",
    tip: "Deadlift day. The most powerful exercise ever created. It works every single muscle in your body.",
    exercises: [
      {
        name: "Barbell Deadlift",
        sets: 3, reps: "6-8", rest: "120s",
        equipment: "Power Rack (Squat Rack / Power Cage)",
        equipmentSlug: "power-rack-squat-rack-power-cage",
        videoLink: "https://www.youtube.com/watch?v=op9kVnSso6Q",
        imageSrc: "/assets/exercises/barbell_deadlift.jpg",
        muscleGroup: "Full Posterior Chain",
        description: "THE KING OF STRENGTH. Bar over mid-foot, hip-width stance. Hinge down, grip bar, lats tight. Take a big breath and brace core hard. Push the floor away — legs initiate, hips and chest rise together. Lock hips at top. Set bar down with control. Start with 60-70% of what you think you can lift."
      },
      {
        name: "Assisted Pull-Up Machine",
        sets: 4, reps: "8-10", rest: "75s",
        equipment: "Assisted Pull-up Machine",
        equipmentSlug: "assisted-pull-up-machine",
        videoLink: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
        imageSrc: "/assets/exercises/pull_up.jpg",
        muscleGroup: "Lats",
        description: "After deadlifts, pull-ups train the same back muscles. Reduce assistance again from Week 2. You are getting closer to unassisted pull-ups."
      },
      {
        name: "Seated Row Machine",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Seated Row Machine",
        equipmentSlug: "seated-row-machine",
        videoLink: "https://www.youtube.com/watch?v=GZbfZ033f74",
        imageSrc: "/assets/exercises/seated_row.jpg",
        muscleGroup: "Mid Back",
        description: "Mid-back accessory after the main compound movements. The back should be thoroughly worked at this point."
      },
      {
        name: "Rear Delt Machine",
        sets: 3, reps: "15", rest: "45s",
        equipment: "Rear Delt Machine (Reverse Pec Deck)",
        equipmentSlug: "rear-delt-machine-reverse-pec-deck",
        videoLink: "https://www.youtube.com/watch?v=EA7u4Q_8HQ0",
        imageSrc: "/assets/exercises/reverse_fly.jpg",
        muscleGroup: "Rear Delts",
        description: "Don't skip this. Rear delts keep shoulders healthy and improve posture. More important than most people realise."
      },
      {
        name: "Dumbbell Bicep Curl",
        sets: 3, reps: "10-12", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=ykJmrZ5v0Kg",
        imageSrc: "/assets/exercises/dumbbell_bicep_curl.jpg",
        muscleGroup: "Biceps",
        description: "Heavier than Week 2. Biceps are already heavily recruited by deadlifts and rows — this is the direct isolation finisher."
      },
      {
        name: "Concentration Curl",
        sets: 3, reps: "12", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=Jvj2wV0vOYU",
        imageSrc: "/assets/exercises/dumbbell_bicep_curl.jpg",
        muscleGroup: "Biceps Peak",
        description: "Final bicep exercise. Go heavy. Hold peak contraction 3 seconds. End of week 3 — you should see noticeable arm development compared to Day 1."
      }
    ]
  },
  {
    day: 20, week: 3,
    title: "Leg Day B — Heavy Squats & Full Legs",
    focus: "legs",
    tip: "Add weight to squats vs Wednesday. This is the most important week for establishing your squat strength.",
    exercises: [
      {
        name: "Barbell Back Squat",
        sets: 4, reps: "8-10", rest: "120s",
        equipment: "Squat Rack (Squat Stand)",
        equipmentSlug: "squat-rack-squat-stand",
        videoLink: "https://www.youtube.com/watch?v=ultWZbUMPL8",
        imageSrc: "/assets/exercises/barbell_back_squat.jpg",
        muscleGroup: "Full Legs",
        description: "Add 5-10kg vs Wednesday. Depth is non-negotiable — break parallel. If form breaks down, strip weight off. Never sacrifice form for ego."
      },
      {
        name: "Walking Lunges (Dumbbell)",
        sets: 3, reps: "12 each leg", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=L8fvypPrv9g",
        imageSrc: "/assets/exercises/walking_lunges.jpg",
        muscleGroup: "Quads / Glutes",
        description: "Heavier dumbbells than last Saturday. After heavy squats, lunges make every fibre scream."
      },
      {
        name: "Leg Extension",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Leg Extension Machine",
        equipmentSlug: "leg-extension-machine",
        videoLink: "https://www.youtube.com/watch?v=YyvSfVjQeL0",
        imageSrc: "/assets/exercises/squat.jpg",
        muscleGroup: "Quads",
        description: "Quad isolation finisher. Week 3 weight should be noticeably heavier than Week 1."
      },
      {
        name: "Hip Thrust Machine",
        sets: 4, reps: "12-15", rest: "60s",
        equipment: "Hip Thrust Machine",
        equipmentSlug: "hip-thrust-machine",
        videoLink: "https://www.youtube.com/watch?v=xDmFkJxPzeM",
        imageSrc: "/assets/exercises/hip_thrust.jpg",
        muscleGroup: "Glutes",
        description: "4 sets. Heavier than Week 2. The glutes are the biggest muscle in the body — prioritise them for both performance and aesthetics."
      },
      {
        name: "Calf Raises",
        sets: 4, reps: "20", rest: "30s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=gwLzBJYoWlI",
        imageSrc: "/assets/exercises/calf_raise.jpg",
        muscleGroup: "Calves",
        description: "Heavier dumbbells, same reps. Calves respond to progressive overload just like any muscle."
      },
      {
        name: "Plank",
        sets: 3, reps: "50-60 sec", rest: "45s",
        equipment: "Yoga Mat (Exercise Mat)",
        equipmentSlug: "yoga-mat-exercise-mat",
        videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU",
        imageSrc: "/assets/exercises/plank.jpg",
        muscleGroup: "Core",
        description: "You started at 30-45 seconds in Week 1. You're now holding 50-60 seconds. That's real, measurable progress."
      }
    ]
  },
  {
    day: 21, week: 3,
    title: "Rest Day — Recovery & Growth",
    focus: "rest",
    tip: "Week 3 complete! You've now done barbell squats, bench press, rows and deadlifts. You're no longer a beginner!",
    exercises: []
  },
  {
    day: 22, week: 4,
    title: "Push Day A — Peak Chest & Shoulders",
    focus: "push",
    tip: "FINAL WEEK. Go heavier than any previous week. Leave nothing in the tank.",
    exercises: [
      {
        name: "Barbell Bench Press",
        sets: 4, reps: "6-8", rest: "90s",
        equipment: "Power Rack (Squat Rack / Power Cage)",
        equipmentSlug: "power-rack-squat-rack-power-cage",
        videoLink: "https://www.youtube.com/watch?v=vcBig73ojpE",
        imageSrc: "/assets/exercises/bench_press.jpg",
        muscleGroup: "Chest",
        description: "Week 4: Heavier weight, fewer reps (6-8). This is strength territory. Push the heaviest weight you can handle with perfect form. Compare to Week 3 — you should be significantly stronger."
      },
      {
        name: "Incline Dumbbell Press",
        sets: 4, reps: "8-10", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
        imageSrc: "/assets/exercises/incline_dumbbell_press.jpg",
        muscleGroup: "Upper Chest",
        description: "Heaviest incline press yet. 4 sets. Full range of motion. Upper chest is the most impressive part of the chest from the front."
      },
      {
        name: "Pec Deck Machine",
        sets: 3, reps: "12-15", rest: "45s",
        equipment: "Pec Deck Machine (Butterfly Machine)",
        equipmentSlug: "pec-deck-machine-butterfly-machine",
        videoLink: "https://www.youtube.com/watch?v=G_odjCsVxRk",
        imageSrc: "/assets/exercises/cable_fly.jpg",
        muscleGroup: "Chest",
        description: "Isolation to finish chest. Hold each rep for 2 seconds at peak. Your chest has grown significantly in 4 weeks."
      },
      {
        name: "Dumbbell Overhead Press (Seated)",
        sets: 4, reps: "8-10", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0",
        imageSrc: "/assets/exercises/seated_db_press.jpg",
        muscleGroup: "Shoulders",
        description: "Heaviest overhead press of the entire program. 4 sets, 8-10 reps. Shoulders should be noticeably wider than 4 weeks ago."
      },
      {
        name: "Dumbbell Lateral Raise",
        sets: 4, reps: "12-15", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=t2b8Udq9v6k",
        imageSrc: "/assets/exercises/lateral_raise.jpg",
        muscleGroup: "Side Delts",
        description: "Heaviest laterals yet. 4 sets. Side delts are what creates the 3D shoulder appearance from the front."
      },
      {
        name: "Tricep Dip Machine + Pushdown Superset",
        sets: 3, reps: "10 + 15", rest: "60s",
        equipment: "Dip Machine (Assisted / Bodyweight Dip Station)",
        equipmentSlug: "dip-machine-assisted-bodyweight-dip-station",
        videoLink: "https://www.youtube.com/watch?v=2z8JmcrZBsA",
        imageSrc: "/assets/exercises/triceps_dip.jpg",
        muscleGroup: "Triceps",
        description: "SUPERSET: 10 dips immediately into 15 cable pushdowns. The ultimate tricep finisher. Arms should be absolutely pumped after this."
      }
    ]
  },
  {
    day: 23, week: 4,
    title: "Pull Day A — Heavy Deadlift & Back",
    focus: "pull",
    tip: "Heaviest deadlift of the program today. Add 5-10kg vs Week 3.",
    exercises: [
      {
        name: "Barbell Deadlift",
        sets: 4, reps: "5-6", rest: "120s",
        equipment: "Power Rack (Squat Rack / Power Cage)",
        equipmentSlug: "power-rack-squat-rack-power-cage",
        videoLink: "https://www.youtube.com/watch?v=op9kVnSso6Q",
        imageSrc: "/assets/exercises/barbell_deadlift.jpg",
        muscleGroup: "Full Posterior Chain",
        description: "Week 4 deadlifts. Lower reps, much heavier weight. 4 sets of 5-6 reps. This is strength training. You will feel incredibly powerful. Never round your lower back."
      },
      {
        name: "Barbell Bent-Over Row",
        sets: 4, reps: "8-10", rest: "90s",
        equipment: "Power Rack (Squat Rack / Power Cage)",
        equipmentSlug: "power-rack-squat-rack-power-cage",
        videoLink: "https://www.youtube.com/watch?v=9efgcAjQe7E",
        imageSrc: "/assets/exercises/pendlay_row.jpg",
        muscleGroup: "Back",
        description: "Heavier than Week 3 rows. 4 sets. Your back is now significantly stronger than 4 weeks ago."
      },
      {
        name: "Assisted Pull-Up Machine",
        sets: 4, reps: "8-10", rest: "75s",
        equipment: "Assisted Pull-up Machine",
        equipmentSlug: "assisted-pull-up-machine",
        videoLink: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
        imageSrc: "/assets/exercises/pull_up.jpg",
        muscleGroup: "Lats",
        description: "Final week pull-ups. Use minimum assistance possible. Try at least 1-2 fully unassisted reps if you feel ready."
      },
      {
        name: "Lat Pulldown",
        sets: 3, reps: "10-12", rest: "60s",
        equipment: "Lat Pulldown Machine",
        equipmentSlug: "lat-pulldown-machine",
        videoLink: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
        imageSrc: "/assets/exercises/lat_pulldown.jpg",
        muscleGroup: "Lats",
        description: "Heaviest weight on the pulldown machine all program. Your back is unrecognisable from Day 1."
      },
      {
        name: "Dumbbell Bicep Curl",
        sets: 4, reps: "8-10", rest: "60s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=ykJmrZ5v0Kg",
        imageSrc: "/assets/exercises/dumbbell_bicep_curl.jpg",
        muscleGroup: "Biceps",
        description: "Heaviest curls of the program. 4 sets. Your arms are visibly bigger and stronger than 4 weeks ago."
      },
      {
        name: "Hammer Curl",
        sets: 3, reps: "10-12", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=zC3nLlEvin4",
        imageSrc: "/assets/exercises/hammer_curl.jpg",
        muscleGroup: "Brachialis",
        description: "Finish strong. Heaviest hammers yet. Feel the forearm and brachialis working hard."
      }
    ]
  },
  {
    day: 24, week: 4,
    title: "Leg Day A — Heavy Squats",
    focus: "legs",
    tip: "Heaviest squats of the program. You started with just the bar — see how far you've come.",
    exercises: [
      {
        name: "Barbell Back Squat",
        sets: 5, reps: "6-8", rest: "120s",
        equipment: "Squat Rack (Squat Stand)",
        equipmentSlug: "squat-rack-squat-stand",
        videoLink: "https://www.youtube.com/watch?v=ultWZbUMPL8",
        imageSrc: "/assets/exercises/barbell_back_squat.jpg",
        muscleGroup: "Full Legs",
        description: "5 sets today — highest volume of the entire program. Heaviest weight you've used. Depth is mandatory. This is your Week 4 peak squat session. Record the weight for future reference."
      },
      {
        name: "Hack Squat Machine",
        sets: 3, reps: "10-12", rest: "75s",
        equipment: "Hack Squat Machine",
        equipmentSlug: "hack-squat-machine",
        videoLink: "https://www.youtube.com/watch?v=EdtPMkRxGwQ",
        imageSrc: "/assets/exercises/barbell_back_squat.jpg",
        muscleGroup: "Quads",
        description: "After heavy barbell squats, hack squats isolate the quads further. Legs will be exhausted — that's exactly the stimulus for maximum growth."
      },
      {
        name: "Dumbbell Romanian Deadlift",
        sets: 4, reps: "10-12", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4",
        imageSrc: "/assets/exercises/single_leg_rdl.jpg",
        muscleGroup: "Hamstrings / Glutes",
        description: "Heaviest RDL of the program. Feel that deep hamstring stretch. Your hamstrings are significantly stronger than Day 1."
      },
      {
        name: "Hip Thrust Machine",
        sets: 4, reps: "12-15", rest: "60s",
        equipment: "Hip Thrust Machine",
        equipmentSlug: "hip-thrust-machine",
        videoLink: "https://www.youtube.com/watch?v=xDmFkJxPzeM",
        imageSrc: "/assets/exercises/hip_thrust.jpg",
        muscleGroup: "Glutes",
        description: "Maximum glute workout. Heaviest weight yet. Drive hips explosively, hold 3 seconds at top. The glute pump after this will be immense."
      },
      {
        name: "Calf Raises",
        sets: 4, reps: "20", rest: "30s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=gwLzBJYoWlI",
        imageSrc: "/assets/exercises/calf_raise.jpg",
        muscleGroup: "Calves",
        description: "Heaviest calf raises. 4 sets of 20. Calves should be visibly more defined than when you started."
      },
      {
        name: "Ab Wheel Rollout",
        sets: 3, reps: "10-15", rest: "60s",
        equipment: "Ab Wheel Roller",
        equipmentSlug: "ab-wheel-roller",
        videoLink: "https://www.youtube.com/watch?v=mGBHQMlMWHk",
        imageSrc: "/assets/exercises/plank.jpg",
        muscleGroup: "Core",
        description: "More reps than Week 3. Your core is now a solid foundation for all compound lifts."
      }
    ]
  },
  {
    day: 25, week: 4,
    title: "Push Day B — Final Push Session",
    focus: "push",
    tip: "Second-to-last push session. Hit a personal best on every lift today.",
    exercises: [
      {
        name: "Barbell Bench Press",
        sets: 5, reps: "5", rest: "120s",
        equipment: "Power Rack (Squat Rack / Power Cage)",
        equipmentSlug: "power-rack-squat-rack-power-cage",
        videoLink: "https://www.youtube.com/watch?v=vcBig73ojpE",
        imageSrc: "/assets/exercises/bench_press.jpg",
        muscleGroup: "Chest",
        description: "5 sets of 5 reps — STRENGTH FORMAT. Heaviest bench press of the entire 30 days. This is your 5-rep max attempt. Record the weight."
      },
      {
        name: "Incline Chest Press Machine",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Incline Chest Press Machine",
        equipmentSlug: "incline-chest-press-machine",
        videoLink: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
        imageSrc: "/assets/exercises/incline_dumbbell_press.jpg",
        muscleGroup: "Upper Chest",
        description: "Machine after heavy barbell. Upper chest emphasis. Heaviest machine weight yet."
      },
      {
        name: "Dumbbell Overhead Press",
        sets: 4, reps: "8-10", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=2yKgVjS9_C0",
        imageSrc: "/assets/exercises/seated_db_press.jpg",
        muscleGroup: "Shoulders",
        description: "Heaviest overhead press. Compare to Day 4 — the weight difference will shock you."
      },
      {
        name: "Lateral Raise Machine",
        sets: 4, reps: "12-15", rest: "45s",
        equipment: "Lateral Raise Machine",
        equipmentSlug: "lateral-raise-machine",
        videoLink: "https://www.youtube.com/watch?v=PPbMhcnPWKY",
        imageSrc: "/assets/exercises/lateral_raise.jpg",
        muscleGroup: "Side Delts",
        description: "Final lateral raise session of the program. Heaviest weight yet. Your shoulders are wider than 4 weeks ago."
      },
      {
        name: "Tricep Pushdown (Heavy)",
        sets: 4, reps: "10-12", rest: "60s",
        equipment: "Tricep Pushdown Machine (Cable Pushdown Station)",
        equipmentSlug: "tricep-pushdown-machine-cable-pushdown-station",
        videoLink: "https://www.youtube.com/watch?v=2-LAMcpzODU",
        imageSrc: "/assets/exercises/cable_triceps_pushdown.jpg",
        muscleGroup: "Triceps",
        description: "Heaviest pushdown of the program. Triceps make up 2/3 of arm size — look at your arms now vs Day 1."
      },
      {
        name: "Overhead Dumbbell Tricep Extension",
        sets: 3, reps: "12", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=YbX7Wd8jQ-U",
        imageSrc: "/assets/exercises/overhead_triceps_extension.jpg",
        muscleGroup: "Triceps Long Head",
        description: "Final tricep isolation. Maximum stretch and contraction. Finish the session strong."
      }
    ]
  },
  {
    day: 26, week: 4,
    title: "Pull Day B — Final Pull Session",
    focus: "pull",
    tip: "Last pull day. Leave absolutely everything in the gym. You earned this.",
    exercises: [
      {
        name: "Barbell Deadlift",
        sets: 3, reps: "5", rest: "120s",
        equipment: "Power Rack (Squat Rack / Power Cage)",
        equipmentSlug: "power-rack-squat-rack-power-cage",
        videoLink: "https://www.youtube.com/watch?v=op9kVnSso6Q",
        imageSrc: "/assets/exercises/barbell_deadlift.jpg",
        muscleGroup: "Full Posterior Chain",
        description: "3 heavy sets of 5. Final deadlift of the program. Go as heavy as you can with perfect form. This is your 5-rep max. Record it."
      },
      {
        name: "Barbell Bent-Over Row",
        sets: 4, reps: "8", rest: "90s",
        equipment: "Power Rack (Squat Rack / Power Cage)",
        equipmentSlug: "power-rack-squat-rack-power-cage",
        videoLink: "https://www.youtube.com/watch?v=9efgcAjQe7E",
        imageSrc: "/assets/exercises/pendlay_row.jpg",
        muscleGroup: "Back",
        description: "Heaviest rows of the 30 days. 4 sets of 8. This is the most powerful back exercise — your back is now genuinely strong."
      },
      {
        name: "Assisted Pull-Up Machine",
        sets: 3, reps: "10", rest: "75s",
        equipment: "Assisted Pull-up Machine",
        equipmentSlug: "assisted-pull-up-machine",
        videoLink: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
        imageSrc: "/assets/exercises/pull_up.jpg",
        muscleGroup: "Lats",
        description: "Final pull-ups. Try minimum assistance. If you can do even 1 unassisted rep — that is 30-day progress."
      },
      {
        name: "Rear Delt Machine",
        sets: 3, reps: "15", rest: "45s",
        equipment: "Rear Delt Machine (Reverse Pec Deck)",
        equipmentSlug: "rear-delt-machine-reverse-pec-deck",
        videoLink: "https://www.youtube.com/watch?v=EA7u4Q_8HQ0",
        imageSrc: "/assets/exercises/reverse_fly.jpg",
        muscleGroup: "Rear Delts",
        description: "Final rear delt session. This muscle has been protecting your shoulders throughout the entire program."
      },
      {
        name: "Preacher Curl Machine",
        sets: 3, reps: "10-12", rest: "45s",
        equipment: "Preacher Curl Machine",
        equipmentSlug: "preacher-curl-machine",
        videoLink: "https://www.youtube.com/watch?v=fIWP-FRFNU0",
        imageSrc: "/assets/exercises/ez_bar_curl.jpg",
        muscleGroup: "Biceps",
        description: "Heaviest preacher curls. The biceps are fully isolated — squeeze as hard as humanly possible."
      },
      {
        name: "Cable Bicep Curl",
        sets: 3, reps: "15", rest: "45s",
        equipment: "Cable Machine (Cable Crossover / Pulley Machine)",
        equipmentSlug: "cable-machine-cable-crossover-pulley-machine",
        videoLink: "https://www.youtube.com/watch?v=NFzTWp2qpiE",
        imageSrc: "/assets/exercises/dumbbell_bicep_curl.jpg",
        muscleGroup: "Biceps",
        description: "FINAL EXERCISE of Pull Day B. Pump out 15 reps with constant cable tension. Last bicep set of the 30-day program. Finish strong."
      }
    ]
  },
  {
    day: 27, week: 4,
    title: "Leg Day B — Final Leg Day (THE FINISHER)",
    focus: "legs",
    tip: "THE FINAL TRAINING DAY. Give 100%. Record all your weights. Compare to Day 1. You are a different person.",
    exercises: [
      {
        name: "Barbell Back Squat",
        sets: 5, reps: "5", rest: "120s",
        equipment: "Squat Rack (Squat Stand)",
        equipmentSlug: "squat-rack-squat-stand",
        videoLink: "https://www.youtube.com/watch?v=ultWZbUMPL8",
        imageSrc: "/assets/exercises/barbell_back_squat.jpg",
        muscleGroup: "Full Legs",
        description: "5×5 — The ultimate strength format. Heaviest squat of the 30 days. You started with just the bar. Look at the weight on it now. This is your 5RM. Record it forever."
      },
      {
        name: "Leg Press",
        sets: 4, reps: "15", rest: "75s",
        equipment: "Leg Press Machine",
        equipmentSlug: "leg-press-machine",
        videoLink: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
        imageSrc: "/assets/exercises/smith_leg_press.jpg",
        muscleGroup: "Quads / Glutes",
        description: "After heavy squats, leg press for volume. 4 sets of 15. The quad pump will be extraordinary."
      },
      {
        name: "Dumbbell Romanian Deadlift",
        sets: 3, reps: "12", rest: "75s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=Gk74yT_t-G4",
        imageSrc: "/assets/exercises/single_leg_rdl.jpg",
        muscleGroup: "Hamstrings / Glutes",
        description: "Final RDL. Deep stretch, explosive hip drive. Your hamstrings have grown and strengthened enormously."
      },
      {
        name: "Hip Thrust Machine",
        sets: 4, reps: "15", rest: "60s",
        equipment: "Hip Thrust Machine",
        equipmentSlug: "hip-thrust-machine",
        videoLink: "https://www.youtube.com/watch?v=xDmFkJxPzeM",
        imageSrc: "/assets/exercises/hip_thrust.jpg",
        muscleGroup: "Glutes",
        description: "Final hip thrusts. Heaviest weight. Squeeze glutes at the top for 3 seconds every single rep. End the program the way you mean to go on."
      },
      {
        name: "Calf Raises (Dropset)",
        sets: 3, reps: "20 + 20", rest: "45s",
        equipment: "Dumbbell",
        equipmentSlug: "dumbbell",
        videoLink: "https://www.youtube.com/watch?v=gwLzBJYoWlI",
        imageSrc: "/assets/exercises/calf_raise.jpg",
        muscleGroup: "Calves",
        description: "DROPSET: Do 20 reps heavy, immediately reduce weight and do 20 more. Total 40 reps per set. The ultimate calf finisher for the last training day."
      },
      {
        name: "Plank (Max Hold)",
        sets: 3, reps: "60-90 sec", rest: "60s",
        equipment: "Yoga Mat (Exercise Mat)",
        equipmentSlug: "yoga-mat-exercise-mat",
        videoLink: "https://www.youtube.com/watch?v=ASdvfS_A6oU",
        imageSrc: "/assets/exercises/plank.jpg",
        muscleGroup: "Core",
        description: "FINAL EXERCISE of the 30-day program. Hold the plank as long as possible. You started at 30-45 seconds. Let's see what you've built. This plank hold represents 27 days of hard work and dedication. Hold it."
      }
    ]
  },
  {
    day: 28, week: 4,
    title: "Rest Day — Sunday",
    focus: "rest",
    tip: "🎉 CONGRATULATIONS! You have completed The 30-Day Beginner Program! Rest today. You've earned it.",
    exercises: []
  },
  {
    day: 29, week: 4,
    title: "Active Recovery — Optional Cardio",
    focus: "cardio",
    tip: "Program complete! Optional: light cardio to stay active while body fully recovers.",
    exercises: [
      {
        name: "Upright Bike (Steady State)",
        sets: 1, reps: "30 min", rest: "-",
        equipment: "Upright Bike",
        equipmentSlug: "upright-bike",
        videoLink: "https://www.youtube.com/watch?v=NaT3lFYqxSI",
        imageSrc: "/assets/exercises/sprint_intervals.jpg",
        muscleGroup: "Cardio",
        description: "Optional easy cardio. 30 minutes at comfortable pace. Helps flush out soreness from the final week and keeps you active."
      },
      {
        name: "Full Body Stretch",
        sets: 1, reps: "15 min", rest: "-",
        equipment: "Yoga Mat (Exercise Mat)",
        equipmentSlug: "yoga-mat-exercise-mat",
        videoLink: "https://www.youtube.com/watch?v=L_xrDAtykMI",
        imageSrc: "/assets/exercises/good_morning.jpg",
        muscleGroup: "Mobility",
        description: "Hold each stretch 30-45 seconds. Focus on legs, chest, and back — the areas you worked hardest over 4 weeks."
      }
    ]
  },
  {
    day: 30, week: 4,
    title: "Program Complete 🏆",
    focus: "rest",
    tip: "You have officially completed the 30-Day Beginner Program. You are ready for an intermediate Push/Pull/Legs program. Keep going!",
    exercises: []
  }
];


const BeginnerWorkoutPlan = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);
  
  const planForToday = workoutData.find(plan => plan.day === currentDay);
  const dayListRef = useRef(null);

  const handleDayChange = (day) => {
    setCurrentDay(day);
    if (dayListRef.current) {
      const dayElement = dayListRef.current.querySelector(`.bwp-day-item[data-day='${day}']`);
      if (dayElement) {
        dayListRef.current.scrollTo({
          left: dayElement.offsetLeft - (dayListRef.current.offsetWidth / 2) + (dayElement.offsetWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  };

  const handleDayScroll = (direction) => {
    if (dayListRef.current) {
      const scrollAmount = dayListRef.current.offsetWidth * 0.4;
      const newScroll = dayListRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      dayListRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };
  
  // Fetch ChatGPT explanation (simulated)
  const getChatGptExplanation = async (exerciseName) => {
    setExplanationLoading(true);
    setExplanationError(null);
    setCurrentExplanation(null);
    setShowExplanationModal(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dummyResponse = {
        explanation: `ChatGPT explanation for ${exerciseName}: This is a dummy text to show how the feature works. In a real scenario, this text would be a detailed explanation of the exercise, its benefits, and proper form from ChatGPT.`
      };
      
      setCurrentExplanation(dummyResponse.explanation);
    } catch (error) {
      setExplanationError("Failed to fetch explanation. Please try again.");
      console.error("API call failed:", error);
    } finally {
      setExplanationLoading(false);
    }
  };

  return (
    <div className="bwp-page">
        <div className="bwp-header">
          <div className="bwp-overlay">
            <div className="bwp-header-content">
              <h1>The Complete 4-Week Beginner's Workout Program</h1>
              <p>
                This plan is designed to help you build muscle and strength with a variety of fundamental exercises.
              </p>
            </div>
          </div>
        </div>

        <div className="bwp-container">
          <div className="bwp-nav-container">
            <button
              onClick={() => handleDayScroll('left')}
              className="bwp-nav-arrow"
            >
              <FaArrowLeft />
            </button>
            <div className="bwp-day-list" ref={dayListRef}>
              {workoutData.map((plan) => (
                <button
                  key={plan.day}
                  data-day={plan.day}
                  onClick={() => handleDayChange(plan.day)}
                  className={`bwp-day-item ${plan.day === currentDay ? 'bwp-active' : ''}`}
                >
                  Day {plan.day}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleDayScroll('right')}
              className="bwp-nav-arrow"
            >
              <FaArrowRight />
            </button>
          </div>

          <div className="bwp-details-section">
            <div className="bwp-summary-card">
              <h2>Day {planForToday.day}: {planForToday.title}</h2>
            </div>

            <div className="bwp-exercise-list">
              {planForToday.exercises.length > 0 ? (
                planForToday.exercises.map((exercise, index) => {
                  return (
                  <div key={index} className="bwp-exercise-card">
                    <img src={exercise.imageSrc || "/assets/exercises/plank.jpg"} alt={exercise.name} className="bwp-exercise-image" />
                    <div className="bwp-exercise-info">
                      <h3 className="bwp-exercise-title">{exercise.name}</h3>
                      <p>
                        <strong>Sets:</strong> {exercise.sets} | <strong>Reps:</strong> {exercise.reps}
                      </p>
                      <p className="bwp-exercise-equipment">
                        <strong>Equipment:</strong> {exercise.equipment}
                      </p>
                      <a href={exercise.videoLink} target="_blank" rel="noopener noreferrer" className="bwp-video-link">
                        <FaYoutube /> Watch Video
                      </a>
                      <button 
                        className="bwp-chatgpt-explain-button" 
                        onClick={() => getChatGptExplanation(exercise.name)}
                      >
                        <FaMagic /> Explain Exercise
                      </button>
                    </div>
                  </div>
                );
              })
              ) : (
                <div className="bwp-rest-day-card">
                    <p>It's a rest day! Focus on stretching, light cardio, or just recovering. Listen to your body and prepare for your next workout.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Explanation Modal */}
        {showExplanationModal && (
          <div className="bwp-explanation-modal-overlay" onClick={() => setShowExplanationModal(false)}>
            <div className="bwp-explanation-modal-content" onClick={e => e.stopPropagation()}>
              <h3>ChatGPT Explanation</h3>
              {explanationLoading ? (
                <p>Loading explanation...</p>
              ) : explanationError ? (
                <p className="bwp-error-message">{explanationError}</p>
              ) : (
                <p className="bwp-explanation-text">{currentExplanation}</p>
              )}
              <button className="bwp-modal-close-button" onClick={() => setShowExplanationModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
  );
};

export default BeginnerWorkoutPlan;
