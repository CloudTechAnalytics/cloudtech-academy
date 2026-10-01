import type { AssessmentDef } from "../types";

/**
 * Design & Content Essentials: a check for each module (it awards the module badge, and
 * unlocks only after the module's tasks are done) and a final assessment. Questions are
 * scenarios with plausible wrong answers.
 */
export const DCE_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "dce-m01-check",
    courseId: "design-content-essentials",
    kind: "module",
    moduleId: "dce-m01",
    title: "Social Media Content with AI: module check",
    passingScore: 60,
    questions: [
      { id: "dce-m01-q1", prompt: "A salon posts only price lists and 'book now' adverts, and engagement is low. What would most likely help?", options: ["Post the price list more often", "Add themes people value, like hair-care tips and behind the scenes, so selling is only part of the mix", "Use more hashtags", "Post at midnight"], answer: 1, explanation: "People follow accounts that are useful or interesting; trust leads to bookings." },
      { id: "dce-m01-q2", prompt: "AI gives you a calendar with a daily time-lapse reel, but you have no tripod and little time. What should you do?", options: ["Follow it exactly", "Replace what you can't make with posts you can, and add your real promotions and dates", "Abandon the calendar", "Ask for a bigger calendar"], answer: 1, explanation: "A plan you can actually follow beats an impressive one you can't." },
      { id: "dce-m01-q3", prompt: "Which caption opening line is the strongest hook?", options: ["Hello everyone, hope you're all doing well today!", "Six hours of work. Six weeks of easy mornings.", "We are pleased to inform our esteemed customers", "#braids #hair #abuja"], answer: 1, explanation: "The first line is all people see before 'more'; it should make them want to read on." },
      { id: "dce-m01-q4", prompt: "Which hashtag approach fits this course's advice?", options: ["15 popular tags like #love #instagood", "3-5 specific tags your customers actually search, like #abujahair", "No hashtags ever", "One very long hashtag"], answer: 1, explanation: "A few relevant tags beat a pile of generic ones." },
      { id: "dce-m01-q5", prompt: "Your reel opens with your logo spinning for three seconds. What's the risk?", options: ["None, logos build brands", "Most viewers decide in the first two seconds and scroll past before seeing the point", "The logo will be blurry", "Reels can't show logos"], answer: 1, explanation: "Open with the result or the hook; put the logo at the end or small in a corner." },
    ],
  },
  {
    id: "dce-m02-check",
    courseId: "design-content-essentials",
    kind: "module",
    moduleId: "dce-m02",
    title: "Design with Canva: module check",
    passingScore: 60,
    questions: [
      { id: "dce-m02-q1", prompt: "A flyer uses thin white text on a busy photo. Which rule is broken, and what's the fix?", options: ["Few fonts: add another font", "Contrast: put a solid dark shape behind the text or use a plain background", "Alignment: centre the photo", "Space: make the photo bigger"], answer: 1, explanation: "Text must stand out clearly from what's behind it." },
      { id: "dce-m02-q2", prompt: "Your design uses five fonts. What should you do?", options: ["Add a sixth for the price", "Use one bold font for the headline and one plain font for everything else", "Make each font a different colour", "Nothing, variety is good"], answer: 1, explanation: "One or two fonts look professional; five look chaotic." },
      { id: "dce-m02-q3", prompt: "Some lines are left-aligned, some centred, one pushed to the right edge. What fixes it?", options: ["Align everything the same way, using Canva's guide lines", "Make the text bigger", "Add a border", "Change the colours"], answer: 0, explanation: "Consistent alignment makes a design look intentional." },
      { id: "dce-m02-q4", prompt: "What's the best check before downloading a social post?", options: ["Zoom in to 400%", "Zoom out to the size of a post in a phone feed: can you read the headline and see what to do?", "Print it", "Count the elements"], answer: 1, explanation: "People see your design small, while scrolling." },
      { id: "dce-m02-q5", prompt: "Which download format suits a social media post with text on it?", options: ["PNG", "PDF Print", "MP4", "GIF"], answer: 0, explanation: "PNG keeps text sharp. Use PDF Print for printing." },
    ],
  },
  {
    id: "dce-m03-check",
    courseId: "design-content-essentials",
    kind: "module",
    moduleId: "dce-m03",
    title: "Video Editing with CapCut: module check",
    passingScore: 60,
    questions: [
      { id: "dce-m03-q1", prompt: "Which opening shot best fits a 20-second food video?", options: ["The logo with music", "The presenter saying 'Hi guys, welcome back'", "Steam rising as the lid comes off, with the price on screen", "A wide shot of the kitchen building"], answer: 2, explanation: "Lead with the result; people decide in about two seconds." },
      { id: "dce-m03-q2", prompt: "Auto-captions wrote 'Ikea' instead of 'Ikeja'. What does this tell you?", options: ["The video must be re-recorded", "Auto-captions often get names and local words wrong, so read and correct every line", "Turn captions off", "Speak louder next time and don't check"], answer: 1, explanation: "Uncorrected captions make a business look careless." },
      { id: "dce-m03-q3", prompt: "Why do on-screen text and captions matter so much?", options: ["They're required by law", "Many people watch with the sound off", "They make the file smaller", "They improve the colour"], answer: 1, explanation: "Words on screen carry the message when the sound is off." },
      { id: "dce-m03-q4", prompt: "You want a popular song in a video for your business page. What's the risk?", options: ["None", "It may be copyrighted, and the video can be muted or removed", "It makes the video too long", "CapCut won't export it"], answer: 1, explanation: "Use music licensed for commercial use, or a voiceover." },
      { id: "dce-m03-q5", prompt: "Which export settings suit social media?", options: ["480p, 15 fps", "1080p, 30 fps", "4K, 120 fps", "Any, it doesn't matter"], answer: 1, explanation: "Good quality without a huge file." },
    ],
  },
  {
    id: "design-content-essentials-final",
    courseId: "design-content-essentials",
    kind: "final",
    title: "Design & Content Essentials: final assessment",
    passingScore: 60,
    questions: [
      { id: "dce-f01", prompt: "What are content themes (content pillars) for?", options: ["Choosing your profile colours", "Giving most of your posts a focus your audience cares about", "Paying for adverts", "Picking hashtags"], answer: 1, explanation: "Two to four themes keep posts focused and ideas easy to find." },
      { id: "dce-f02", prompt: "How do you make AI captions sound like your brand?", options: ["Ask for 'professional' captions", "Describe your brand voice and show an example caption you like", "Add more emojis", "Use the first draft"], answer: 1, explanation: "Showing an example is more precise than describing a style." },
      { id: "dce-f03", prompt: "What does a good caption need?", options: ["As many hashtags as possible", "A hook, one idea, a call to action that says how, and a few specific hashtags", "Only emojis", "The full price list"], answer: 1, explanation: "Hook, one idea, action." },
      { id: "dce-f04", prompt: "Which is the clearest flyer headline?", options: ["Weekend Bootcamp for Beginners Aged 16-25 in Port Harcourt", "LEARN CODING!!!", "Learn to code in one weekend", "Welcome"], answer: 2, explanation: "Short and says the benefit; details go below." },
      { id: "dce-f05", prompt: "Which list is the four design rules from this course?", options: ["Size, colour, logo, price", "Contrast, alignment, space, few fonts", "Photos, videos, music, text", "Bold, italic, underline, shadow"], answer: 1, explanation: "Most amateur designs break one of these four." },
      { id: "dce-f06", prompt: "Which aspect ratio is right for TikTok and Reels?", options: ["16:9", "1:1", "9:16", "4:3"], answer: 2, explanation: "9:16 is tall, filling a phone screen." },
      { id: "dce-f07", prompt: "What should the first two seconds of a short video show?", options: ["Your logo", "A greeting", "The result or the hook", "Black screen"], answer: 2, explanation: "Most viewers decide whether to keep watching almost immediately." },
      { id: "dce-f08", prompt: "Before posting a video with auto-captions, you should…", options: ["Post it straight away", "Read and correct every caption, and watch it muted to check it still makes sense", "Delete the captions", "Make the captions bigger only"], answer: 1, explanation: "Captions often mishear names and local words." },
    ],
  },
];
