'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiGithub, FiLinkedin, FiCalendar, FiMapPin, FiCheck, FiCpu, FiUsers, FiZap, FiTarget, FiMail, FiInstagram, FiShare2 } from 'react-icons/fi';
import Loader from '@/components/Loader';
import NetworkGlobe from '@/components/NetworkGlobe';

// Interfaces
interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  category: string;
  department: string;
  year: string;
  photoUrl: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  registrationLink?: string;
  registrationCount?: number;
}

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

interface TestimonialItem {
  _id: string;
  name: string;
  role: string;
  message: string;
  avatarUrl?: string;
}

const BACKEND_URL = 'http://localhost:5000';

const FALLBACK_TEAM: TeamMember[] = [
  {
    _id: 'team_002',
    name: 'Prof. U. M. Kalshetti',
    designation: 'HOD (Computer Department)',
    category: 'coordinator',
    department: 'Computer Department',
    year: 'Staff',
    photoUrl: '/team/page_4_img_2.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/urmila-kalshetti-3507669a/'
  },
  {
    _id: 'team_001',
    name: 'Dr. S. H. Patil',
    designation: 'Faculty Coordinator',
    category: 'coordinator',
    department: 'Computer Department',
    year: 'Staff',
    photoUrl: '/team/page_4_img_1.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/dr-seema-patil-22b704325/'
  },
  {
    _id: 'team_003',
    name: 'Gauri Kharad',
    designation: 'President',
    category: 'president',
    department: 'Computer Department',
    year: 'B.E',
    photoUrl: '/team/page_3_img_1.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/gauri-kharad-136365298/',
    githubUrl: 'https://github.com'
  },
  {
    _id: 'team_004',
    name: 'Pratika Bankar',
    designation: 'Vice President',
    category: 'vice-president',
    department: 'Computer Department',
    year: 'T.E',
    photoUrl: '/team/page_5_img_1.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/pratikabankar/',
    githubUrl: 'https://github.com'
  },
  {
    _id: 'team_005',
    name: 'Nehal Rawool',
    designation: 'Technical Head',
    category: 'technical',
    department: 'Computer Department',
    year: 'S.Y Btech',
    photoUrl: '/team/page_6_img_1.jpeg',
    linkedinUrl: ' https://www.linkedin.com/in/nehal-rawool-461602417/',
    githubUrl: 'https://github.com/nehalrawool'
  },
  {
    _id: 'team_006',
    name: 'Vedant Patil',
    designation: 'Technical Head',
    category: 'technical',
    department: 'Computer Department',
    year: 'S.Y Btech',
    photoUrl: '/team/page_6_img_2.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/vedant-patil-286944382/',
    githubUrl: 'https://github.com/VedantPatil24-coder'
  },
  {
    _id: 'team_007',
    name: 'Shreyasi Jadhav',
    designation: 'Design Head',
    category: 'design',
    department: 'Computer Department',
    year: 'S.Y Btech',
    photoUrl: '/team/page_2_img_1.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/shreyasi-jadhao-167427384/',
    githubUrl: 'https://github.com/shreyaasijadhao'
  },
  {
    _id: 'team_008',
    name: 'Sharvee Kulkarni',
    designation: 'Design Head',
    category: 'design',
    department: 'Computer Department',
    year: 'S.Y Btech',
    photoUrl: '/team/page_2_img_2.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/sharvee-kulkarni-635a5a391/',
    githubUrl: 'https://github.com/SharveeK10'
  },
  {
    _id: 'team_009',
    name: 'Salil Bokil',
    designation: 'Event & Publicity Head',
    category: 'publicity',
    department: 'Computer Department',
    year: 'S.Y Btech',
    photoUrl: '/team/page_1_img_1.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/bsalil/',
    githubUrl: 'https://github.com/bs4lil'
  },
  {
    _id: 'team_010',
    name: 'Bhumika Gote',
    designation: 'Event & Publicity Head',
    category: 'publicity',
    department: 'Computer Department',
    year: 'S.Y Btech',
    photoUrl: '/team/page_1_img_2.jpeg',
    linkedinUrl: ' https://www.linkedin.com/in/bhumika-gote-455030386/',
    githubUrl: 'https://github.com/Bhumika257'
  },
  {
    _id: 'team_011',
    name: 'Meet Shrishrimal',
    designation: 'Finance Head',
    category: 'finance',
    department: 'Computer Department',
    year: 'S.Y Btech',
    photoUrl: '/team/page_7_img_1.jpeg',
    linkedinUrl: ' https://www.linkedin.com/in/meet-shrishrimal-237a8441a/',
    githubUrl: 'https://github.com/meetshrishrimal70-afk'
  },
  {
    _id: 'team_012',
    name: 'Om Kashid',
    designation: 'Finance Head',
    category: 'finance',
    department: 'Computer Department',
    year: 'S.Y Btech',
    photoUrl: '/team/page_7_img_2.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/om-kashid-880935397/',
    githubUrl: 'https://github.com/omkashid96'
  }
];

