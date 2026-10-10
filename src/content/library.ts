/**
 * Local content library — the offline source of truth for topics, subtopics,
 * and articles.
 *
 * This used to live in the Supabase `speakos` schema and was fetched at runtime.
 * The project is a low-traffic showcase, so Supabase pauses itself when idle and
 * the whole read -> speak flow went blank. The reading content is small and
 * static, so it lives here instead and the app no longer needs a database to
 * show topics or serve an article.
 *
 * Supabase is still used for AI scoring (transcription + analysis edge
 * functions); see src/hooks/use-session.ts for the graceful fallback when it is
 * asleep.
 *
 * Taxonomy (slugs, names, descriptions, order) mirrors scripts/speakos/taxonomy.ts,
 * which the publish pipeline uses to seed the database.
 */
import type {
  DbArticle,
  DbSubtopic,
  TopicWithSubtopics,
} from "@/types/speakos";

type SeedSubtopic = {
  slug: string;
  name: string;
  /** Article shown for this subtopic. */
  title: string;
  paragraphs: string[];
};

type SeedTopic = {
  slug: string;
  name: string;
  description: string;
  subtopics: SeedSubtopic[];
};

/** Order matches the product category order. */
const SEED: SeedTopic[] = [
  {
    slug: "philosophy",
    name: "Philosophy",
    description:
      "Clarity through argument, restraint, and questions that refuse tidy closure.",
    subtopics: [
      {
        slug: "philosophy-slow",
        name: "Thinking slowly",
        title: "On the discipline of thinking slowly",
        paragraphs: [
          "We live in a culture of fast answers. The quickest reply wins the meeting; the snappiest take wins the feed. But thinking, real thinking, refuses to be rushed. It asks for stillness, the kind of stillness most of us have forgotten how to sit inside.",
          "To think slowly is not to think weakly. It is to hold a question long enough that it begins to reveal its own shape.",
          "Fast thought borrows its conclusions. It reaches for the nearest cliché, the inherited opinion, the tribal answer. It mistakes recognition for understanding.",
          "Slow thought, by contrast, is willing to be uncertain. It treats confusion not as failure but as the beginning of clarity.",
          "Take one idea today, any idea, and refuse to settle it. Turn it. Argue against yourself. Notice the moment you want to stop, and stay one minute longer.",
        ],
      },
      {
        slug: "philosophy-stoicism",
        name: "Stoicism",
        title: "What the Stoics actually meant",
        paragraphs: [
          "Stoicism is often mistaken for stiffness. In truth, it is a practice of attention: noticing what is yours to control and what is not, and spending your energy accordingly.",
          "The Stoic does not suppress emotion. He observes it, names it, and decides whether to act on it. The pause between feeling and action is the entire discipline.",
          "To live well, the Stoics argued, is to align your judgments with reality, not the other way around. Most suffering is the cost of insisting the world be different than it is.",
          "Their daily practice was simple. Each morning, prepare for difficulty. Each evening, review the day honestly. Over years, this slow audit reshapes a life.",
        ],
      },
      {
        slug: "philosophy-meaning",
        name: "Meaning",
        title: "Meaning is made, not found",
        paragraphs: [
          "We are taught to search for meaning as if it were hidden somewhere, waiting to be discovered. But meaning behaves more like a craft than a treasure.",
          "It accrues from what we attend to, what we sacrifice for, and what we refuse to abandon. A meaningful life is usually a narrowed one.",
          "The question is not what life means, but what you are willing to mean by your life. The answer is given in actions, not sentences.",
        ],
      },
      {
        slug: "philosophy-ethics",
        name: "Ethics",
        title: "The quiet weight of small choices",
        paragraphs: [
          "Ethics is rarely tested in dramatic moments. It is tested in the small, almost invisible choices that compose a day: what you say behind someone's back, how you treat a stranger, when you tell the truth that costs you something.",
          "Character is the long sum of these moments. No single one matters much. All of them, together, become who you are.",
        ],
      },
    ],
  },
  {
    slug: "technology",
    name: "Technology",
    description:
      "Tools, cognition, and the infrastructures that shape attention and trust.",
    subtopics: [
      {
        slug: "tech-tools",
        name: "Good tools",
        title: "The quiet shape of good tools",
        paragraphs: [
          "The best tools disappear. A pencil in a writer's hand, a knife in a cook's, a well-worn keyboard. You stop noticing the object and begin noticing the work.",
          "Most software does the opposite. It announces itself, asks for attention, interrupts. It treats the user as a target rather than a craftsman.",
          "A respectful tool has fewer features than you expect and more depth than you notice at first. It rewards patience.",
        ],
      },
      {
        slug: "tech-ai",
        name: "Artificial intelligence",
        title: "What AI changes about thinking",
        paragraphs: [
          "Intelligence used to be expensive. A sentence had to be written by a person, an answer reasoned by a mind. That cost shaped how we worked and what we valued.",
          "When intelligence becomes cheap, the bottleneck moves. It is no longer the answer that is rare, but the question. The person who can ask precisely will outperform the person who can merely produce.",
          "The risk is not that machines think for us. It is that we stop noticing we have outsourced the thinking. The skill to protect, more than ever, is judgment.",
        ],
      },
      {
        slug: "tech-internet",
        name: "The internet",
        title: "The internet we built and the one we wanted",
        paragraphs: [
          "The early internet promised access. Anyone could read anything, find anyone, learn anything. For a while, that promise held.",
          "What we did not anticipate was attention. Access without attention becomes noise. We built a library and discovered we could not read inside it.",
          "The next chapter of the internet will be defined less by what is available and more by what we choose to ignore. Curation, not abundance, is the new craft.",
        ],
      },
      {
        slug: "tech-privacy",
        name: "Privacy",
        title: "Why privacy still matters",
        paragraphs: [
          "Privacy is sometimes defended as if it were only about secrets. It is not. Privacy is the room in which a person becomes themselves before they are seen.",
          "A life lived entirely in public flattens. We perform the version of ourselves we believe will be approved, and slowly forget the other versions.",
          "To defend privacy is to defend the possibility of becoming. It is to insist that not every part of a person needs to be measured to be real.",
        ],
      },
    ],
  },
  {
    slug: "films",
    name: "Films",
    description: "Stories, directing, and cinema as disciplined attention.",
    subtopics: [
      {
        slug: "films-storytelling",
        name: "Storytelling",
        title: "Why a good film feels inevitable",
        paragraphs: [
          "A great film does not feel constructed. It feels found, as if the story already existed and the camera simply uncovered it. This is the highest illusion of cinema.",
          "Underneath that ease is enormous discipline. Every cut, every silence, every shot held one second longer than comfort, is a choice. The art is to make the choices invisible.",
          "When you walk out of a great film unable to explain why it moved you, that is the sign. The structure has done its work without announcing itself.",
        ],
      },
      {
        slug: "films-directors",
        name: "Directors",
        title: "What a director actually does",
        paragraphs: [
          "A director is often imagined as the person who tells everyone what to do. The better directors do something quieter. They protect the tone of the film from a thousand small intrusions.",
          "On any given day, dozens of decisions threaten to pull the film off course. The director's real job is to remember what the film is, again and again, until it exists.",
          "Style is not what a director adds. It is what a director refuses to remove.",
        ],
      },
      {
        slug: "films-cinema",
        name: "The art of cinema",
        title: "Cinema as a form of attention",
        paragraphs: [
          "Cinema is unusual among the arts. It asks you to sit still in the dark and surrender your attention completely for two hours. Almost nothing else in modern life makes that request.",
          "The reward for that surrender is a kind of seeing you cannot get elsewhere. A face held on screen long enough becomes a landscape. A small gesture becomes a confession.",
          "To love cinema is to love attention itself. The films will not give themselves to a divided mind.",
        ],
      },
    ],
  },
  {
    slug: "science",
    name: "Science",
    description:
      "Doubt, evidence, strangeness beneath the ordinary, living systems and climate stakes.",
    subtopics: [
      {
        slug: "science-doubt",
        name: "The role of doubt",
        title: "Why uncertainty is the engine of science",
        paragraphs: [
          "Science is often described as a body of knowledge. But that picture misses what makes science alive. Science is not the certainty at the end; it is the doubt that runs the whole way through.",
          "A scientist's first loyalty is not to her hypothesis. It is to the procedure that could destroy it.",
          "Doubt, properly practiced, is not corrosive. It is generous. It says: I might be wrong, and so I will keep looking.",
        ],
      },
      {
        slug: "science-physics",
        name: "Physics",
        title: "The strangeness underneath ordinary things",
        paragraphs: [
          "A table feels solid. The chair holds you. The world behaves. Physics begins by trusting these appearances, and ends by quietly dismantling them.",
          "At small enough scales, matter stops behaving like matter. Particles become probabilities. Cause and effect get tangled. The everyday turns out to be a useful approximation.",
          "What physics teaches, at its deepest, is humility. The world is older, stranger, and less interested in our intuitions than we like to admit.",
        ],
      },
      {
        slug: "science-biology",
        name: "Biology",
        title: "Life as a refusal to settle",
        paragraphs: [
          "A living thing is, at heart, a small disagreement with the second law of thermodynamics. Everything else in the universe drifts toward disorder. Life pulls, briefly, in the other direction.",
          "Every cell is a negotiation. It takes in energy, pushes out waste, repairs itself, and resists, for a while, becoming dust. Multiply that across trillions of cells and you get a person.",
          "To study biology is to be reminded that you are not so much a thing as a process. You are what your body keeps doing.",
        ],
      },
      {
        slug: "science-climate",
        name: "Climate",
        title: "The hardest kind of problem",
        paragraphs: [
          "Climate is difficult not because the science is unclear, but because the structure of the problem fights human attention. The cause is diffuse, the effect is delayed, and no single act feels decisive.",
          "We are wired to respond to immediate threats. Climate asks us to respond to a slow one, together, across generations.",
          "The work, then, is not only technical. It is imaginative. It is learning to feel the weight of a future we will not fully see.",
        ],
      },
    ],
  },
  {
    slug: "startups",
    name: "Startups",
    description: "Tempo, product judgment, and what founders carry under noise.",
    subtopics: [
      {
        slug: "startups-patience",
        name: "Patience and speed",
        title: "The patience hidden inside fast companies",
        paragraphs: [
          "Startups celebrate speed. And yet, the companies that endure share a quiet, almost stubborn patience about the things that actually matter.",
          "They move fast on tactics. They move slowly on identity. They will rewrite a feature in a week, but they will spend years figuring out who they are for.",
          "Every healthy company runs on two clocks. The fast clock is execution. The slow clock is conviction. The founders who last learn to tell them apart.",
        ],
      },
      {
        slug: "startups-product",
        name: "Building product",
        title: "Product is taste, made operational",
        paragraphs: [
          "A product is the place where a team's taste becomes a thing other people can hold. Every choice you avoided making is still in there, somewhere, as a missing edge.",
          "The job is not to add until the product feels complete. It is to remove until the product feels honest.",
          "Users will forgive a small product that knows what it is. They rarely forgive a large one that does not.",
        ],
      },
      {
        slug: "startups-founders",
        name: "Founders",
        title: "What founders quietly carry",
        paragraphs: [
          "Founders are usually described in terms of what they do. The more interesting question is what they carry: the doubt no one sees, the decisions made at midnight, the people they had to disappoint.",
          "The skill is not avoiding that weight. It is learning to walk with it without becoming bitter.",
          "The best founders are not the loudest. They are the ones who stay coherent when the situation refuses to be.",
        ],
      },
    ],
  },
  {
    slug: "politics",
    name: "Politics",
    description:
      "Democracy, power, discourse, and the quiet obligations of citizenship.",
    subtopics: [
      {
        slug: "politics-democracy",
        name: "Democracy",
        title: "What democracy actually asks of us",
        paragraphs: [
          "Democracy is often described as a system of voting. It is more honestly a system of disagreement: a way for people who do not agree to share a country without destroying it.",
          "Its survival depends less on elections and more on habits. The habit of listening to the other side. The habit of accepting a loss. The habit of telling the truth when it costs your team something.",
          "When those habits weaken, the institutions look the same for a while. Then, quietly, they stop working.",
        ],
      },
      {
        slug: "politics-power",
        name: "Power",
        title: "How power actually moves",
        paragraphs: [
          "Power is rarely where the headlines say it is. It moves through quieter channels: who decides what gets onto the agenda, who controls the budget, who can fire whom.",
          "To understand a political situation, ignore the speeches and follow the calendars. Whoever shapes the schedule shapes the outcome.",
          "Power that is named is usually power that has already begun to slip. The most durable power feels, to those who hold it, like common sense.",
        ],
      },
      {
        slug: "politics-discourse",
        name: "Public discourse",
        title: "The ruin of the shared sentence",
        paragraphs: [
          "A healthy society shares, at minimum, a few sentences about what is true. Not opinions, but a basic floor of fact from which argument can begin.",
          "When that floor cracks, argument becomes theater. Each side speaks to its own audience, and the conversation between them becomes impossible.",
          "Repairing public discourse is slower than breaking it. It begins, modestly, in the willingness to listen to one person you disagree with, and to do so without contempt.",
        ],
      },
      {
        slug: "politics-citizenship",
        name: "Citizenship",
        title: "The quiet work of citizens",
        paragraphs: [
          "Citizenship is not exhausted by voting. It is the daily practice of paying attention to a place, taking responsibility for parts of it, and refusing to look away from what is uncomfortable.",
          "A good citizen is not someone with the loudest opinions. It is someone willing to do the slow work that no one will applaud: showing up, reading carefully, telling the truth.",
          "The health of a country is measured, in the end, by how many of these quiet citizens it has.",
        ],
      },
    ],
  },
  {
    slug: "psychology",
    name: "Psychology",
    description: "Narratives, attention, and how environments reshape habits.",
    subtopics: [
      {
        slug: "psychology-stories",
        name: "The stories we tell",
        title: "The stories we mistake for ourselves",
        paragraphs: [
          "We do not experience our lives directly. We experience the story we tell ourselves about our lives.",
          "This is not a defect. The narrative mind is how we make sense of time. But it becomes a problem when we forget that the story is a story.",
          "Try this. Take a recent moment that hurt you, and write the sentence you have been telling yourself about it. Now write three other true sentences about the same moment.",
        ],
      },
      {
        slug: "psychology-attention",
        name: "Attention",
        title: "Attention is the shape of a life",
        paragraphs: [
          "What you attend to, you become. This is not a metaphor. The mind is shaped, slowly and physically, by where it spends its hours.",
          "To choose your attention is, in the long run, to choose your character. It is the most consequential decision you make each day, and almost no one treats it that way.",
        ],
      },
      {
        slug: "psychology-habits",
        name: "Habits",
        title: "How habits actually change",
        paragraphs: [
          "Habits do not change by force of will. They change by changing the situation around the habit: the cues, the friction, the company you keep.",
          "Willpower is a small, exhaustible resource. Environment is a quiet, constant one. The honest question is not how to be stronger, but how to need less strength.",
        ],
      },
    ],
  },
  {
    slug: "economics",
    name: "Economics",
    description: "Prices, markets, and what widening gaps slowly break.",
    subtopics: [
      {
        slug: "economics-prices",
        name: "Prices",
        title: "Prices, and the things they cannot say",
        paragraphs: [
          "A price is a remarkable piece of information. It compresses millions of decisions, by strangers who will never meet, into a single number.",
          "And yet a price is also a narrow thing. It cannot price a forest's silence, or a child's afternoon, or the slow accumulation of trust between neighbors.",
          "Good economics begins in respect for prices. Wisdom begins in knowing what they leave out.",
        ],
      },
      {
        slug: "economics-markets",
        name: "Markets",
        title: "What markets are good at, and what they are not",
        paragraphs: [
          "Markets are extraordinary at coordination. They move resources to where they are wanted without anyone being in charge.",
          "They are less good at the things that cannot be priced: dignity, safety, a sense of belonging. These have to be defended by other institutions, or they quietly erode.",
          "A serious society uses markets where they work and refuses them where they do not. The mistake is to believe one tool fits every problem.",
        ],
      },
      {
        slug: "economics-inequality",
        name: "Inequality",
        title: "The slow cost of widening gaps",
        paragraphs: [
          "Inequality, beyond a certain point, stops being only an economic issue. It becomes a political one. People who feel the system is not for them stop defending it.",
          "The danger is not envy. It is disengagement. When enough people quietly opt out of the shared project, the project starts to fail in ways that are hard to reverse.",
        ],
      },
    ],
  },
  {
    slug: "history",
    name: "History",
    description: "The long view — how things rise, fall, and quietly repeat.",
    subtopics: [
      {
        slug: "history-fall",
        name: "How things end",
        title: "How the big things end",
        paragraphs: [
          "We imagine collapse as a single catastrophe: a gate breached, a city burning. But most large things do not end in a day. They decline for a long time while still looking intact, like a tree that is hollow before it falls.",
          "The warning signs are usually boring. Institutions stop doing their jobs but keep their names. Rules are followed in form and ignored in spirit. People lose faith quietly, one at a time, long before anyone says so out loud.",
          "This is the uncomfortable lesson of history: decline is rarely dramatic while it is happening. It feels like normal life, slightly worse each year. The task is to notice the hollowing before the fall.",
        ],
      },
      {
        slug: "history-forgotten",
        name: "The forgotten",
        title: "The history that gets forgotten",
        paragraphs: [
          "History is written by the people who could write. For most of the past, that excluded almost everyone: the farmers, the servants, the women, the enslaved. What survives is a thin, official slice of what actually happened.",
          "So the record is not neutral. It remembers kings and forgets the people who fed them. It keeps the treaty and loses the ordinary Tuesday. We mistake the surviving fragments for the whole.",
          "To read history well is to keep asking who is missing from the page. The silence is not empty. It is full of lives that simply were not written down.",
        ],
      },
      {
        slug: "history-repeat",
        name: "Why we repeat",
        title: "Why we keep repeating ourselves",
        paragraphs: [
          "History does not repeat exactly, but it rhymes, and the rhyme comes from us. Human nature changes slowly; the same fears and appetites keep arranging themselves into familiar patterns across the centuries.",
          "Each generation believes it is the exception. It has new technology, new ideas, a sense that the old rules no longer apply. This confidence is itself part of the pattern — the step just before the familiar mistake.",
          "Knowing history does not make you immune. But it lets you recognize the shape of a situation sooner, and recognizing it sooner is sometimes enough to act differently.",
        ],
      },
    ],
  },
  {
    slug: "mind",
    name: "The Mind",
    description:
      "The strangest object in the universe, turned to look at itself.",
    subtopics: [
      {
        slug: "mind-consciousness",
        name: "Consciousness",
        title: "The hard problem of being awake",
        paragraphs: [
          "Science can explain, in principle, how the brain processes light, stores memories, and moves a hand. What it cannot yet explain is why any of it is accompanied by experience — why there is something it feels like to be you.",
          "This is the hard problem. A machine could, in theory, do everything you do with no inner life at all. Yet here you are, with a world lit up from the inside: the redness of red, the ache of a memory.",
          "No one knows how matter gives rise to this. It is the most familiar fact of your life and the least understood. You are the mystery you have been looking for.",
        ],
      },
      {
        slug: "mind-memory",
        name: "Memory",
        title: "Why memory is not a recording",
        paragraphs: [
          "We talk about memory as if it were a video we replay. It is not. Each time you remember something, you rebuild it, and you rebuild it slightly differently, shaped by who you are now.",
          "This means your memories are partly inventions. Confident, detailed, emotionally vivid — and sometimes simply wrong. The feeling of certainty is not evidence; it is just a feeling the brain attaches to the story.",
          "There is freedom in this. If memory is reconstruction, then the meaning of your past is not fixed. You cannot change what happened, but you are always, quietly, rewriting what it means.",
        ],
      },
      {
        slug: "mind-free-will",
        name: "Free will",
        title: "The question of free will",
        paragraphs: [
          "Every choice feels free from the inside. You weighed the options; you decided. And yet each decision is made by a brain obeying physical laws it did not choose, shaped by genes and a history you did not pick.",
          "Thinkers have argued about this for centuries without resolution. Perhaps freedom is not the absence of causes, but the presence of deliberation — the fact that your reasons are genuinely yours, even if they too had causes.",
          "Whatever the truth, how you answer this changes how you treat people. If no one purely chooses, blame softens into understanding. That shift alone is worth the thinking.",
        ],
      },
    ],
  },
  {
    slug: "money",
    name: "Money",
    description: "Wealth, risk, and the quiet arithmetic of enough.",
    subtopics: [
      {
        slug: "money-compounding",
        name: "Compounding",
        title: "The quiet power of compounding",
        paragraphs: [
          "Compounding is growth that feeds on itself: interest earning interest, small gains building on earlier gains. On a graph it looks flat and boring for a long time, then suddenly steep. Most people quit during the boring part.",
          "It applies to far more than money. Skills, relationships, reputation, health — all compound. A small habit repeated for years quietly outperforms a heroic effort abandoned in a month.",
          "The hard part is not understanding compounding. It is surviving the early years, when nothing seems to be happening. The reward goes to the patient more than to the clever.",
        ],
      },
      {
        slug: "money-risk",
        name: "Risk",
        title: "What risk really is",
        paragraphs: [
          "Risk is not the chance that you are wrong. It is what happens to you if you are. Two people can make the same bet; the one who cannot afford to lose is taking far more risk, even at identical odds.",
          "This is why survival matters more than optimization. The investor who earns a little less but never gets wiped out beats the brilliant one who blows up once. You only keep compounding if you stay in the game.",
          "So the first question is never how much you might gain. It is whether you could endure the worst plausible outcome. Protect the downside, and the upside tends to take care of itself.",
        ],
      },
      {
        slug: "money-enough",
        name: "Enough",
        title: "The hardest word in finance: enough",
        paragraphs: [
          "Modern life is engineered to keep you wanting more. There is always a nicer version, a higher number, a neighbor doing better. Without a sense of enough, no amount of money will ever feel like enough.",
          "The real danger is not poverty but the moving goalpost — risking what you have and need for what you don't have and don't need. Many people who 'won' financially kept playing until they lost.",
          "Enough is not a number. It is a decision. The person who knows when to stop holds a kind of wealth the richer, restless person never reaches.",
        ],
      },
    ],
  },
  {
    slug: "cosmos",
    name: "The Cosmos",
    description:
      "Deep time, vast scale, and our brief bright moment in the dark.",
    subtopics: [
      {
        slug: "cosmos-scale",
        name: "Scale",
        title: "On the scale of things",
        paragraphs: [
          "If the Sun were a basketball, the Earth would be a peppercorn thirty paces away, and the nearest star another basketball somewhere across an ocean. The universe is mostly, overwhelmingly, empty space.",
          "We are not built to feel these distances. Our intuitions were shaped for savannas and small tribes, not light-years and galaxies. The numbers are easy to say and almost impossible to picture.",
          "And yet the attempt is worth it. To grasp the scale, even dimly, is to feel both small and improbable — a brief, warm complication in a cold and enormous dark.",
        ],
      },
      {
        slug: "cosmos-time",
        name: "Deep time",
        title: "Deep time",
        paragraphs: [
          "The Earth is about four and a half billion years old. Compress that into a single year, and all of recorded human history fits into the last few seconds before midnight on the 31st of December.",
          "We live our whole lives inside those final seconds, and we treat them as the main event. Mountains that look permanent are temporary. Species that feel eternal are only passing through.",
          "Deep time is humbling, but it is also calming. Set against four billion years, today's emergency shrinks to its real size. You are a brief guest in a very old house. Try to be a good one.",
        ],
      },
      {
        slug: "cosmos-silence",
        name: "The Great Silence",
        title: "The Great Silence",
        paragraphs: [
          "The universe is vast and ancient, full of stars far older than our Sun. By simple arithmetic it should be teeming with civilizations. So where is everybody? This is the Fermi paradox, and its silence is loud.",
          "Maybe life is rarer than we think. Maybe intelligence tends to destroy itself. Maybe others are out there and simply quiet, or too far, or too strange for us to notice. Every answer is unsettling in its own way.",
          "The silence is a mirror. It asks what kind of civilization survives its own power — and whether, given a few more centuries, ours will be one of the voices or one of the absences.",
        ],
      },
    ],
  },
  {
    slug: "art",
    name: "Art",
    description: "Beauty, making, and the long argument about taste.",
    subtopics: [
      {
        slug: "art-beauty",
        name: "Beauty",
        title: "Why beauty is not a luxury",
        paragraphs: [
          "Beauty is often treated as decoration — nice, but optional, the first thing cut when times get serious. Yet people reach for it hardest precisely when life is hardest: a song at a funeral, flowers by a hospital bed.",
          "Beauty does something argument cannot. It reconciles us, briefly, to being alive. It says, without words, that the world is worth attention despite everything. That is not a luxury. That is survival equipment.",
          "The question is not whether you can afford beauty. It is whether you can afford to live without it. Most people, pressed honestly, cannot.",
        ],
      },
      {
        slug: "art-making",
        name: "The creative act",
        title: "The creative act",
        paragraphs: [
          "Making something is mostly a matter of showing up and being willing to be bad for a while. The myth of inspiration hides the plainer truth: creativity is a practice, not a lightning strike.",
          "The blank page is frightening because it exposes the gap between your taste and your skill. Your taste is good before your hands can keep up. Beginners quit in that gap; makers work through it.",
          "You do not need permission, a muse, or certainty. You need to begin, finish, and begin again. The work itself teaches you what the work wants to be.",
        ],
      },
      {
        slug: "art-taste",
        name: "Taste",
        title: "Where taste comes from",
        paragraphs: [
          "Taste feels innate, like something you either have or you don't. But taste is mostly exposure plus attention: the slow accumulation of things you have noticed, compared, and come to prefer for reasons you could almost put into words.",
          "You develop it the way you develop an ear for a language — by immersion, by paying attention to why one thing works and another falls flat. Strong opinions, honestly examined, sharpen faster than polite indifference.",
          "The goal is not to have 'correct' taste. It is to know what you love and why, clearly enough to make things that could only have come from you.",
        ],
      },
    ],
  },
];

