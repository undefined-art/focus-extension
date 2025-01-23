const urlParams = new URLSearchParams(window.location.search);
const blockedUrl = urlParams.get("url");

let displayText = "Unknown Domain";

if (blockedUrl) {
  try {
    const url = new URL(blockedUrl);
    displayText = url.hostname;
  } catch {
    displayText = "Invalid URL";
  }
}

document.getElementById("blockedUrl").textContent = displayText;

const fallbackQuotes = [
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
];

const fallbackProblems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    url: "https://leetcode.com/problems/two-sum/",
  },
  {
    title: "Add Two Numbers",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/add-two-numbers/",
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
  },
];

function displayQuote(quote) {
  document.getElementById("quoteText").textContent = `"${quote.text}"`;
  document.getElementById("quoteAuthor").textContent = `- ${quote.author}`;
}

function displayProblem(problem) {
  document.getElementById("problemTitle").textContent = problem.title;
  document.getElementById(
    "problemDifficulty"
  ).textContent = `Difficulty: ${problem.difficulty}`;
  document.getElementById("problemLink").href = problem.url;
}

async function fetchRandomQuote() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("https://api.quotable.io/random", {
      signal: controller.signal,
      mode: "cors",
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error("Failed to fetch quote");
    }

    const data = await response.json();

    if (!data.content || !data.author) {
      console.error("Invalid quote data received:", data);
      throw new Error("Invalid quote data received");
    }

    return {
      text: data.content,
      author: data.author,
    };
  } catch (error) {
    console.error(
      "Error fetching quote:",
      error.name === "AbortError" ? "Request timeout" : error.message
    );
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
}

async function fetchRandomProblem() {
  try {
    const response = await fetch("https://leetcode.com/api/problems/all/");

    if (!response.ok) throw new Error("Failed to fetch problems");

    const data = await response.json();
    const randomProblem =
      data.stat_status_pairs[
        Math.floor(Math.random() * data.stat_status_pairs.length)
      ];

    return {
      title: randomProblem.stat.question__title,
      difficulty: ["Easy", "Medium", "Hard"][
        randomProblem.difficulty.level - 1
      ],
      url: `https://leetcode.com/problems/${randomProblem.stat.question__title_slug}/`,
    };
  } catch (error) {
    console.error("Error fetching problem:", error);

    return fallbackProblems[
      Math.floor(Math.random() * fallbackProblems.length)
    ];
  }
}

// Initialize quote and problem
fetchRandomQuote().then(displayQuote);
fetchRandomProblem().then(displayProblem);
