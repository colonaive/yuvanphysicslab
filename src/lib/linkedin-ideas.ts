export interface LinkedInPostIdea {
  id: string;
  label: string;
  prompt: string;
  template: string;
  recommendedHashtags: string[];
}

export const LINKEDIN_POST_IDEAS: LinkedInPostIdea[] = [
  {
    id: "concept-120",
    label: "Concept in 120 words",
    prompt: "Explain one concept from your latest note in 120 words.",
    template:
      "Concept: [Name the concept]\n\nWhy it matters:\n[One sentence]\n\nMy 120-word explanation:\n[Write it here]\n\nQuestion for peers:\n[Ask for feedback]",
    recommendedHashtags: ["#Physics", "#Research", "#ScienceCommunication", "#TheoreticalPhysics"],
  },
  {
    id: "paper-agreement-disagreement",
    label: "Paper agreement/disagreement",
    prompt: "Summarize a paper you read and what you disagreed with.",
    template:
      "Paper read: [Title + author]\n\nMain claim:\n[1-2 lines]\n\nWhat I agree with:\n[1-2 lines]\n\nWhat I disagree with (and why):\n[2-3 lines]\n\nOpen question:\n[Question]",
    recommendedHashtags: ["#AcademicResearch", "#Physics", "#CriticalThinking", "#ScientificWriting"],
  },
  {
    id: "equation-shift",
    label: "Equation that shifted my view",
    prompt: "One equation that changed your understanding.",
    template:
      "Equation: [Write it in plain text]\n\nWhat I used to think:\n[1 line]\n\nWhat changed:\n[2-3 lines]\n\nWhere this points next:\n[1-2 lines]",
    recommendedHashtags: ["#MathPhysics", "#Mathematics", "#TheoreticalPhysics", "#ProblemSolving"],
  },
  {
    id: "time-misconception",
    label: "Misconception about time in GR",
    prompt: "A misconception people have about time in general relativity.",
    template:
      "Common misconception:\n[State it]\n\nCorrection:\n[2-3 lines]\n\nSimple intuition:\n[1-2 lines]\n\nWhat to read next:\n[Optional link or reference]",
    recommendedHashtags: ["#GeneralRelativity", "#Causality", "#Spacetime", "#PhysicsEducation"],
  },
  {
    id: "stuck-problem",
    label: "Problem I am stuck on",
    prompt: "Share one technical problem where you want feedback.",
    template:
      "Current problem:\n[What you are trying to prove/compute]\n\nWhat I tried:\n[2-3 bullets]\n\nWhere I am stuck:\n[Specific bottleneck]\n\nIf you have seen this pattern before, I would value pointers.",
    recommendedHashtags: ["#Research", "#MathPhysics", "#ProblemSolving", "#PhysicsCommunity"],
  },
];

