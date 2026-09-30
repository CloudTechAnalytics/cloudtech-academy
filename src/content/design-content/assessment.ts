import type { AssessmentDef } from "../types";

/** Design & Content Essentials: a short check for each module (it awards the module badge) and a final assessment. */
export const DCE_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "dce-m01-check",
    courseId: "design-content-essentials",
    kind: "module",
    moduleId: "dce-m01",
    title: "Social Media Content with AI: module check",
    passingScore: 60,
    questions: [
      { id: "dce-m01-q1", prompt: "What are content themes (content pillars)?", options: ["The colours of your page", "A few main topics that most of your posts fit into", "Paid adverts", "Your profile picture"], answer: 1, explanation: "Two to four themes keep your posts focused and make ideas easier to find." },
      { id: "dce-m01-q2", prompt: "How do you make AI captions sound like your brand?", options: ["Describe your voice and paste an example you like", "Ask for 'a caption'", "Use as many emojis as possible", "Copy another business's captions"], answer: 0, explanation: "A description plus an example lets the AI copy your tone." },
      { id: "dce-m01-q3", prompt: "Why does the first line of a caption matter most?", options: ["It's the only part that's free", "It's often all people see before they tap 'more'", "Hashtags only work there", "It sets the font"], answer: 1, explanation: "The hook decides whether people keep reading." },
      { id: "dce-m01-q4", prompt: "What does 'repurposing' content mean?", options: ["Deleting old posts", "Turning one idea into posts for several platforms", "Buying followers", "Posting the same picture every day"], answer: 1, explanation: "One good idea can become a caption, a reel, a status and more." },
      { id: "dce-m01-q5", prompt: "Which of these is fine to post?", options: ["A client's photo without asking", "An AI image presented as a real result", "A photo you took, with your client's permission", "A price you haven't checked"], answer: 2, explanation: "Use your own photos with permission, and keep claims honest." },
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
      { id: "dce-m02-q1", prompt: "What's the easiest way to start a professional-looking design in Canva?", options: ["A blank page with ten fonts", "A template in the right size", "Copying someone's logo", "Drawing everything by hand"], answer: 1, explanation: "Templates give you a layout that already works; you change the content." },
      { id: "dce-m02-q2", prompt: "Your white headline is hard to read on a busy photo. What's the best fix?", options: ["Make it smaller", "Put a solid shape behind the text, or use a darker photo", "Add more text", "Use a sixth font"], answer: 1, explanation: "That's a contrast problem; a solid background behind the text fixes it." },
      { id: "dce-m02-q3", prompt: "How many fonts should most designs use?", options: ["One or two", "Five", "As many as possible", "A different one for every word"], answer: 0, explanation: "One for headings and one for body text keeps a design clean." },
      { id: "dce-m02-q4", prompt: "Which format is best for a social media post with text on it?", options: ["PNG", "MP3", "DOCX", "PDF Print"], answer: 0, explanation: "PNG keeps text sharp for social media images." },
      { id: "dce-m02-q5", prompt: "What do Canva's pink guide lines help you with?", options: ["Spelling", "Lining things up (alignment)", "Choosing colours", "Downloading"], answer: 1, explanation: "They appear when items line up with each other or the centre." },
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
      { id: "dce-m03-q1", prompt: "Which aspect ratio should you use for Reels, TikTok and WhatsApp status?", options: ["16:9 (wide)", "9:16 (tall)", "1:1 (square) only", "4:3"], answer: 1, explanation: "These are watched on phones held upright, so use tall 9:16." },
      { id: "dce-m03-q2", prompt: "You want to remove a boring part from the middle of a clip. What do you use?", options: ["Split at both ends of that part, then delete it", "Add music", "Change the aspect ratio", "Export twice"], answer: 0, explanation: "Split cuts the clip where the playhead is, so you can delete the section in between." },
      { id: "dce-m03-q3", prompt: "Why add captions to short videos?", options: ["They make the file smaller", "Many people watch with the sound off", "They're required to export", "They change the video's colours"], answer: 1, explanation: "Captions carry your message when the sound is off, and help people who can't hear it." },
      { id: "dce-m03-q4", prompt: "What should you do after CapCut writes automatic captions?", options: ["Nothing, they're always right", "Read them and fix any misheard words", "Delete the audio", "Make them bright red"], answer: 1, explanation: "Auto captions often mishear names and local words, so check them." },
      { id: "dce-m03-q5", prompt: "Which export setting is good for social media?", options: ["1080p at 30 frames per second", "240p", "The lowest quality available", "Audio only"], answer: 0, explanation: "1080p looks sharp on phones without making the file too large." },
    ],
  },
  {
    id: "design-content-essentials-final",
    courseId: "design-content-essentials",
    kind: "final",
    title: "Design & Content Essentials: final assessment",
    passingScore: 60,
    questions: [
      { id: "dce-f01", prompt: "What are content themes (content pillars)?", options: ["A few main topics most of your posts fit into", "The colours of your page", "Paid adverts", "Your logo"], answer: 0, explanation: "Two to four themes keep posts focused and ideas easy to find." },
      { id: "dce-f02", prompt: "How do you make AI-written captions sound like your brand?", options: ["Describe your voice and paste an example you like", "Use lots of emojis", "Ask for 'a caption'", "Copy another brand"], answer: 0, explanation: "A description plus an example lets the AI match your tone." },
      { id: "dce-f03", prompt: "Which is fine to post on a business page?", options: ["A client's photo without asking", "Your own photo, with the client's permission", "An AI image shown as a real result", "An unchecked price"], answer: 1, explanation: "Use your own photos with permission, and keep claims honest." },
      { id: "dce-f04", prompt: "Your headline is hard to read on a busy photo in Canva. What's the best fix?", options: ["Put a solid shape behind the text", "Make the text smaller", "Add another font", "Add more text"], answer: 0, explanation: "That's a contrast problem, and a solid background fixes it." },
      { id: "dce-f05", prompt: "How many fonts should most designs use?", options: ["One or two", "Five", "As many as possible", "One per word"], answer: 0, explanation: "One for headings and one for body text keeps a design clean." },
      { id: "dce-f06", prompt: "Which aspect ratio suits Reels, TikTok and WhatsApp status?", options: ["9:16 (tall)", "16:9 (wide)", "4:3", "It doesn't matter"], answer: 0, explanation: "They're watched on phones held upright." },
      { id: "dce-f07", prompt: "Why add captions to short videos?", options: ["Many people watch with the sound off", "They make the file smaller", "They're required to export", "They change the colours"], answer: 0, explanation: "Captions carry your message without sound, and help people who can't hear it." },
      { id: "dce-f08", prompt: "Which export setting suits social media video?", options: ["1080p at 30 frames per second", "240p", "Audio only", "The lowest quality"], answer: 0, explanation: "1080p looks sharp on phones without a huge file." },
    ],
  },
];
