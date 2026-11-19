import { useEffect, useRef, useState } from "react";
import "./App.css";

const dayToday = (new Date().getDay() + 6) % 7;
const days = ["Du", "Se", "Cho", "Pa", "Ju", "Sha", "Ya"];

const initialTasks = [
  { id: 1, title: "Portfolio dizaynini yakunlash", project: "Portfolio", time: "09:30", done: false, day: dayToday },
  { id: 2, title: "Ingliz tilidan 20 ta so‘z o‘rganish", project: "O‘qish", time: "11:00", done: true, day: dayToday },
  { id: 3, title: "Haftalik rejani ko‘rib chiqish", project: "Shaxsiy", time: "14:00", done: false, day: dayToday },
];

function readTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem("rejaflow-tasks"));
    if (!Array.isArray(saved)) return initialTasks;
    return saved.map((task) => ({ ...task, day: task.day ?? dayToday }));
  } catch {
    return initialTasks;
  }
}

export default function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [habits, setHabits] = useState([
    { id: 1, name: "Ertalabki badantarbiya", icon: "🏃", done: true },
    { id: 2, name: "20 daqiqa kitob o‘qish", icon: "📖", done: false },
    { id: 3, name: "Kunlik reja tuzish", icon: "✍️", done: false },
  ]);
  const [projects, setProjects] = useState(["Portfolio", "O‘qish", "Shaxsiy"]);
  const [text, setText] = useState("");
  const [selectedDay, setSelectedDay] = useState(dayToday);
  const [active, setActive] = useState("Umumiy ko‘rinish");
  const [toast, setToast] = useState("");

  const overviewRef = useRef(null);
  const tasksRef = useRef(null);
  const projectsRef = useRef(null);
  const habitsRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("rejaflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function notify(message) {
    setToast(message);
    window.clearTimeout(window.rejaFlowToast);
    window.rejaFlowToast = window.setTimeout(() => setToast(""), 2200);
  }

  function navigate(name, ref) {
    setActive(name);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function addTask(event) {
    event.preventDefault();
    const title = text.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      { id: Date.now(), title, project: "Shaxsiy", time: "Bugun", done: false, day: selectedDay },
    ]);
    setText("");
    notify("Vazifa qo‘shildi!");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) => task.id === id ? { ...task, done: !task.done } : task)
    );
  }

  function removeTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
    notify("Vazifa o‘chirildi");
  }

  function toggleHabit(id) {
    setHabits((current) =>
      current.map((habit) => habit.id === id ? { ...habit, done: !habit.done } : habit)
    );
  }

  function addProject() {
    const name = window.prompt("Yangi loyiha nomi:");
    if (!name?.trim()) return;
    setProjects((current) => [...current, name.trim()]);
    notify("Loyiha qo‘shildi!");
  }

  function removeProject(name) {
    setProjects((current) => current.filter((project) => project !== name));
    notify("Loyiha o‘chirildi");
  }

  const doneCount = tasks.filter((task) => task.done).length;
  const visibleTasks = tasks.filter((task) => task.day === selectedDay);
  const dateText = new Intl.DateTimeFormat("uz-UZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const menu = [
    ["◫", "Umumiy ko‘rinish", overviewRef],
    ["☑️", "Vazifalar", tasksRef],
    ["▦", "Loyihalar", projectsRef],
    ["◷", "Odatlar", habitsRef],
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); navigate(menu[0][1], overviewRef); }}>
          <span className="brand-mark">r</span>
          <span>RejaFlow<span className="brand-dot">.</span></span>
        </a>


        <div className="workspace">
          <span className="workspace-icon">✦</span>
          <span><b>Shaxsiy makon</b><small>Boshqaruv paneli</small></span>
          <span className="workspace-arrow">⌄</span>
        </div>

        <p className="side-label">ISH MAYDONI</p>
        <nav className="navigation">
          {menu.map(([icon, name, ref]) => (
            <button
              key={name}
              className={`nav-item ${active === name ? "active" : ""}`}
              onClick={() => navigate(name, ref)}
            >
              <span className="nav-icon">{icon}</span>
              {name}
              {name === "Vazifalar" && <span className="nav-count">{tasks.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="tip-card">
            <span className="tip-star">✳️</span>
            <b>Kichik qadamlar,<br />katta natijalar.</b>
            <p>Bugun maqsading sari bir qadam tashla.</p>
          </div>
          <div className="profile">
            <span className="avatar">A</span>
            <span><b>Alisher</b><small>Shaxsiy hisob</small></span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>Ish maydoni <span>/</span> <b>{active}</b></div>
          <button className="user-avatar" onClick={() => notify("Profil: Azizbek")} aria-label="Profil">A</button>
        </header>

        <div className="content" ref={overviewRef}>
          <section className="welcome">
            <div>
              <div className="date-label">{dateText}</div>
              <h1>Xayrli kun, Alisher <span>✦</span></h1>
              <p>Rejalaringni tartibga sol, maqsadlaringga yaqinlash.</p>
            </div>
            <button className="primary-button" onClick={() => navigate("Vazifalar", tasksRef)}>
              ＋ Yangi vazifa
            </button>
          </section>

          <section className="stats">
            <article className="card stat-card">
              <span className="stat-icon purple">◈</span>
              <p>Bajarilgan vazifalar</p>
              <strong>{doneCount}<small> / {tasks.length}</small></strong>
              <div className="progress"><span style={{ width: `${tasks.length ? doneCount / tasks.length * 100 : 0}%` }} /></div>
            </article>
            <article className="card stat-card">
              <span className="stat-icon orange">♨️</span>
              <p>Faollik zanjiri</p><strong>5<small> kun</small></strong>
              <div className="stat-note">Ajoyib ritmda ketyapsan!</div>
            </article>
            <article className="card stat-card">
              <span className="stat-icon green">◷</span>
              <p>Fokus vaqti</p><strong>3.5<small> soat</small></strong>
              <div className="stat-note">Haftalik maqsad: 20 soat</div>
            </article>
            <article className="card quote-card">
              <span className="quote-mark">“</span>
              <p>Intizom — maqsadlar va natijalar orasidagi ko‘prik.</p>
              <small>— Jim Ron</small>
            </article>
          </section>

          <section className="dashboard">
            <article className="card panel" ref={tasksRef}>
              <div className="panel-heading">
                <div><h2>Vazifalar</h2><p>Tanlangan kun uchun vazifalar</p></div>
                <span className="muted">{visibleTasks.length} ta</span>
              </div>

              <form className="task-form" onSubmit={addTask}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Yangi vazifa yoz..." />
                <button type="submit">Qo‘shish</button>
              </form>


              {visibleTasks.length ? visibleTasks.map((task) => (
                <div className={`task-row ${task.done ? "is-done" : ""}`} key={task.id}>
                  <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                  <div className="task-copy"><b>{task.title}</b><small>{task.project}</small></div>
                  <span className="task-time">{task.time}</span>
                  <button className="delete-task" onClick={() => removeTask(task.id)} aria-label="O‘chirish">×</button>
                </div>
              )) : <p className="empty-state">Bu kunda vazifa yo‘q. Yangi vazifa qo‘sh!</p>}
            </article>

            <article className="card panel">
              <div className="panel-heading">
                <div><h2>Haftalik reja</h2><p>Kun tanlash uchun bosing</p></div>
                <span className="muted">Shu hafta</span>
              </div>
              <div className="week">
                {days.map((day, index) => (
                  <button
                    key={day}
                    className={`day ${selectedDay === index ? "selected" : ""}`}
                    onClick={() => setSelectedDay(index)}
                  >
                    <small>{day}</small><b>{dateNumber(index)}</b>
                    {tasks.some((task) => task.day === index) && <i />}
                  </button>
                ))}
              </div>
              <div className="agenda-title">Tanlangan kun <span>{visibleTasks.length} ta vazifa</span></div>
              {visibleTasks.slice(0, 3).map((task) => (
                <div className="agenda-row" key={task.id}>
                  <i /><span><b>{task.title}</b><small>{task.project}</small></span>
                  <small className="agenda-time">{task.time}</small>
                </div>
              ))}
            </article>

            <article className="card panel" ref={habitsRef}>
              <div className="panel-heading">
                <div><h2>Odatlarim</h2><p>Har kuni davom et</p></div>
                <span className="muted">{habits.filter((h) => h.done).length}/{habits.length}</span>
              </div>
              {habits.map((habit) => (
                <div className="habit-row" key={habit.id}>
                  <span className="habit-icon">{habit.icon}</span><b>{habit.name}</b>
                  <button className={`habit-check ${habit.done ? "checked" : ""}`} onClick={() => toggleHabit(habit.id)}>
                    {habit.done ? "✓" : ""}
                  </button>
                </div>
              ))}
            </article>

            <article className="card panel" ref={projectsRef}>
              <div className="panel-heading">
                <div><h2>Loyihalar</h2><p>Loyihalaringni boshqar</p></div>
                <button className="add-project" onClick={addProject} aria-label="Loyiha qo‘shish">＋</button>
              </div>
              {projects.map((project, index) => (
                <div className="project-row" key={project}>
                  <i className={`project-dot ${["violet", "orange", "green"][index % 3]}`} />
                  <span><b>{project}</b><small>Loyiha</small></span>
                  <button className="delete-task" onClick={() => removeProject(project)} aria-label={`${project} loyihasini o‘chirish`}>×</button>
                </div>
              ))}
            </article>
          </section>
          <footer>Yaxshi kunlar, yaxshi odatlardan boshlanadi. <span>♡</span></footer>
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function dateNumber(index) {
  const date = new Date();
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7) + index);
  return date.getDate();
}
