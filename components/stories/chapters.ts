export type Chapter = {
  title: string
  /** PLACEHOLDER copy: replace with Amika's own words for each chapter */
  story: string
  image: string
}

export const CHAPTERS: Chapter[] = [
  {
    title: "Little Me",
    story: "Where it all started. A curious kid with a lot of questions and not nearly enough answers yet.",
    image: "/images/stories/little-me.webp",
  },
  {
    title: "School",
    story: "Classrooms, friendships and the first time I realised how much I enjoy figuring things out.",
    image: "/images/stories/school.webp",
  },
  {
    title: "Sports",
    story: "The field taught me discipline, teamwork, and how to lose, learn and come back stronger.",
    image: "/images/stories/sports.webp",
  },
  {
    title: "University",
    story: "Late nights, big projects, and the friends who turned learning into a shared adventure.",
    image: "/images/stories/university.webp",
  },
  {
    title: "Family",
    story: "The people behind every step. None of the other chapters happen without them.",
    image: "/images/stories/family.webp",
  },
  {
    title: "Adventures",
    story: "Out of the office and into the world: the trails, the views, and the stories in between.",
    image: "/images/stories/adventures.webp",
  },
]

export const pad = (n: number) => String(n).padStart(2, "0")
