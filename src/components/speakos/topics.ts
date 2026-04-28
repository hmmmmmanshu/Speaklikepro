export type Topic = {
  id: string;
  label: string;
  article: {
    title: string;
    readingTime: string;
    body: { type: "h2" | "p"; text: string }[];
  };
};

export type Category = {
  id: string;
  label: string;
  topics: Topic[];
};

const philosophyArticle = {
  title: "On the discipline of thinking slowly",
  readingTime: "5 min read",
  body: [
    { type: "p" as const, text: "We live in a culture of fast answers. The quickest reply wins the meeting; the snappiest take wins the feed. But thinking, real thinking, refuses to be rushed. It asks for stillness, the kind of stillness most of us have forgotten how to sit inside." },
    { type: "p" as const, text: "To think slowly is not to think weakly. It is to hold a question long enough that it begins to reveal its own shape." },
    { type: "h2" as const, text: "The cost of speed" },
    { type: "p" as const, text: "Fast thought borrows its conclusions. It reaches for the nearest cliché, the inherited opinion, the tribal answer. It mistakes recognition for understanding." },
    { type: "p" as const, text: "Slow thought, by contrast, is willing to be uncertain. It treats confusion not as failure but as the beginning of clarity." },
    { type: "h2" as const, text: "A small practice" },
    { type: "p" as const, text: "Take one idea today, any idea, and refuse to settle it. Turn it. Argue against yourself. Notice the moment you want to stop, and stay one minute longer." },
  ],
};

const make = (
  title: string,
  paragraphs: string[]
): Topic["article"] => ({
  title,
  readingTime: "4 min read",
  body: paragraphs.map((text) => ({ type: "p" as const, text })),
});