const countWords = (text: string): number =>
  text.split(/\s+/).filter(Boolean).length;

// Build the DB-shaped structures once at module load. IDs are stable slugs so
// they stay consistent across reloads and deploys.
const TOPICS: TopicWithSubtopics[] = SEED.map((topic, ti) => {
  const subtopics: DbSubtopic[] = topic.subtopics.map((sub, si) => ({
    id: sub.slug,
    topic_id: topic.slug,
    slug: sub.slug,
    name: sub.name,
    description: null,
    sort_order: (si + 1) * 10,
    is_active: true,
  }));

  return {
    id: topic.slug,
    slug: topic.slug,
    name: topic.name,
    description: topic.description,
    sort_order: (ti + 1) * 10,
    is_active: true,
    subtopics,
  };
});

const ARTICLES_BY_SUBTOPIC: Record<string, DbArticle> = {};
for (const topic of SEED) {
  for (const sub of topic.subtopics) {
    const body = sub.paragraphs.join("\n\n");
    ARTICLES_BY_SUBTOPIC[sub.slug] = {
      id: `${sub.slug}-1`,
      topic_id: topic.slug,
      subtopic_id: sub.slug,
      title: sub.title,
      slug: `${sub.slug}-training-1`,
      premise: "",
      body,
      reading_target_seconds: 180,
      word_count: countWords(body),
      key_ideas: [],
      speaking_anchors: [],
      reflection_question: null,
      speaking_prompt: null,
    };
  }
}

/** All active topics with their subtopics, in display order. */
export const LOCAL_TOPICS: TopicWithSubtopics[] = TOPICS;

/** The article to read for a given subtopic id, or null if unknown. */
export function getLocalArticle(subtopicId: string): DbArticle | null {
  return ARTICLES_BY_SUBTOPIC[subtopicId] ?? null;
}
