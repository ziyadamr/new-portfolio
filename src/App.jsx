import React, { useState, useEffect, useRef } from "react";
import "./index.css";

// ==========================================
// 🌟 المكون السحري (الأنيميشن) 🌟
// ==========================================
function RevealOnScroll({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ==========================================
// 🌟 لوحة التحكم 🌟
// ==========================================
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("messages");
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [experiences, setExperiences] = useState([]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tech_stack: "",
    link: "",
    image_url: "",
  });
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    icon: "",
  });
  const [newExp, setNewExp] = useState({
    title: "",
    company: "",
    period: "",
    description: "",
  });

  const ADMIN_USERNAME = "ziyad";
  const ADMIN_PASSWORD = "ziyad";

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setErrorMsg("Invalid Username or Password.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [msgRes, projRes, srvRes, expRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/messages/"),
        fetch("http://127.0.0.1:8000/api/projects/"),
        fetch("http://127.0.0.1:8000/api/services/"),
        fetch("http://127.0.0.1:8000/api/experiences/"),
      ]);
      setMessages(await msgRes.json());
      setProjects(await projRes.json());
      setServices(await srvRes.json());
      setExperiences(await expRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const saveItem = async (endpoint, item, setItemState, defaultState) => {
    const url = editingId
      ? `http://127.0.0.1:8000/api/${endpoint}/${editingId}`
      : `http://127.0.0.1:8000/api/${endpoint}/`;
    const method = editingId ? "PUT" : "POST";
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      setEditingId(null);
      setItemState(defaultState);
      fetchData();
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const deleteItem = async (endpoint, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await fetch(`http://127.0.0.1:8000/api/${endpoint}/${id}`, {
          method: "DELETE",
        });
        fetchData();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="bg-slate-900/80 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl shadow-2xl relative z-10 w-full max-w-md text-center">
          <svg
            className="w-16 h-16 text-cyan-500 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-8">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="bg-slate-950 border border-gray-700 text-white p-4 rounded-xl outline-none focus:border-cyan-500"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-slate-950 border border-gray-700 text-white p-4 rounded-xl outline-none focus:border-cyan-500"
              required
            />
            {errorMsg && (
              <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>
            )}
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl"
            >
              Login
            </button>
          </form>
          {/* 👈 تم إرجاع زر العودة للموقع هنا */}
          <a href="#" className="block mt-6 text-sm text-gray-500 hover:text-cyan-400">Return to Website</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex">
      <aside className="w-64 bg-slate-900 border-r border-gray-800 p-6 hidden md:flex flex-col gap-4">
        <div className="text-2xl font-bold text-cyan-400 mb-8">ADMIN.PANEL</div>
        {["messages", "projects", "services", "experiences"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setEditingId(null);
            }}
            className={`text-left px-4 py-3 rounded-xl capitalize transition-colors ${
              activeTab === tab
                ? "bg-cyan-600/20 text-cyan-400 border border-cyan-500/50"
                : "text-gray-400 hover:bg-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
        <a
          href="#"
          className="mt-auto text-center py-3 bg-slate-800 rounded-xl text-gray-300"
        >
          Back to Website
        </a>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === "messages" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Inbox Messages</h1>
            <div className="bg-slate-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-gray-400 uppercase text-sm">
                  <tr>
                    <th className="p-5">Name</th>
                    <th className="p-5">Email</th>
                    <th className="p-5 w-1/2">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {messages
                    .slice()
                    .reverse()
                    .map((msg, i) => (
                      <tr key={i} className="hover:bg-slate-800/30">
                        <td className="p-5">{msg.name}</td>
                        <td className="p-5 text-cyan-400">{msg.email}</td>
                        <td className="p-5">{msg.message}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "projects" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Projects Manager</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveItem("projects", newProject, setNewProject, {
                  title: "",
                  description: "",
                  tech_stack: "",
                  link: "",
                  image_url: "",
                });
              }}
              className="bg-slate-900/60 border border-gray-800 p-8 rounded-2xl mb-8 flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Tech Stack"
                  value={newProject.tech_stack}
                  onChange={(e) =>
                    setNewProject({ ...newProject, tech_stack: e.target.value })
                  }
                  className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Link URL"
                  value={newProject.link}
                  onChange={(e) =>
                    setNewProject({ ...newProject, link: e.target.value })
                  }
                  className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProject.image_url}
                  onChange={(e) =>
                    setNewProject({ ...newProject, image_url: e.target.value })
                  }
                  className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <textarea
                placeholder="Description"
                rows="3"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-cyan-600 py-3 rounded-xl font-bold"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </form>
            <div className="grid grid-cols-2 gap-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-800/50 p-4 rounded-xl border border-gray-700 flex justify-between items-center"
                >
                  <span className="font-bold">{p.title}</span>
                  <div>
                    <button
                      onClick={() => {
                        setNewProject(p);
                        setEditingId(p.id);
                      }}
                      className="text-blue-400 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem("projects", p.id)}
                      className="text-red-400"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "services" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Services Manager</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveItem("services", newService, setNewService, {
                  title: "",
                  description: "",
                  icon: "",
                });
              }}
              className="bg-slate-900/60 border border-gray-800 p-8 rounded-2xl mb-8 flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Title (e.g. AI Dev)"
                value={newService.title}
                onChange={(e) =>
                  setNewService({ ...newService, title: e.target.value })
                }
                className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Icon Class (e.g. fa-solid fa-robot)"
                value={newService.icon}
                onChange={(e) =>
                  setNewService({ ...newService, icon: e.target.value })
                }
                className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                required
              />
              <textarea
                placeholder="Description"
                rows="3"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
                className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-cyan-600 py-3 rounded-xl font-bold"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </form>
            <div className="grid grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-800/50 p-4 rounded-xl border border-gray-700 flex justify-between items-center"
                >
                  <span className="font-bold">
                    <i className={`${s.icon} mr-2`}></i> {s.title}
                  </span>
                  <div>
                    <button
                      onClick={() => {
                        setNewService(s);
                        setEditingId(s.id);
                      }}
                      className="text-blue-400 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem("services", s.id)}
                      className="text-red-400"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "experiences" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Experience Manager</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveItem("experiences", newExp, setNewExp, {
                  title: "",
                  company: "",
                  period: "",
                  description: "",
                });
              }}
              className="bg-slate-900/60 border border-gray-800 p-8 rounded-2xl mb-8 flex flex-col gap-4"
            >
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={newExp.title}
                  onChange={(e) =>
                    setNewExp({ ...newExp, title: e.target.value })
                  }
                  className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newExp.company}
                  onChange={(e) =>
                    setNewExp({ ...newExp, company: e.target.value })
                  }
                  className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Period"
                  value={newExp.period}
                  onChange={(e) =>
                    setNewExp({ ...newExp, period: e.target.value })
                  }
                  className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <textarea
                placeholder="Role Description"
                rows="3"
                value={newExp.description}
                onChange={(e) =>
                  setNewExp({ ...newExp, description: e.target.value })
                }
                className="bg-slate-950 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-cyan-600 py-3 rounded-xl font-bold"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </form>
            <div className="grid grid-cols-2 gap-4">
              {experiences.map((e) => (
                <div
                  key={e.id}
                  className="bg-slate-800/50 p-4 rounded-xl border border-gray-700 flex justify-between items-center"
                >
                  <span className="font-bold">
                    {e.title} @ {e.company}
                  </span>
                  <div>
                    <button
                      onClick={() => {
                        setNewExp(e);
                        setEditingId(e.id);
                      }}
                      className="text-blue-400 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem("experiences", e.id)}
                      className="text-red-400"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ==========================================
// 🌟 موقع البورتفوليو 🌟
// ==========================================
function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("idle");
  const [contactReason, setContactReason] = useState("General Inquiry");
  const [selectedService, setSelectedService] = useState("");
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [experiences, setExperiences] = useState([]);
  
  // 🌟 حالات (States) خاصة بـ AI Assistant 🌟
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: "Hello! I'm Ziyad's AI Assistant. I've read his entire CV and know all about his skills, projects, and experience. Ask me anything!" }
  ]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newUserMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: "That's a great question! Ziyad is currently working on connecting my brain to his Python backend so I can answer based on his CV. Check back soon!" 
      }]);
    }, 1000);
  };

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/projects/").then((r) => r.json()),
      fetch("http://127.0.0.1:8000/api/services/").then((r) => r.json()),
      fetch("http://127.0.0.1:8000/api/experiences/").then((r) => r.json()),
    ])
      .then(([projData, servData, expData]) => {
        setProjects(projData);
        setServices(servData);
        setExperiences(expData);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  // 👈 دالة التعامل مع ضغط زر "Request" على أي خدمة
  
  const handleServiceRequest = (serviceTitle) => {
    setContactReason("Request a Service");
    setSelectedService(serviceTitle);
    
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("loading");
    let finalMessageText = `[Reason: ${contactReason}]\n`;
    if (contactReason === "Request a Service" && selectedService)
      finalMessageText += `[Service: ${selectedService}]\n`;
    finalMessageText += `\n${formData.message}`;


    try {
      const res = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: finalMessageText,
        }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setContactReason("General Inquiry");
        setSelectedService("");
        setTimeout(() => setFormStatus("idle"), 3000);
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  const coreSkills = [
    {
      name: "Python",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    },
    {
      name: "TensorFlow",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg",
    },
    {
      name: "Scikit-Learn",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg",
    },
    {
      name: "Pandas",
      image:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg",
    },
  ];
  const additionalSkills = [
    "C++",
    "NumPy",
    "Matplotlib",
    "Git & GitHub",
    "Docker",
  ];

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden space-bg">
      <div className="star-container" style={{ top: "-10%", right: "10%" }}>
        <div className="star" style={{ animationDelay: "0s" }}></div>
      </div>
      <div className="star-container" style={{ top: "-10%", right: "50%" }}>
        <div className="star" style={{ animationDelay: "1.2s" }}></div>
      </div>
      <div className="star-container" style={{ top: "20%", right: "-10%" }}>
        <div className="star" style={{ animationDelay: "2.5s" }}></div>
      </div>

      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-6 bg-slate-950/80 backdrop-blur-lg border-b border-gray-800 transition-all duration-300">
        <div className="flex-1 text-2xl font-bold text-cyan-400 tracking-wider">
          ZIYAD<span className="text-white">.AI</span>
        </div>
        <div className="hidden lg:flex gap-6 text-gray-300 font-medium justify-center flex-none">
          {[
            "About",
            "Education",
            "Skills",
            "Experience",
            "Projects",
            "Services",
            "Contact",
          ].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-cyan-400 transition duration-300"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex-1 flex justify-end lg:block">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-cyan-400 focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main
        id="about"
        className="flex flex-col items-center justify-center text-center px-4 pt-40 pb-20 min-h-[90vh] relative z-10 scroll-mt-32"
      >
        <RevealOnScroll>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 text-sm font-semibold mb-8 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            Available for new opportunities
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl tracking-tight">
            Engineering the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              Future
            </span>
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mb-12 leading-relaxed mx-auto">
            Hello I'm <span className="text-white font-bold">Ziyad Amr</span>,
            an <span className="text-cyan-400 font-semibold">AI Engineer</span>{" "}
            driven by the challenge of turning complex data into intelligent
            solutions. I specialize in building scalable AI systems that don't
            just process information, but solve real-world problems with
            precision and efficiency.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={400}>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-4">
            <a
              href="/Ziyad_Amr_CV.pdf"
              download="Ziyad_Amr_CV.pdf"
              className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-lg rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:-translate-y-1 group"
            >
              <svg
                className="w-6 h-6 group-hover:animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download CV
            </a>
            <a
              href="https://github.com/ziyadamr"
              target="_blank"
              rel="noreferrer"
              title="GitHub Profile"
              className="w-16 h-16 bg-slate-800/80 hover:bg-slate-800 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-400 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:-translate-y-1 group backdrop-blur-sm"
            >
              <i class="fa-brands fa-github fa-2xl fa-canvas-square"></i>
            </a>
          </div>
        </RevealOnScroll>
      </main>

      {/* Education */}
      <section
        id="education"
        className="w-full max-w-5xl mx-auto px-4 py-16 relative z-10 scroll-mt-32"
      >
        <RevealOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Education</span>
            </h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <div className="bg-slate-900/40 backdrop-blur-md border border-gray-800 p-8 md:p-10 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-500">
            <span className="text-cyan-400 font-semibold tracking-widest text-sm mb-3 block uppercase">
              2024 - 2028
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Bachelor of Computer Science
            </h3>
            <h4 className="text-lg text-gray-400">
              Misr Higher Institute for Commerce & Computers (MET)
            </h4>
          </div>
        </RevealOnScroll>
      </section>

      {/* Skills */}
      <section
        id="skills"
        className="w-full max-w-5xl mx-auto px-4 py-16 relative z-10 scroll-mt-32"
      >
        <RevealOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Technical{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Skills
              </span>
            </h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {coreSkills.map((skill, index) => (
            <RevealOnScroll key={index} delay={index * 150}>
              <div className="group bg-slate-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-2xl flex flex-col items-center hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:-translate-y-2 cursor-default h-full">
                <img
                  src={skill.image}
                  alt={skill.name}
                  className="w-16 h-16 mb-6 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-none group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
                <h3 className="text-lg md:text-xl font-semibold text-gray-300 group-hover:text-cyan-300 transition-colors duration-300">
                  {skill.name}
                </h3>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        <RevealOnScroll delay={600}>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-3xl mx-auto">
            {additionalSkills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-slate-800/50 border border-gray-700 text-gray-300 rounded-full text-sm md:text-base hover:bg-cyan-900/30 hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-300 cursor-default shadow-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* Experience */}
      <section
        id="experience"
        className="w-full max-w-5xl mx-auto px-4 py-16 relative z-10 scroll-mt-32"
      >
        <RevealOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Experience</span>
            </h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          </div>
        </RevealOnScroll>
        {experiences.length === 0 ? (
          <RevealOnScroll delay={200}>
            <div className="text-center text-gray-500 border border-dashed border-gray-700 rounded-2xl p-10">
              No experiences added yet.
            </div>
          </RevealOnScroll>
        ) : (
          <div className="flex flex-col gap-6 relative border-l-2 border-cyan-900 ml-4 md:ml-10">
            {experiences.slice().reverse().map((exp, i) => (
              <RevealOnScroll key={exp.id} delay={i * 150}>
                <div className="relative pl-8 md:pl-12">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                  <div className="bg-slate-900/40 backdrop-blur-md border border-gray-800 p-6 md:p-8 rounded-2xl hover:border-cyan-500/50 transition-colors">
                    <span className="text-cyan-400 font-bold block mb-2">
                      {exp.period}
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      {exp.title}
                    </h3>
                    <h4 className="text-lg text-gray-400 mb-4">
                      {exp.company}
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="w-full max-w-6xl mx-auto px-4 py-16 relative z-10 scroll-mt-32"
      >
        <RevealOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Projects</span>
            </h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          </div>
        </RevealOnScroll>
        {projects.length === 0 ? (
          <RevealOnScroll delay={200}>
            <div className="text-center text-gray-500 border border-dashed border-gray-700 rounded-2xl p-10">
              No projects added yet.
            </div>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice().reverse().map((proj, index) => (
              <RevealOnScroll key={proj.id} delay={index * 150}>
                <div className="group bg-slate-900/40 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl hover:border-cyan-500/50 transition-all flex flex-col h-full">
                  {proj.image_url && (
                    <div className="w-full h-48 mb-6 overflow-hidden rounded-xl border border-gray-700/50">
                      <img
                        src={proj.image_url}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {proj.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {proj.tech_stack &&
                      proj.tech_stack.split(",").map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-slate-800 text-cyan-300 text-xs font-semibold rounded-full"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                  </div>
                  <a
                    href={
                      proj.link && proj.link.startsWith("http")
                        ? proj.link
                        : `https://${proj.link}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-center w-full bg-slate-800 hover:bg-cyan-600 text-white font-semibold py-3 rounded-xl transition-colors mt-auto"
                  >
                    View Project
                  </a>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </section>

      {/* Services */}
      <section
        id="services"
        className="w-full max-w-5xl mx-auto px-4 py-16 relative z-10 scroll-mt-32"
      >
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Services</span>
            </h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          </div>
        </RevealOnScroll>
        {services.length === 0 ? (
          <RevealOnScroll delay={200}>
            <div className="text-center text-gray-500 border border-dashed border-gray-700 rounded-2xl p-10">
              No services added yet.
            </div>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((srv, index) => (
              <RevealOnScroll key={srv.id} delay={index * 200}>
                <div className="group bg-slate-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-2xl hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row items-center sm:items-start gap-6 h-full text-center sm:text-left">
                  <div className="w-16 h-16 shrink-0 bg-slate-800/80 rounded-2xl flex items-center justify-center border border-gray-700 group-hover:border-cyan-400 group-hover:bg-cyan-900/20 transition-all duration-300 text-gray-400 group-hover:text-cyan-400">
                    <i
                      className={`${srv.icon} text-3xl transition-colors duration-300`}
                    ></i>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-200 mb-3 group-hover:text-cyan-300 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {srv.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleServiceRequest(srv.title)}
                    className="w-full sm:w-auto py-3 px-6 bg-slate-800/50 hover:bg-cyan-600 text-cyan-400 hover:text-white rounded-xl border border-cyan-900/30 hover:border-transparent transition-all mt-auto sm:mt-0 font-semibold whitespace-nowrap cursor-pointer"
                  >
                    Request
                  </button>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="w-full max-w-4xl mx-auto px-4 py-20 relative z-10 scroll-mt-32"
      >
        <RevealOnScroll>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-gray-800 p-8 md:p-14 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/10 blur-[80px] pointer-events-none"></div>
            <div className="text-center mb-10 relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Get In{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                  Touch
                </span>
              </h2>
              <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10 relative z-10">
              <a
                href="mailto:ziyadamr20@gmail.com"
                title="Email Me"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-950/60 border border-gray-800 text-cyan-500 hover:bg-cyan-900/30 hover:border-cyan-500 hover:text-cyan-400 transition-all shadow-lg group"
              >
                <i class="fa-solid fa-envelope fa-lg"></i>
              </a>
              <a
                href="https://wa.me/+201552786868"
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-950/60 border border-gray-800 text-green-500 hover:bg-green-900/30 hover:border-green-500 hover:text-green-400 transition-all shadow-lg group"
              >
                <i class="fa-brands fa-whatsapp fa-xl"></i>
              </a>
              <a
                href="https://linkedin.com/in/ziyadamr/"
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-950/60 border border-gray-800 text-blue-500 hover:bg-blue-900/30 hover:border-blue-500 hover:text-blue-400 transition-all shadow-lg group"
              >
                <i class="fa-brands fa-linkedin fa-lg"></i>
              </a>
              <a
                href="https://github.com/ziyadamr"
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-950/60 border border-gray-800 text-gray-300 hover:bg-gray-800/30 hover:border-gray-500 hover:text-white transition-all shadow-lg group"
              >
                <i class="fa-brands fa-github fa-xl"></i>
              </a>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-6 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Name"
                  className="w-full bg-slate-950/60 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500 text-white"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email"
                  className="w-full bg-slate-950/60 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500 text-white"
                  required
                />
              </div>
              <div
                className={`grid grid-cols-1 ${
                  contactReason === "Request a Service" ? "md:grid-cols-2" : ""
                } gap-6`}
              >
                <select
                  value={contactReason}
                  onChange={(e) => setContactReason(e.target.value)}
                  className="w-full bg-slate-950/60 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500 text-gray-300"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  {services.length > 0 && (
                    <option value="Request a Service">Request a Service</option>
                  )}
                  <option value="Project Collaboration">
                    Project Collaboration
                  </option>
                  <option value="Other">Other</option>
                </select>
                {contactReason === "Request a Service" && (
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-slate-950/60 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500 text-gray-300"
                    required
                  >
                    <option value="" disabled>
                      Select a Service...
                    </option>
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.title}>
                        {srv.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder="Your Message..."
                rows="4"
                className="w-full bg-slate-950/60 border border-gray-700 p-4 rounded-xl outline-none focus:border-cyan-500 resize-none text-white"
                required
              ></textarea>
              <button
                type="submit"
                disabled={formStatus !== "idle"}
                className={`w-full font-bold py-4 rounded-xl transition-all ${
                  formStatus === "idle"
                    ? "bg-cyan-600 text-white hover:bg-cyan-500"
                    : formStatus === "loading"
                    ? "bg-gray-600 text-gray-300"
                    : formStatus === "success"
                    ? "bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    : "bg-red-600 text-white"
                }`}
              >
                {formStatus === "idle"
                  ? "SEND MESSAGE"
                  : formStatus === "loading"
                  ? "SENDING..."
                  : formStatus === "success"
                  ? "SENT SUCCESSFULLY!"
                  : "ERROR - TRY AGAIN"}
              </button>
            </form>
          </div>
        </RevealOnScroll>
      </section>

      {/* ========================================== */}
      {/* 🌟 نافذة دردشة الـ AI Assistant 🌟 */}
      {/* ========================================== */}
      {isChatOpen && (
        <div className="fixed bottom-28 right-8 w-[90vw] max-w-[380px] h-[500px] bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(0,174,239,0.2)] flex flex-col z-50 overflow-hidden animate-fade-in">
          
          {/* رأس النافذة (Header) */}
          <div className="bg-slate-800 p-4 border-b border-gray-700 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h3 className="font-bold text-white leading-tight">Ziyad's AI Assistant</h3>
                <span className="text-xs text-cyan-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700">
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>

          {/* منطقة الرسائل */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 space-bg">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'ai' ? 'bg-slate-800 border border-gray-700 text-gray-200 rounded-tl-none self-start shadow-md' : 'bg-cyan-600 text-white rounded-tr-none self-end shadow-md'}`}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* منطقة الكتابة (Input) */}
          <form onSubmit={handleChatSubmit} className="p-3 bg-slate-800 border-t border-gray-700 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask me about Ziyad's skills..." 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-xl outline-none border border-gray-700 focus:border-cyan-500 transition-colors text-sm"
            />
            <button type="submit" disabled={!chatInput.trim()} className="bg-cyan-600 disabled:bg-gray-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-cyan-500 transition-colors disabled:cursor-not-allowed shadow-lg">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      {/* ========================================== */}
      {/* 🌟 زر المساعد الذكي 🌟 */}
      {/* ========================================== */}
      <div 
        onClick={() => setIsChatOpen(!isChatOpen)} 
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#00AEEF] rounded-full shadow-[0_0_20px_rgba(0,174,239,0.5)] cursor-pointer hover:scale-110 hover:shadow-[0_0_30px_rgba(0,174,239,0.8)] transition-all duration-300 z-50 flex items-center justify-center group text-white"
      >
        <i className="fa-solid fa-robot text-3xl custom-float"></i>
        
        {!isChatOpen && (
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-800 text-cyan-300 text-sm font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap shadow-xl border border-cyan-500/30">
            Ask Ziyad's AI Assistant
          </span>
        )}
      </div>
    </div>
  );
}

// ==========================================
// التوجيه (App Router)
// ==========================================
export default function AppRouter() {
  const [currentView, setCurrentView] = useState("portfolio");

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#admin") setCurrentView("admin");
      else setCurrentView("portfolio");
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  return currentView === "admin" ? <AdminDashboard /> : <Portfolio />;
}