export const CATEGORIES: Category[] = [
  {
    id: "philosophy",
    label: "Philosophy",
    topics: [
      { id: "philosophy-slow", label: "Thinking slowly", article: philosophyArticle },
      {
        id: "philosophy-stoicism",
        label: "Stoicism",
        article: make("What the Stoics actually meant", [
          "Stoicism is often mistaken for stiffness. In truth, it is a practice of attention: noticing what is yours to control and what is not, and spending your energy accordingly.",
          "The Stoic does not suppress emotion. He observes it, names it, and decides whether to act on it. The pause between feeling and action is the entire discipline.",
          "To live well, the Stoics argued, is to align your judgments with reality, not the other way around. Most suffering is the cost of insisting the world be different than it is.",
          "Their daily practice was simple. Each morning, prepare for difficulty. Each evening, review the day honestly. Over years, this slow audit reshapes a life.",
        ]),
      },
      {
        id: "philosophy-meaning",
        label: "Meaning",
        article: make("Meaning is made, not found", [
          "We are taught to search for meaning as if it were hidden somewhere, waiting to be discovered. But meaning behaves more like a craft than a treasure.",
          "It accrues from what we attend to, what we sacrifice for, and what we refuse to abandon. A meaningful life is usually a narrowed one.",
          "The question is not what life means, but what you are willing to mean by your life. The answer is given in actions, not sentences.",
        ]),
      },
      {
        id: "philosophy-ethics",
        label: "Ethics",
        article: make("The quiet weight of small choices", [
          "Ethics is rarely tested in dramatic moments. It is tested in the small, almost invisible choices that compose a day: what you say behind someone's back, how you treat a stranger, when you tell the truth that costs you something.",
          "Character is the long sum of these moments. No single one matters much. All of them, together, become who you are.",
        ]),
      },
    ],
  },
  {
    id: "technology",
    label: "Technology",
    topics: [
      {
        id: "tech-tools",
        label: "Good tools",
        article: make("The quiet shape of good tools", [
          "The best tools disappear. A pencil in a writer's hand, a knife in a cook's, a well-worn keyboard. You stop noticing the object and begin noticing the work.",
          "Most software does the opposite. It announces itself, asks for attention, interrupts. It treats the user as a target rather than a craftsman.",
          "A respectful tool has fewer features than you expect and more depth than you notice at first. It rewards patience.",
        ]),
      },
      {
        id: "tech-ai",
        label: "Artificial Intelligence",
        article: make("What AI changes about thinking", [
          "Intelligence used to be expensive. A sentence had to be written by a person, an answer reasoned by a mind. That cost shaped how we worked and what we valued.",
          "When intelligence becomes cheap, the bottleneck moves. It is no longer the answer that is rare, but the question. The person who can ask precisely will outperform the person who can merely produce.",
          "The risk is not that machines think for us. It is that we stop noticing we have outsourced the thinking. The skill to protect, more than ever, is judgment.",
        ]),
      },
      {
        id: "tech-internet",
        label: "The Internet",
        article: make("The internet we built and the one we wanted", [
          "The early internet promised access. Anyone could read anything, find anyone, learn anything. For a while, that promise held.",
          "What we did not anticipate was attention. Access without attention becomes noise. We built a library and discovered we could not read inside it.",
          "The next chapter of the internet will be defined less by what is available and more by what we choose to ignore. Curation, not abundance, is the new craft.",
        ]),
      },
      {
        id: "tech-privacy",
        label: "Privacy",
        article: make("Why privacy still matters", [
          "Privacy is sometimes defended as if it were only about secrets. It is not. Privacy is the room in which a person becomes themselves before they are seen.",
          "A life lived entirely in public flattens. We perform the version of ourselves we believe will be approved, and slowly forget the other versions.",
          "To defend privacy is to defend the possibility of becoming. It is to insist that not every part of a person needs to be measured to be real.",
        ]),
      },
    ],
  },
  {
    id: "films",
    label: "Films",
    topics: [
      {
        id: "films-storytelling",
        label: "Storytelling",
        article: make("Why a good film feels inevitable", [
          "A great film does not feel constructed. It feels found, as if the story already existed and the camera simply uncovered it. This is the highest illusion of cinema.",
          "Underneath that ease is enormous discipline. Every cut, every silence, every shot held one second longer than comfort, is a choice. The art is to make the choices invisible.",
          "When you walk out of a great film unable to explain why it moved you, that is the sign. The structure has done its work without announcing itself.",
        ]),
      },
      {
        id: "films-directors",
        label: "Directors",
        article: make("What a director actually does", [
          "A director is often imagined as the person who tells everyone what to do. The better directors do something quieter. They protect the tone of the film from a thousand small intrusions.",
          "On any given day, dozens of decisions threaten to pull the film off course. The director's real job is to remember what the film is, again and again, until it exists.",
          "Style is not what a director adds. It is what a director refuses to remove.",
        ]),
      },
      {
        id: "films-cinema",
        label: "The art of cinema",
        article: make("Cinema as a form of attention", [
          "Cinema is unusual among the arts. It asks you to sit still in the dark and surrender your attention completely for two hours. Almost nothing else in modern life makes that request.",
          "The reward for that surrender is a kind of seeing you cannot get elsewhere. A face held on screen long enough becomes a landscape. A small gesture becomes a confession.",
          "To love cinema is to love attention itself. The films will not give themselves to a divided mind.",
        ]),
      },
    ],
  },
  {
    id: "science",
    label: "Science",
    topics: [
      {
        id: "science-doubt",
        label: "The role of doubt",
        article: make("Why uncertainty is the engine of science", [
          "Science is often described as a body of knowledge. But that picture misses what makes science alive. Science is not the certainty at the end; it is the doubt that runs the whole way through.",
          "A scientist's first loyalty is not to her hypothesis. It is to the procedure that could destroy it.",
          "Doubt, properly practiced, is not corrosive. It is generous. It says: I might be wrong, and so I will keep looking.",
        ]),
      },
      {
        id: "science-physics",
        label: "Physics",
        article: make("The strangeness underneath ordinary things", [
          "A table feels solid. The chair holds you. The world behaves. Physics begins by trusting these appearances, and ends by quietly dismantling them.",
          "At small enough scales, matter stops behaving like matter. Particles become probabilities. Cause and effect get tangled. The everyday turns out to be a useful approximation.",
          "What physics teaches, at its deepest, is humility. The world is older, stranger, and less interested in our intuitions than we like to admit.",
        ]),
      },
      {
        id: "science-biology",
        label: "Biology",
        article: make("Life as a refusal to settle", [
          "A living thing is, at heart, a small disagreement with the second law of thermodynamics. Everything else in the universe drifts toward disorder. Life pulls, briefly, in the other direction.",
          "Every cell is a negotiation. It takes in energy, pushes out waste, repairs itself, and resists, for a while, becoming dust. Multiply that across trillions of cells and you get a person.",
          "To study biology is to be reminded that you are not so much a thing as a process. You are what your body keeps doing.",
        ]),
      },
      {
        id: "science-climate",
        label: "Climate",
        article: make("The hardest kind of problem", [
          "Climate is difficult not because the science is unclear, but because the structure of the problem fights human attention. The cause is diffuse, the effect is delayed, and no single act feels decisive.",
          "We are wired to respond to immediate threats. Climate asks us to respond to a slow one, together, across generations.",
          "The work, then, is not only technical. It is imaginative. It is learning to feel the weight of a future we will not fully see.",
        ]),
      },
    ],
  },
  {
    id: "startups",
    label: "Startups",
    topics: [
      {
        id: "startups-patience",
        label: "Patience and speed",
        article: make("The patience hidden inside fast companies", [
          "Startups celebrate speed. And yet, the companies that endure share a quiet, almost stubborn patience about the things that actually matter.",
          "They move fast on tactics. They move slowly on identity. They will rewrite a feature in a week, but they will spend years figuring out who they are for.",
          "Every healthy company runs on two clocks. The fast clock is execution. The slow clock is conviction. The founders who last learn to tell them apart.",
        ]),
      },
      {
        id: "startups-product",
        label: "Building product",
        article: make("Product is taste, made operational", [
          "A product is the place where a team's taste becomes a thing other people can hold. Every choice you avoided making is still in there, somewhere, as a missing edge.",
          "The job is not to add until the product feels complete. It is to remove until the product feels honest.",
          "Users will forgive a small product that knows what it is. They rarely forgive a large one that does not.",
        ]),
      },
      {
        id: "startups-founders",
        label: "Founders",
        article: make("What founders quietly carry", [
          "Founders are usually described in terms of what they do. The more interesting question is what they carry: the doubt no one sees, the decisions made at midnight, the people they had to disappoint.",
          "The skill is not avoiding that weight. It is learning to walk with it without becoming bitter.",
          "The best founders are not the loudest. They are the ones who stay coherent when the situation refuses to be.",
        ]),
      },
    ],
  },
  {
    id: "politics",
    label: "Politics",
    topics: [
      {
        id: "politics-democracy",
        label: "Democracy",
        article: make("What democracy actually asks of us", [
          "Democracy is often described as a system of voting. It is more honestly a system of disagreement: a way for people who do not agree to share a country without destroying it.",
          "Its survival depends less on elections and more on habits. The habit of listening to the other side. The habit of accepting a loss. The habit of telling the truth when it costs your team something.",
          "When those habits weaken, the institutions look the same for a while. Then, quietly, they stop working.",
        ]),
      },
      {
        id: "politics-power",
        label: "Power",
        article: make("How power actually moves", [
          "Power is rarely where the headlines say it is. It moves through quieter channels: who decides what gets onto the agenda, who controls the budget, who can fire whom.",
          "To understand a political situation, ignore the speeches and follow the calendars. Whoever shapes the schedule shapes the outcome.",
          "Power that is named is usually power that has already begun to slip. The most durable power feels, to those who hold it, like common sense.",
        ]),
      },
      {
        id: "politics-discourse",
        label: "Public discourse",
        article: make("The ruin of the shared sentence", [
          "A healthy society shares, at minimum, a few sentences about what is true. Not opinions, but a basic floor of fact from which argument can begin.",
          "When that floor cracks, argument becomes theater. Each side speaks to its own audience, and the conversation between them becomes impossible.",
          "Repairing public discourse is slower than breaking it. It begins, modestly, in the willingness to listen to one person you disagree with, and to do so without contempt.",
        ]),
      },
      {
        id: "politics-citizenship",
        label: "Citizenship",
        article: make("The quiet work of citizens", [
          "Citizenship is not exhausted by voting. It is the daily practice of paying attention to a place, taking responsibility for parts of it, and refusing to look away from what is uncomfortable.",
          "A good citizen is not someone with the loudest opinions. It is someone willing to do the slow work that no one will applaud: showing up, reading carefully, telling the truth.",
          "The health of a country is measured, in the end, by how many of these quiet citizens it has.",
        ]),
      },
    ],
  },
  {
    id: "psychology",
    label: "Psychology",
    topics: [
      {
        id: "psychology-stories",
        label: "The stories we tell",
        article: make("The stories we mistake for ourselves", [
          "We do not experience our lives directly. We experience the story we tell ourselves about our lives.",
          "This is not a defect. The narrative mind is how we make sense of time. But it becomes a problem when we forget that the story is a story.",
          "Try this. Take a recent moment that hurt you, and write the sentence you have been telling yourself about it. Now write three other true sentences about the same moment.",
        ]),
      },
      {
        id: "psychology-attention",
        label: "Attention",
        article: make("Attention is the shape of a life", [
          "What you attend to, you become. This is not a metaphor. The mind is shaped, slowly and physically, by where it spends its hours.",
          "To choose your attention is, in the long run, to choose your character. It is the most consequential decision you make each day, and almost no one treats it that way.",
        ]),
      },
      {
        id: "psychology-habits",
        label: "Habits",
        article: make("How habits actually change", [
          "Habits do not change by force of will. They change by changing the situation around the habit: the cues, the friction, the company you keep.",
          "Willpower is a small, exhaustible resource. Environment is a quiet, constant one. The honest question is not how to be stronger, but how to need less strength.",
        ]),
      },
    ],
  },
  {
    id: "economics",
    label: "Economics",
    topics: [
      {
        id: "economics-prices",
        label: "Prices",
        article: make("Prices, and the things they cannot say", [
          "A price is a remarkable piece of information. It compresses millions of decisions, by strangers who will never meet, into a single number.",
          "And yet a price is also a narrow thing. It cannot price a forest's silence, or a child's afternoon, or the slow accumulation of trust between neighbors.",
          "Good economics begins in respect for prices. Wisdom begins in knowing what they leave out.",
        ]),
      },
      {
        id: "economics-markets",
        label: "Markets",
        article: make("What markets are good at, and what they are not", [
          "Markets are extraordinary at coordination. They move resources to where they are wanted without anyone being in charge.",
          "They are less good at the things that cannot be priced: dignity, safety, a sense of belonging. These have to be defended by other institutions, or they quietly erode.",
          "A serious society uses markets where they work and refuses them where they do not. The mistake is to believe one tool fits every problem.",
        ]),
      },
      {
        id: "economics-inequality",
        label: "Inequality",
        article: make("The slow cost of widening gaps", [
          "Inequality, beyond a certain point, stops being only an economic issue. It becomes a political one. People who feel the system is not for them stop defending it.",
          "The danger is not envy. It is disengagement. When enough people quietly opt out of the shared project, the project starts to fail in ways that are hard to reverse.",
        ]),
      },
    ],
  },
];

// Backwards compatibility: flat list of representative topics.
export const TOPICS: Topic[] = CATEGORIES.map((c) => c.topics[0]);