const CALENDAR_EVENTS = [
  {
    code: '00',
    title: 'INAUGURATION',
    time: 'TODAY',
    description: 'Official establishment of the CSI PVG Student Chapter. Joining forces to transition traditional engineering into dynamic technology leadership.',
    tags: []
  },
  {
    code: '01',
    title: 'SYNTAX SWEEP',
    time: 'SEPTEMBER',
    description: '250 lines of broken code. One ticking clock. Zero mercy. Hunt the bugs, patch the chaos, and ship it clean before time runs out. Only the sharpest debuggers walk away champions.',
    tags: []
  },
  {
    code: '02',
    title: 'IDEATHON',
    time: 'OCTOBER',
    description: 'Brainstorm, design, and prototype solutions for real-world problems in an intense collaborative format.',
    tags: ['Collaboration with ACES PVG']
  },
  {
    code: '03',
    title: 'FRONTEND DUPLICATION + CODE RECREATION',
    time: 'NOVEMBER',
    description: 'Showcase design accuracy and UI creation speed in a high-fidelity frontend cloning challenge.',
    tags: []
  },
  {
    code: '04',
    title: 'TECH SESSION + CODE MODE',
    time: 'JANUARY',
    description: 'Expert-led technical seminars covering modern architectures followed by coding drills.',
    tags: ['Online', 'Collaboration with ACES PVG']
  },
  {
    code: '05',
    title: 'ZERO CODE',
    time: 'FEBRUARY',
    description: 'An on-the-spot prompt engineering competition where students design functional web applications using AI tools in a standardized environment.',
    tags: []
  },
  {
    code: '06',
    title: 'HACKATHON',
    time: 'MARCH/APRIL',
    description: 'Our flagship hackathon where students build functional prototypes and compete before industry panels.',
    tags: ['Collaboration with ACES PVG']
  },
  {
    code: '??',
    title: 'CURRENT HORIZON',
    time: 'FURTHER DEPLOYMENTS UNCHARTED.',
    description: 'Additional workshops, secret missions, guest lectures, and newer technical modules yet to be revealed.',
    tags: []
  }
];

const FALLBACK_NEWS: NewsItem[] = [
  {
    _id: 'news_001',
    title: 'CSI Student Chapter Inauguration Ceremony',
    content: 'We cordially invite you to the official Inauguration Ceremony of the Computer Society of India (CSI) Student Chapter at PVG\'s College of Engineering and Technology and G. K. Pate (Wani) Institute of Management, Pune. Join us on 24th August 2026 at 3:30 PM in the T&P Seminar Hall as we commence this technical journey.',
    imageUrl: '/inauguration_poster.png',
    createdAt: '2026-08-22T10:00:00.000Z'
  }
];

