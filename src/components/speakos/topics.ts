export type Topic = {
  id: string;
  label: string;
  article: {
    title: string;
    readingTime: string;
    body: { type: "h2" | "p"; text: string }[];
  };
};

export const TOPICS: Topic[] = [
  {
    id: "philosophy",
    label: "Philosophy",
    article: {
      title: "On the discipline of thinking slowly",
      readingTime: "5 min read",
      body: [
        { type: "p", text: "We live in a culture of fast answers. The quickest reply wins the meeting; the snappiest take wins the feed. But thinking, real thinking, refuses to be rushed. It asks for stillness, the kind of stillness most of us have forgotten how to sit inside." },
        { type: "p", text: "To think slowly is not to think weakly. It is to hold a question long enough that it begins to reveal its own shape. The philosopher does not race toward a conclusion. She circles it, listens to it, lets it argue back." },
        { type: "h2", text: "The cost of speed" },
        { type: "p", text: "Fast thought borrows its conclusions. It reaches for the nearest cliché, the inherited opinion, the tribal answer. It mistakes recognition for understanding. We feel certain because the thought is familiar, not because it is true." },
        { type: "p", text: "Slow thought, by contrast, is willing to be uncertain. It treats confusion not as failure but as the beginning of clarity. It accepts that the first sentence we form about a thing is rarely the truest one." },
        { type: "h2", text: "A small practice" },
        { type: "p", text: "Take one idea today, any idea, and refuse to settle it. Turn it. Argue against yourself. Notice the moment you want to stop, and stay one minute longer. That minute is where thinking actually begins." },
        { type: "p", text: "Clarity, in the end, is not a gift. It is a discipline. And like all disciplines, it grows quietly, in the spaces we usually try to fill with noise." },
      ],
    },
  },
  {
    id: "technology",
    label: "Technology",
    article: {
      title: "The quiet shape of good tools",
      readingTime: "5 min read",
      body: [
        { type: "p", text: "The best tools disappear. A pencil in a writer's hand, a knife in a cook's, a well-worn keyboard. You stop noticing the object and begin noticing the work. This is not an accident. It is the highest achievement of design." },
        { type: "p", text: "Most software does the opposite. It announces itself, asks for attention, interrupts. It treats the user as a target rather than a craftsman. The result is a strange tiredness, the fatigue of being managed by the thing you meant to use." },
        { type: "h2", text: "Tools that respect you" },
        { type: "p", text: "A respectful tool has fewer features than you expect and more depth than you notice at first. It rewards patience. It does not push notifications into the middle of your thinking. It assumes you have somewhere to be and lets you go there." },
        { type: "h2", text: "Designing for silence" },
        { type: "p", text: "To build something quiet is harder than to build something loud. Loud is easy: add a banner, add a badge, add a sound. Quiet requires you to remove until only the essential remains, and then to remove a little more." },
        { type: "p", text: "The future of technology will not belong to whoever shouts the loudest. It will belong to whoever helps us think, make, and rest without friction. The quiet tool wins, eventually, because the human nervous system votes for it every day." },
      ],
    },
  },
  {
    id: "science",
    label: "Science",
    article: {
      title: "Why uncertainty is the engine of science",
      readingTime: "5 min read",
      body: [
        { type: "p", text: "Science is often described as a body of knowledge, a stack of facts about the world. But that picture misses what makes science alive. Science is not the certainty at the end; it is the doubt that runs the whole way through." },
        { type: "p", text: "A scientist's first loyalty is not to her hypothesis. It is to the procedure that could destroy it. The willingness to be wrong, publicly, repeatedly, is what separates science from belief." },
        { type: "h2", text: "Living with not-knowing" },
        { type: "p", text: "Most of us find uncertainty uncomfortable. We want answers, and we want them now. But the universe is not in a hurry to confirm our intuitions. The honest scientist learns to sit with not-knowing for years, sometimes for a lifetime." },
        { type: "h2", text: "The ethics of doubt" },
        { type: "p", text: "Doubt, properly practiced, is not corrosive. It is generous. It says: I might be wrong, and so I will keep looking. It refuses the seduction of the final word. It leaves the door open for someone else, perhaps a stranger, to walk through with a better idea." },
        { type: "p", text: "This is why science, at its best, is humble. Not because scientists are modest people, but because the method itself is built around the possibility of being corrected. To do science is to volunteer for that correction, again and again." },
      ],
    },
  },
  {
    id: "startups",
    label: "Startups",
    article: {
      title: "The patience hidden inside fast companies",
      readingTime: "5 min read",
      body: [
        { type: "p", text: "Startups celebrate speed. Move fast, ship often, iterate. And yet, if you look closely at the companies that endure, you find something beneath the speed: a quiet, almost stubborn patience about the things that actually matter." },
        { type: "p", text: "They move fast on tactics. They move slowly on identity. They will rewrite a feature in a week, but they will spend years figuring out who they are for, and what they refuse to become." },
        { type: "h2", text: "The two clocks" },
        { type: "p", text: "Every healthy company runs on two clocks. The fast clock is execution: ship the thing, fix the bug, answer the customer. The slow clock is conviction: what kind of company are we building, and what would we never do, even for money?" },
        { type: "h2", text: "Compounding belief" },
        { type: "p", text: "The slow clock compounds. Each year of consistent identity makes the brand denser, the team more aligned, the customers more loyal. You cannot sprint your way to that. You can only show up, decade after decade, refusing to drift." },
        { type: "p", text: "The founders who burn out are usually the ones who confuse the two clocks. They try to sprint the slow things and meander on the fast ones. The ones who last learn to tell them apart, and to honor each at its own pace." },
      ],
    },
  },
  {
    id: "psychology",
    label: "Psychology",
    article: {
      title: "The stories we mistake for ourselves",
      readingTime: "5 min read",
      body: [
        { type: "p", text: "We do not experience our lives directly. We experience the story we tell ourselves about our lives. The same afternoon can be a triumph or a humiliation depending on the sentence we wrap around it before we go to sleep." },
        { type: "p", text: "This is not a defect. The narrative mind is how we make sense of time. But it becomes a problem when we forget that the story is a story. We mistake our interpretation for the event itself, and then we defend the interpretation as if our life depended on it." },
        { type: "h2", text: "Loosening the grip" },
        { type: "p", text: "Therapy, meditation, journaling, honest friendship, these are all, in different costumes, the same practice: noticing the story, and learning to hold it more loosely. Not to abandon it, but to remember that other stories are possible." },
        { type: "h2", text: "A different sentence" },
        { type: "p", text: "Try this. Take a recent moment that hurt you, and write the sentence you have been telling yourself about it. Now write three other true sentences about the same moment. Notice that all four can be true at once. Notice which one you have been living inside." },
        { type: "p", text: "We do not get to choose what happens. We get, slowly and with practice, to choose the sentence." },
      ],
    },
  },
  {
    id: "economics",
    label: "Economics",
    article: {
      title: "Prices, and the things they cannot say",
      readingTime: "5 min read",
      body: [
        { type: "p", text: "A price is a remarkable piece of information. It compresses millions of decisions, by strangers who will never meet, into a single number. It tells the farmer what to plant, the builder what to build, the saver what to keep." },
        { type: "p", text: "This is why markets, at their best, are humbler than their critics admit. No central planner could gather what a price gathers. The market is, in a sense, the largest ongoing conversation our species has ever held." },
        { type: "h2", text: "What prices miss" },
        { type: "p", text: "And yet a price is also a narrow thing. It cannot price a forest's silence, or a child's afternoon, or the slow accumulation of trust between neighbors. Whatever the market does not measure, it tends, over time, to forget." },
        { type: "h2", text: "The work of citizens" },
        { type: "p", text: "This is the quiet work of citizens, of writers, of voters, of friends: to keep alive the values that prices cannot carry. Not to abolish the market, but to surround it. To insist that some things are real even when they do not show up on a receipt." },
        { type: "p", text: "Good economics begins in respect for prices. Wisdom begins in knowing what they leave out." },
      ],
    },
  },
];
