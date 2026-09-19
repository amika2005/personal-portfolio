import type { IconType } from "react-icons"
// AWS, CSS3 and Heroku come from other sets: simple-icons dropped them, and react-icons 5.7
// removed SiAmazonwebservices / SiCss3 / SiHeroku, which crashed the /resume build on Vercel
import { FaAws, FaCss3Alt } from "react-icons/fa"
import { DiHeroku } from "react-icons/di"
import {
  SiCircleci,
  SiCloudinary,
  SiDeno,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGithub,
  SiGreensock,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiOpenjdk,
  SiPhp,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiRedis,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si"

export type Release = {
  version: string
  kind: "Work" | "Degree" | "Diploma" | "School"
  title: string
  org: string
  period?: string
  note?: string
}

// Newest first, like a git log. Sourced from the CV, plus the current role shown across the site.
export const RELEASES: Release[] = [
  {
    version: "v5.0.0",
    kind: "Work",
    title: "Software Engineer",
    org: "Infinit Tech Systems",
    period: "Present",
    // PLACEHOLDER: replace with a line or two about the role and a highlight or two
    note: "Building complex applications with modern technologies, from the interface down to the API.",
  },
  {
    version: "v4.0.0",
    kind: "Degree",
    title: "BSc (Hons) in Information Technology",
    org: "ICBT Campus × Cardiff Metropolitan University",
  },
  {
    version: "v3.0.0",
    kind: "Diploma",
    title: "Higher Diploma in Computing & Software Engineering",
    org: "ICBT Campus × Cardiff Metropolitan University",
  },
  {
    version: "v2.0.0",
    kind: "School",
    title: "G.C.E. Advanced Level, Commerce Stream",
    org: "Royal College, Colombo 07",
    period: "2023/24",
  },
  {
    version: "v1.0.0",
    kind: "School",
    title: "G.C.E. Ordinary Level",
    org: "Royal College, Colombo 07",
    period: "2020/21",
  },
]

export type Tool = { name: string; icon: IconType; color: string }

// The CV's stack and the site's earlier "Tech I Use" list, merged
export const STACK: { group: string; blurb: string; tools: Tool[] }[] = [
  {
    group: "Frontend",
    blurb: "Interfaces, motion and everything the user touches.",
    tools: [
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: FaCss3Alt, color: "#1572B6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8" },
      { name: "GSAP", icon: SiGreensock, color: "#88CE02" },
      { name: "Flutter", icon: SiFlutter, color: "#54C5F8" },
    ],
  },
  {
    group: "Backend",
    blurb: "APIs, data and the logic behind the screen.",
    tools: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Express", icon: SiExpress, color: "#FFFFFF" },
      { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
      { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
      { name: "Java", icon: SiOpenjdk, color: "#ED8B00" },
      { name: "PHP", icon: SiPhp, color: "#777BB4" },
      { name: "Deno", icon: SiDeno, color: "#FFFFFF" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "Firestore", icon: SiFirebase, color: "#FFCA28" },
      { name: "Prisma", icon: SiPrisma, color: "#FFFFFF" },
      { name: "Redis", icon: SiRedis, color: "#FF4438" },
    ],
  },
  {
    group: "Tools",
    blurb: "Shipping, hosting and designing.",
    tools: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
      { name: "npm", icon: SiNpm, color: "#CB3837" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "AWS", icon: FaAws, color: "#FF9900" },
      { name: "CircleCI", icon: SiCircleci, color: "#FFFFFF" },
      { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
      { name: "Heroku", icon: DiHeroku, color: "#9E7CC1" },
      { name: "Cloudinary", icon: SiCloudinary, color: "#3448C5" },
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
    ],
  },
]

export const MARQUEE = ["React", "Next.js", "TypeScript", "Node.js", "Spring Boot", "MongoDB", "PostgreSQL", "Docker", "Figma"]

export const PROJECT = {
  name: "SkillSwap Pro",
  pitch: "A platform where people trade skills instead of money: offer a service, and learn something new in exchange.",
  stack: ["React", "Next.js", "MongoDB", "Cloudinary"],
}

export const LANGUAGES = [
  { name: "English", level: "Fluent", value: 1 },
  { name: "Sinhala", level: "Fluent", value: 1 },
  { name: "Tamil", level: "Basic", value: 0.35 },
  { name: "Japanese", level: "Basic", value: 0.35 },
]

export const ACTIVITIES = [
  { name: "Athletics", detail: "Member of the ICBT Campus athletics team" },
  { name: "Boxing", detail: "Former member of the Royal College boxing team" },
]

export const SOFT_SKILLS = ["Teamwork", "Problem solving", "Leadership", "Critical thinking"]