const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads')) return `${BACKEND_URL}${url}`;
  return url;
};

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  // Dynamic state loaded from backend with robust local fallbacks
  const [team, setTeam] = useState<TeamMember[]>(FALLBACK_TEAM);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<{ [key: string]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const yBgGrid = useTransform(scrollY, [0, 3000], [0, -400]);
  const yGlobe = useTransform(scrollY, [0, 1000], [0, 180]);
  const yAbout = useTransform(scrollY, [0, 2000], [0, -100]);
  const yNews = useTransform(scrollY, [200, 2500], [0, -80]);
  const yEvents = useTransform(scrollY, [500, 3000], [0, -60]);
  const yTestimonials = useTransform(scrollY, [800, 3500], [0, -50]);
  const yTeam = useTransform(scrollY, [1200, 4500], [0, -40]);

  // Extraordinary Parallax scroll-linked effects
  const scaleHero = useTransform(scrollY, [0, 1000], [1, 0.90]);
  const opacityHero = useTransform(scrollY, [0, 350], [1, 0]);

  const scaleAbout = useTransform(scrollY, [100, 1500], [0.98, 1.02]);
  const opacityAbout = useTransform(scrollY, [200, 450], [0, 1]);

  const scaleNews = useTransform(scrollY, [200, 2000], [0.97, 1.01]);
  const rotateNews = useTransform(scrollY, [200, 2000], [1, -0.5]);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const teamRes = await fetch(`${BACKEND_URL}/api/public/team`);
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          if (Array.isArray(teamData) && teamData.length > 0) {
            setTeam(teamData);
          }
        }

        const eventsRes = await fetch(`${BACKEND_URL}/api/public/events`);
        if (eventsRes.ok) setEvents(await eventsRes.json());

        const newsRes = await fetch(`${BACKEND_URL}/api/public/news`);
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          if (Array.isArray(newsData) && newsData.length > 0) {
            setNews(newsData);
          }
        }

        const testRes = await fetch(`${BACKEND_URL}/api/public/testimonials`);
        if (testRes.ok) setTestimonials(await testRes.json());
      } catch (e) {
        console.warn('Backend server fallback trigger.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRegisterEvent = async (eventId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/public/events/${eventId}/register`, {
        method: 'POST'
      });
      if (res.ok) {
        setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
        const eventsRes = await fetch(`${BACKEND_URL}/api/public/events`);
        if (eventsRes.ok) setEvents(await eventsRes.json());
      }
    } catch (e) {
      setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
    }
  };

  // Renders a card with custom 3D mouse tilt simulation
  const TeamCard = ({ member }: { member: TeamMember }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * -20;
      const tiltY = (x / rect.width) * 20;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      const card = cardRef.current;
      if (!card) return;
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center transition-all duration-300 ease-out group hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

        {/* Avatar wrap */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/30 mb-4 bg-black/40 p-0.5 group-hover:border-cyan-400 transition-colors duration-300">
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        </div>

        <h4 className="cyber-font text-white font-bold text-base tracking-wider uppercase">
          {member.name}
        </h4>
        <p className="text-cyan-400 text-sm font-mono mb-2">{member.designation}</p>
        <p className="text-gray-300 text-sm font-sans">
          {member.department} • {member.year}
        </p>

        {/* Social interactions */}
        <div className="flex gap-4 mt-4">
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
          )}
          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <FiGithub className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    );
  };

  // Group members into categories
  const coordinators = team.filter((m) => m.category === 'coordinator');
  const presidents = team.filter((m) => m.category === 'president');
  const vicePresidents = team.filter((m) => m.category === 'vice-president');
  const technicalHeads = team.filter((m) => m.category === 'technical');
  const designHeads = team.filter((m) => m.category === 'design');
  const eventHeads = team.filter((m) => m.category === 'publicity');
  const financeHeads = team.filter((m) => m.category === 'finance');

  return (
    <>
      {showIntro ? (
        <Loader onComplete={() => setShowIntro(false)} />
      ) : (
        <main className="min-h-screen relative overflow-hidden bg-[#030303]">

          {/* Cyber backgrounds */}
          <motion.div style={{ y: yBgGrid }} className="absolute inset-0 cyber-grid-bg opacity-30 z-0 pointer-events-none" />

          {/* Ambient Glow Orbs */}
          <div className="glow-aura w-[500px] h-[500px] bg-cyan-500/10 top-[-10%] left-[-10%]" />
          <div className="glow-aura w-[600px] h-[600px] bg-purple-500/10 bottom-[20%] right-[-10%]" />

          {/* 1. HERO SECTION */}
          <section className="relative min-h-screen flex flex-col items-center justify-center z-10 px-6 pt-32 sm:pt-36 md:pt-40 pb-12 overflow-hidden bg-[#030303]">
            <motion.div style={{ y: yGlobe }} className="absolute inset-0 z-0 pointer-events-none">
              <NetworkGlobe />
            </motion.div>

            {/* Top Flyer Badges */}
            <motion.div
              style={{ y: yGlobe, opacity: opacityHero }}
              className="flex justify-between items-center w-full max-w-5xl mb-8 relative z-20"
            >
              {/* PVG Badge */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full overflow-hidden border border-white/20 flex items-center justify-center bg-white shadow-[0_0_15px_rgba(255,255,255,0.15)] shrink-0">
                <img src="/logo.png" alt="PVG Seal" className="w-[82%] h-[82%] object-contain rounded-full" />
              </div>
              {/* CSI Badge */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full overflow-hidden border border-cyan-500/30 flex items-center justify-center bg-white shadow-[0_0_15px_rgba(0,240,255,0.25)] shrink-0">
                <img src="/csi_logo.jpg" alt="CSI Logo" className="w-full h-full object-cover rounded-full" />
              </div>
            </motion.div>

            {/* Parallax Animating Wrapper */}
            <motion.div
              style={{
                y: yGlobe,
                scale: scaleHero,
                opacity: opacityHero
              }}
              className="max-w-5xl mx-auto text-center relative z-20 flex flex-col items-center"
            >
              <h1 className="cyber-font text-3xl sm:text-5xl md:text-6xl font-black tracking-wider leading-none text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-300 pb-2">
                PUNE VIDYARTHI GRIHA&apos;S
              </h1>

              <h2 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-[0.2em] mt-2 mb-1 max-w-3xl uppercase font-sans">
                College of Engineering, Technology & Management, Pune
              </h2>

              <p className="text-[10px] sm:text-xs text-cyan-300/80 font-mono tracking-wider italic mb-8 max-w-2xl px-4">
                (An Autonomous Institute Affiliated to Savitribai Phule Pune University, NAAC Grade &apos;A&apos; Cycle-3)
              </p>

              {/* Glowing High-Tech Border Box */}
              <div className="my-6 px-8 py-4 rounded-2xl border-2 border-cyan-500/40 bg-cyan-950/20 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.25),inset_0_0_15px_rgba(0,240,255,0.1)] relative">
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-cyan-400 rounded-r" />
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 bg-cyan-400 rounded-l" />
                <h3 className="cyber-font text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.2em] text-white">
                  CSI STUDENT CHAPTER
                </h3>
                <p className="text-[10px] md:text-xs text-cyan-400 tracking-[0.4em] font-mono mt-1.5 uppercase">
                  — PVG COET&M —
                </p>
              </div>

              {/* Core Values Row */}
              <div className="flex flex-wrap justify-center items-center gap-y-3 gap-x-4 md:gap-x-8 mt-6 py-4 px-6 border-t border-b border-white/5 max-w-4xl w-full">
                <div className="flex items-center gap-2 text-xs md:text-sm font-mono tracking-widest text-cyan-300 hover:text-cyan-200 transition-colors">
                  <FiCpu className="text-cyan-400 w-4 h-4 animate-pulse" /> INNOVATE
                </div>
                <div className="hidden sm:block w-[1px] h-4 bg-white/10" />
                <div className="flex items-center gap-2 text-xs md:text-sm font-mono tracking-widest text-pink-300 hover:text-pink-200 transition-colors">
                  <FiZap className="text-pink-400 w-4 h-4 animate-pulse" /> INSPIRE
                </div>
                <div className="hidden sm:block w-[1px] h-4 bg-white/10" />
                <div className="flex items-center gap-2 text-xs md:text-sm font-mono tracking-widest text-purple-300 hover:text-purple-200 transition-colors">
                  <FiShare2 className="text-purple-400 w-4 h-4" /> INTEGRATE
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <a
                  href="#events"
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-base cyber-font"
                >
                  Explore Events <FiArrowRight />
                </a>
                <a
                  href="#about"
                  className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 text-base cyber-font"
                >
                  Explore Chapter
                </a>
              </div>

              {/* Scroll Indicator */}
              <div className="mt-8 animate-bounce opacity-65 flex flex-col items-center">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-1">Scroll to Travel</span>
                <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
              </div>
            </motion.div>
          </section>

          {/* 2. ABOUT US SECTION */}
          <motion.section
            id="about"
            style={{
              y: yAbout,
              scale: scaleAbout,
              opacity: opacityAbout
            }}
            className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
          >
            {/* Holographic Scroll Tunnel Visuals */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[300px] border border-cyan-500/5 rounded-full pointer-events-none skew-y-12 animate-pulse" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="cyber-font text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-wide mb-6">
                  ABOUT CSI & PVG's COET&M
                </h2>
                <div className="space-y-6 text-gray-300 text-base sm:text-lg lg:text-[19px] leading-relaxed font-sans font-normal">
                  <p>
                    Established in July 2026 under the department of Computer Engineering, the CSI PVG Student Chapter is the official digital epicentre of technology engineering and creation in PVG&apos;s College of Engineering and Technology, Pune.
                  </p>
                  <p>
                    Our charter is straightforward: to transition traditional textbook engineering into dynamic technology leadership. We orchestrate intense bootcamps, high-stakes hackathons, deep coding encounters, and industrial collaborations, preparing over 150 student members to lead the future tech workspace.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <h5 className="cyber-font text-cyan-400 text-sm sm:text-base uppercase font-bold tracking-wider mb-2">Our Vision</h5>
                    <p className="text-gray-300 text-sm sm:text-base font-sans">To empower students to become leaders in computing technologies and drive global innovations.</p>
                  </div>
                  <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <h5 className="cyber-font text-purple-400 text-sm sm:text-base uppercase font-bold tracking-wider mb-2">Our Mission</h5>
                    <p className="text-gray-300 text-sm sm:text-base font-sans">Creating meaningful avenues for skill-development, continuous training, research support, and industrial connect.</p>
                  </div>
                </div>
              </div>

              {/* Timeline / Highlights */}
              <div className="glass-panel p-8 rounded-2xl border border-white/5 relative">
                <h3 className="cyber-font text-white text-lg sm:text-xl uppercase tracking-wider mb-6 font-bold">Timeline & Milestones</h3>
                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-cyan-500/20">
                  <div className="relative pl-8">
                    <div className="absolute left-[3px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                    <span className="text-xs sm:text-sm text-cyan-400 font-mono">August 2026</span>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">Chapter Inauguration</h4>
                    <p className="text-sm sm:text-base text-gray-400 mt-1.5">Officially establishing the student chapter with 150+ founding members under Department of Computer Engineering guidance.</p>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute left-[3px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#bd00ff]" />
                    <span className="text-xs sm:text-sm text-purple-400 font-mono">September 2026</span>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">Syntax Sweep</h4>
                    <p className="text-sm sm:text-base text-gray-400 mt-1.5">250 lines of broken code. One ticking clock. Zero mercy.
Hunt the bugs, patch the chaos, and ship it clean before time runs out. Only the sharpest debuggers walk away champions.</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <a
                    href="#events"
                    className="inline-flex items-center gap-1.5 text-sm sm:text-base text-cyan-400 hover:text-cyan-300 font-mono uppercase tracking-widest hover:underline"
                  >
                    Explore Upcoming Events <FiArrowRight />
                  </a>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 3. RECENT NEWS SECTION */}
          <motion.section
            id="news"
            style={{
              y: yNews,
              scale: scaleNews,
              rotate: rotateNews
            }}
            className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="cyber-font text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-wide">
                RECENT NEWS
              </h2>
            </div>

            {news.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center max-w-md mx-auto">
                <p className="text-gray-300 font-mono uppercase tracking-widest text-sm sm:text-base">
                  Coming Soon • News Node Offline
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  We are preparing our dynamic news broadcast feed. Stay tuned!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => item.imageUrl && setSelectedImage(getImageUrl(item.imageUrl))}
                    className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-cyan-500/30 transition-all duration-300 cursor-zoom-in"
                  >
                    <div>
                      {item.imageUrl && (
                        <div className="w-full h-44 rounded-xl overflow-hidden mb-4">
                          <img
                            src={getImageUrl(item.imageUrl)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <span className="text-xs text-cyan-400 font-mono block mb-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <h4 className="cyber-font text-white font-bold text-base tracking-wide mb-3">
                        {item.title}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          {/* 4. EVENTS SECTION */}
          <motion.section id="events" style={{ y: yEvents }} className="relative z-10 py-24 px-6 bg-black/40">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="cyber-font text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-wide">
                  UPCOMING EVENTS
                </h2>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-cyan-400/50" />
                  <p className="text-[10px] sm:text-xs text-cyan-400 tracking-[0.4em] font-mono uppercase font-bold">
                    Innovate • Inspire • Integrate
                  </p>
                  <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-cyan-400/50" />
                </div>
              </div>

              {events.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                  {events.map((evt) => (
                    <div
                      key={evt._id}
                      className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col justify-between group hover:border-cyan-500/20 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full filter blur-xl" />

                      <div>
                        {evt.imageUrl && (
                          <div 
                            onClick={() => setSelectedImage(getImageUrl(evt.imageUrl))}
                            className="w-full h-48 rounded-xl overflow-hidden mb-4 cursor-zoom-in group/evtimg relative"
                          >
                            <img
                              src={getImageUrl(evt.imageUrl)}
                              alt={evt.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/evtimg:scale-105"
                            />
                          </div>
                        )}
                        <h4 className="cyber-font text-white font-bold text-lg tracking-wide mb-3">
                          {evt.title}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                          {evt.description}
                        </p>

                        <div className="space-y-2 text-sm font-mono text-gray-400 mb-6">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-cyan-400" />
                            {new Date(evt.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <FiMapPin className="text-purple-400" />
                            {evt.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <span className="text-xs text-gray-400 font-mono">
                          {evt.registrationCount || 0} SEATS RESERVED
                        </span>

                        {registeredEvents[evt._id] ? (
                          <button className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-mono rounded-full flex items-center gap-1.5 cursor-default">
                            <FiCheck /> Secured
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegisterEvent(evt._id)}
                            className="px-5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 text-sm font-mono rounded-full uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Reserve Seat
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Timeline Container */}
              <div className="relative max-w-5xl mx-auto px-2 sm:px-6">
                {/* Central Spine Line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-purple-500 to-cyan-500 transform md:-translate-x-1/2 opacity-20 shadow-[0_0_10px_rgba(0,240,255,0.3)]" />

                <div className="space-y-12 md:space-y-16 relative">
                  {CALENDAR_EVENTS.map((item, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div 
                        key={item.code} 
                        className={`relative flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} items-start md:items-center`}
                      >
                        {/* Timeline Node */}
                        <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="w-8 h-8 rounded-full border-2 border-cyan-400 bg-[#020205] text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all duration-300 hover:scale-110 hover:border-purple-400 hover:text-purple-400 hover:shadow-[0_0_15px_rgba(189,0,255,0.5)]"
                          >
                            {item.code}
                          </motion.div>
                        </div>

                        {/* Timeline Card Container */}
                        <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'} relative`}>
                          {/* Pointer Connector Line (Desktop Only) */}
                          <div className={`hidden md:block absolute top-1/2 transform -translate-y-1/2 w-12 h-[1px] bg-gradient-to-r ${isEven ? 'right-0 from-transparent to-cyan-500/30' : 'left-0 from-cyan-500/30 to-transparent'}`} />

                          <motion.div
                            initial={{ x: isEven ? 40 : -40, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`glass-panel p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 relative group overflow-visible shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]
                              after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[-6px] 
                              after:border-y-[6px] after:border-y-transparent after:border-r-[6px] after:border-r-[rgba(10,10,20,0.6)]
                              ${isEven ? 'md:after:left-auto md:after:right-[-6px] md:after:border-r-transparent md:after:border-l-[6px] md:after:border-l-[rgba(10,10,20,0.6)]' : ''}
                            `}
                          >
                            {/* Glow accent band inside the card */}
                            <div className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-purple-500 transform ${isEven ? 'right-0 md:left-0 md:right-auto' : 'left-0'} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-full`} />

                            {/* Time / Month Label */}
                            <span className="text-[10px] sm:text-xs font-mono font-bold text-cyan-400 tracking-[0.2em] block mb-1.5 uppercase">
                              {item.time}
                            </span>

                            {/* Event Title */}
                            <h4 className="cyber-font text-white font-extrabold text-base sm:text-lg tracking-wide mb-2 uppercase group-hover:text-cyan-300 transition-colors">
                              {item.title}
                            </h4>

                            {/* Event Description */}
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                              {item.description}
                            </p>

                            {/* Tags / Collaboration Badges */}
                            {item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[9px] font-mono tracking-wider font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </div>

                        {/* Spacer for Desktop */}
                        <div className="hidden md:block w-1/2" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.section>

          {/* 5. TESTIMONIALS SECTION */}
          <motion.section id="testimonials" style={{ y: yTestimonials }} className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-cyan-400 font-mono text-sm uppercase tracking-widest block mb-2"></span>
              <h2 className="cyber-font text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-wide">
                TESTIMONIALS
              </h2>
            </div>

            {testimonials.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center max-w-md mx-auto">
                <p className="text-gray-300 font-mono uppercase tracking-widest text-sm sm:text-base">
                  Coming Soon • Testimonials Offline
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Feedback from our industry advisors and team is propagating to the network.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {testimonials.map((test) => (
                  <div
                    key={test._id}
                    className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between"
                  >
                    <p className="text-gray-300 italic text-sm leading-relaxed mb-6 font-sans">
                      &ldquo;{test.message}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/30 bg-black/40">
                        <img
                          src={test.avatarUrl || '/placeholder.png'}
                          alt={test.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      </div>
                      <div>
                        <h5 className="cyber-font text-white text-sm font-bold">{test.name}</h5>
                        <p className="text-gray-500 text-xs font-mono">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          {/* 6. TEAM SECTION (Moved to last as requested) */}
          <motion.section id="team" style={{ y: yTeam }} className="relative z-10 py-24 px-6 bg-black/40">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-purple-400 font-mono text-sm uppercase tracking-widest block mb-2"></span>
                <h2 className="cyber-font text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-wide">
                  MEET THE LEADERSHIP
                </h2>
                <p className="text-gray-400 text-base mt-3 max-w-xl mx-auto">
                  Our student chapter is managed by visionary guides and a dynamic core team of student heads.
                </p>
              </div>

              {/* A. Faculty Coordinators */}
              {coordinators.length > 0 && (
                <div className="mb-16">
                  <h3 className="cyber-font text-base uppercase text-cyan-400 tracking-widest text-center mb-8 border-b border-cyan-500/10 pb-2 max-w-md mx-auto">
                    Faculty Coordinators
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {coordinators.map((member) => (
                      <TeamCard key={member._id} member={member} />
                    ))}
                  </div>
                </div>
              )}

              {/* B. Executive Chairs (President & Vice President) */}
              {(presidents.length > 0 || vicePresidents.length > 0) && (
                <div className="mb-16">
                  <h3 className="cyber-font text-base uppercase text-cyan-400 tracking-widest text-center mb-8 border-b border-cyan-500/10 pb-2 max-w-md mx-auto">
                    Executive Officers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {presidents.map((member) => (
                      <TeamCard key={member._id} member={member} />
                    ))}
                    {vicePresidents.map((member) => (
                      <TeamCard key={member._id} member={member} />
                    ))}
                  </div>
                </div>
              )}

              {/* C. Technical Heads (Rendered Side-By-Side) */}
              {technicalHeads.length > 0 && (
                <div className="mb-16">
                  <h3 className="cyber-font text-base uppercase text-cyan-400 tracking-widest text-center mb-8 border-b border-cyan-500/10 pb-2 max-w-md mx-auto">
                    Technical Heads
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {technicalHeads.map((member) => (
                      <TeamCard key={member._id} member={member} />
                    ))}
                  </div>
                </div>
              )}

              {/* D. Other Heads (Design, Publicity, Finance in separate section blocks) */}
              <div className="space-y-16 mt-16">
                {/* Design Heads */}
                {designHeads.length > 0 && (
                  <div>
                    <h3 className="cyber-font text-base uppercase text-cyan-400 tracking-widest text-center mb-8 border-b border-cyan-500/10 pb-2 max-w-md mx-auto">
                      Design Heads
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      {designHeads.map((member) => (
                        <TeamCard key={member._id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Event & Publicity Heads */}
                {eventHeads.length > 0 && (
                  <div>
                    <h3 className="cyber-font text-base uppercase text-cyan-400 tracking-widest text-center mb-8 border-b border-cyan-500/10 pb-2 max-w-md mx-auto">
                      Event & Publicity Heads
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      {eventHeads.map((member) => (
                        <TeamCard key={member._id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Finance Heads */}
                {financeHeads.length > 0 && (
                  <div>
                    <h3 className="cyber-font text-base uppercase text-cyan-400 tracking-widest text-center mb-8 border-b border-cyan-500/10 pb-2 max-w-md mx-auto">
                      Finance Heads
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      {financeHeads.map((member) => (
                        <TeamCard key={member._id} member={member} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* FOOTER */}
          <footer className="relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-md pt-16 pb-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              {/* Left Column: About Us */}
              <div>
                <h3 className="cyber-font text-xl font-bold text-cyan-400 tracking-wider uppercase mb-4">
                  About Us
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans">
                  Established in July 2026 under the department of Computer Engineering, the CSI PVG Student Chapter is the official digital epicentre of technology engineering and creation in PVG&apos;s College of Engineering and Technology, Pune. Our charter is straightforward: to transition traditional textbook engineering into dynamic technology leadership. We orchestrate intense bootcamps, high-stakes hackathons, deep coding encounters, and industrial collaborations, preparing over 150 student members to lead the future tech workspace.
                </p>
              </div>

              {/* Right Column: Contact */}
              <div>
                <h3 className="cyber-font text-xl font-bold text-cyan-400 tracking-wider uppercase mb-4">
                  Contact
                </h3>
                <div className="space-y-4 text-gray-300 text-sm sm:text-base font-sans">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-cyan-400 w-5 h-5 mt-1 shrink-0" />
                    <span className="leading-relaxed">
                      Pune Vidhyarthi Griha&apos;s College Of Engineering And Technology, 44, Shiv Darshan Rd, Parvati, Nirmal Baug Colony, Vidya Nagari, Parvati Paytha, Pune, Maharashtra 411009
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiMail className="text-cyan-400 w-5 h-5 shrink-0" />
                    <a href="mailto:csi_pvg@pvgcoet.ac.in" className="hover:text-cyan-400 transition-colors">
                      csi_pvg@pvgcoet.ac.in
                    </a>
                  </div>

                  <div className="flex flex-col items-start gap-3 pt-2">
                    <a
                      href="https://www.instagram.com/csi_pvg/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors font-mono text-sm"
                    >
                      <FiInstagram className="w-5 h-5" />
                      <span>@csi_pvg</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/computer-society-of-india-pvg-student-chapter-90a67542b/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-mono text-sm"
                    >
                      <FiLinkedin className="w-5 h-5" />
                      <span>CSI PVG Student Chapter</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright / Bottom Bar */}
            <div className="border-t border-white/5 pt-8 text-center">
              <p className="cyber-font text-cyan-400 text-neon-cyan text-base font-bold tracking-wider mb-2">
                COMPUTER SOCIETY OF INDIA PVG COET&M
              </p>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                © 2026 CSI PVG COET&M. Crafted by CSI PVG Tech Heads.
              </p>
            </div>
          </footer>
        </main>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center p-2 rounded-2xl border border-white/10 bg-[#0a0a14]/90 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-cyan-400 font-mono tracking-widest text-xs uppercase bg-white/5 border border-white/10 px-3 py-1.5 rounded-md hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                Close [Esc]
              </button>
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,240,255,0.2)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
