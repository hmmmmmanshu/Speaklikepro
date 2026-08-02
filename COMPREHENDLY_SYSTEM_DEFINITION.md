# Comprehendly — System Definition

## 1. What We Are Building

Comprehendly is a minimal, single-screen web application that helps users improve their ability to **think clearly and speak with depth**.

The core loop:

1. User reads a short, structured article
2. User speaks about it from memory
3. System analyzes their thinking + articulation
4. User receives feedback and improves over time

This is not a speaking app.
This is a **thinking and articulation training system**.

---

## 2. Why We Are Building This

Modern users consume content passively:

* scrolling
* reading
* watching

But they rarely:

* articulate ideas
* test understanding
* express thoughts clearly

This creates an illusion of knowledge.

Comprehendly solves this by forcing a simple loop:

> Read -> Think -> Speak -> Reflect

Clarity is built through expression.

---

## 3. Problem Statement

Users today:

* Cannot explain what they consume
* Lack structured thinking
* Speak in unorganized, shallow ways

Existing tools:

* Focus only on speaking fluency
* Do not measure depth or understanding

Comprehendly solves:

* Depth of understanding
* Clarity of articulation
* Structured thinking

---

## 4. Core Product Principles

* No login system (for MVP)
* Single-flow experience (no navigation)
* Minimal UI (white space, calm design)
* No gamification in V1
* No distractions

This product should feel like:

> A quiet space to think

---

## 5. User Flow

### Step 1: Topic Selection

* User selects a topic (philosophy, tech, etc.)

### Step 2: Reading Mode

* AI-generated article is shown
* Timer: 3 minutes
* User reads

User can:

* Wait for timer OR
* Click "I've read enough"

---

### Step 3: Speaking Mode

* User records speech (1-3 minutes)
* No pause allowed
* Optional: skip speaking

---

### Step 4: Feedback

* Transcript generated
* AI analysis provided:

  * Clarity
  * Structure
  * Depth
  * Original Thought

---

## 6. Tech Stack

### Frontend

* React
* TailwindCSS
* Minimal component structure

### Backend

* Supabase

  * Storage (audio files)
  * DB (sessions, transcripts, scores)
  * Edge Functions (API layer)

---

## 7. AI & API Stack

### Speech-to-Text

* OpenAI Whisper API
* Input: audio file
* Output: transcript

---

### LLM Analysis

* OpenAI (GPT-4o or latest available)

Used for:

* scoring responses
* feedback generation

---

### Embeddings

* OpenAI Embeddings API

Used for:

* comparing article vs speech
* calculating depth score

---

## 8. Core Data Flow

1. User records audio
2. Audio sent to backend
3. Whisper converts audio -> transcript
4. Transcript sent to LLM
5. LLM returns structured analysis
6. Embeddings used to compare article vs transcript
7. Scores generated
8. Results stored + returned to frontend

---

## 9. Database Schema (Initial)

### sessions

* id
* topic
* article_text
* created_at

---

### recordings

* id
* session_id
* audio_url
* transcript
* created_at

---

### analysis

* id
* session_id
* clarity_score
* structure_score
* depth_score
* originality_score
* feedback_text
* created_at

---

## 10. AI Scoring Expectations

Scores must NOT be random.

Each score must reflect:

### Clarity

* Simple sentences
* Minimal filler words
* Understandable phrasing

---

### Structure

* Logical flow
* Intro -> body -> conclusion

---

### Depth

* Understanding of key ideas
* Not just repetition

---

### Original Thought

* New ideas
* Opinions
* Interpretation

---

## 11. Article Generation

For MVP:

* Articles are AI-generated

Requirements:

* 3-minute reading length
* Clear structure
* 2-3 key ideas
* Simple language

---

## 12. UX Constraints

DO NOT:

* Add dashboards
* Add login
* Add unnecessary UI

ALWAYS:

* Keep it minimal
* Keep it focused
* Keep it calm

---

## 13. Future Scope (Not for MVP)

* Progress tracking
* Topic revisits
* Improvement graphs
* Personalized difficulty
* Real-time speaking feedback

---

## 14. Engineering Guidelines

* Build fast, iterate faster
* Avoid over-engineering
* Keep API calls modular
* Log all AI responses for debugging
* Ensure idempotent backend functions

---

## 15. Definition of Success

User should feel:

> "I actually thought about this."

NOT:

> "I used an app."

---

## 16. Core Insight

Most people mistake recognition for understanding.

Comprehendly forces:

> Expression as proof of understanding

---

This file is the source of truth.

All design, engineering, and AI decisions must align with this.
