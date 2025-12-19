
import { Article } from './types';

export const SITE_NAME = "EMBODIED AI TIMES";

// Fallback data in case the external manifest.json cannot be loaded
export const FALLBACK_ARTICLES: Article[] = [
  {
    id: "humanoid-supply-chain",
    title: "The Humanoid Supply Chain: Who Actually Makes the Parts?",
    summary: "Deep dive into the harmonic drives, frameless motors, and tactile sensors supply chain. The hidden companies powering Tesla Optimus and Figure.",
    date: "2025-05-15",
    author: "EAI Premium",
    imageUrl: "https://picsum.photos/800/399?grayscale",
    tags: ["Market Analysis", "Exclusive"],
    isPremium: true,
    externalUrl: "https://substack.com", // Replace with your actual Substack link
    content: "" 
  },
  {
    id: "brain-needs-body",
    title: "Why AI Needs a Body to Truly Understand the World",
    summary: "Large Language Models are smart, but they have never felt the weight of an apple. Here is why the next leap in intelligence requires physical sensation.",
    date: "2024-11-02",
    author: "EAI Editorial",
    imageUrl: "https://picsum.photos/800/400?grayscale",
    tags: ["Philosophy", "Robotics", "AGI"],
    content: `
# Why AI Needs a Body

Imagine trying to explain the color red to someone who has lived their entire life in a black-and-white room. You can describe the wavelength, the heat, the feeling of passion—but without seeing it, they don't *truly* know it.

Currently, ChatGPT is like that person in the black-and-white room. It has read every book about apples, but it has never held one.

## The Grounding Problem
In AI research, this is called the **Symbol Grounding Problem**. 
* **Symbols**: Words like "heavy", "sticky", "soft".
* **Grounding**: Connecting those words to real physical experiences.

Embodied AI attempts to solve this. By giving AI cameras, grippers, and wheels, we aren't just making them useful for doing laundry; we are teaching them what "physics" actually feels like.

> "Intelligence isn't just about processing data. It's about navigating space."

## From Chatbots to Robots
We are moving from "Internet AI" (trained on text) to "Physical AI" (trained on reality). The data isn't Wikipedia anymore; it's video of people walking, cooking, and opening doors.
    `
  },
  {
    id: "moravec-paradox",
    title: "Hard is Easy, Easy is Hard",
    summary: "Why can a computer beat a Grandmaster at chess, but fails to fold a t-shirt? Explaining Moravec's Paradox.",
    date: "2024-10-28",
    author: "Dr. Sarah Chen",
    imageUrl: "https://picsum.photos/800/401?grayscale",
    tags: ["Robotics", "History", "Basics"],
    content: `
# Hard is Easy, Easy is Hard

In the 1980s, roboticist Hans Moravec made a startling discovery:

* It is **easy** to make a computer do hard things (Calculus, Chess, Go).
* It is **hard** to make a computer do easy things (Walking, folding laundry, recognizing a face).

## Why?
The answer lies in **evolution**. 
Humans have spent millions of years evolving the hardware (eyes, ears, cerebellum) to perceive the world and move through it. We do it subconsciously. You don't "think" about how to lift your coffee cup; your body just does it.

Math and logic, however, are new skills for humans. We have to think hard to do them. Because they are conscious processes based on rules, they are easy to program.

## The Laundry Challenge
Folding a t-shirt involves:
1. Recognizing where the fabric starts and ends (Computer Vision).
2. Understanding how soft fabric deforms (Physics simulation).
3. Coordinating two hands to manipulate it without tearing (Fine motor control).

For a robot, a pile of laundry is a chaotic, unpredictable nightmare. But we are finally cracking the code.
    `
  },
  {
    id: "sim-to-real",
    title: "The Matrix for Robots: Sim-to-Real",
    summary: "Robots learn to walk in video games because the real world is too slow and dangerous. How 'Sim-to-Real' transfer works.",
    date: "2024-10-15",
    author: "J. K. Rivers",
    imageUrl: "https://picsum.photos/800/402?grayscale",
    tags: ["Simulation", "Training", "Tech"],
    content: `
# The Matrix for Robots

If you want to teach a robot to walk, you can't just let it fall over a thousand times in your lab. It breaks the robot, and it breaks your floor.

Instead, we put the robot in a video game.

## Reinforcement Learning
We create a physics-accurate simulation (like a high-end version of GTA or Minecraft). In this world, the robot tries to walk.
* It falls? **Negative points.**
* It takes a step? **Positive points.**

It runs this simulation millions of times in an hour. It learns to run, jump, and backflip.

## The Transfer Gap
Here is the catch: **Reality is messy.** 
* The floor in the real world has dust.
* The gears in the real robot have friction.
* The wind blows.

This difference is called the **Sim-to-Real Gap**. The art of modern robotics is making the simulation "noisy" enough (adding random friction, random weights) so that when the robot wakes up in the real world, it thinks, "Oh, this is just another level of the game."
    `
  },
   {
    id: "tactile-sensing",
    title: "Feeling the World: The Sense of Touch",
    summary: "Vision is not enough. To truly interact with the world, robots need skin.",
    date: "2024-10-05",
    author: "EAI Editorial",
    imageUrl: "https://picsum.photos/800/403?grayscale",
    tags: ["Sensors", "Hardware"],
    content: `
# Feeling the World

Close your eyes and reach into your pocket. You can instantly tell the difference between a coin and a key. That is **tactile sensing**.

For decades, robots were numb. They had metal pincers. If they squeezed too hard, they crushed the glass; too soft, and it dropped.

## New Skin
We are now seeing the rise of:
* **GelSight Sensors**: Using cameras *inside* a rubber finger to see the texture of what it touches.
* **E-Skin**: Flexible circuits that detect pressure and temperature.

## Why it Matters
If we want robots in our homes—handling our eggs, helping the elderly out of bed, holding a baby—they cannot just see. They must be gentle. They must feel.
    `
  }
];
