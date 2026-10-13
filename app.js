
/*

 * StudyMate - Student Success Dashboard

 * Uses vanilla JavaScript and ES modules.
 * APIs: Open Library and Free Dictionary.

 */

const gradeForm = document.querySelector("#grade-form");
const subjectInput = document.querySelector("#subject");
const gradeInput = document.querySelector("#grade");
const gradeList = document.querySelector("#grade-list");
const averageOutput = document.querySelector("#average");

const bookForm = document.querySelector("#book-form");
const bookQuery = document.querySelector("#book-query");
const bookResults = document.querySelector("#book-results");
const bookStatus = document.querySelector("#book-status");

const wordForm = document.querySelector("#word-form");
const wordQuery = document.querySelector("#word-query");
const wordResult = document.querySelector("#word-result");

const yearOutput = document.querySelector("#year");

const grades = [];

// Display the current year in the footer.
yearOutput.textContent = new Date().getFullYear();

/**

 * Calculate and display the student's grade average.

 */
function updateAverage() {
  if (grades.length === 0) {
    averageOutput.textContent = "Average: No grades yet";
    return;
  }

  const total = grades.reduce((sum, item) => sum + item.grade, 0);
  const average = total / grades.length;

  averageOutput.textContent =
    `Average: ${average.toFixed(1)}% (${grades.length} subjects)`;
}

/**

 * Display grades as dynamically generated list items.
 */
function renderGrades() {
  gradeList.replaceChildren();

  grades.forEach((item, index) => {
    const listItem = document.createElement("li");
    const result = document.createElement("span");
    const removeButton = document.createElement("button");

    result.textContent =
      `${item.subject}: ${item.grade}% — ` +
      (item.grade >= 50 ? "Pass" : "Needs improvement");

    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute(
      "aria-label",
      `Remove ${item.subject} grade`
    );

    removeButton.addEventListener("click", () => {
      grades.splice(index, 1);
      renderGrades();
      updateAverage();
    });

    listItem.append(result, " ", removeButton);
    gradeList.append(listItem);
  });
}

// Handle grade form submissions.
gradeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const subject = subjectInput.value.trim();
  const grade = Number(gradeInput.value);

  if (!subject || gradeInput.value.trim() === "" ||
      !Number.isFinite(grade) || grade < 0 || grade > 100) {
    return;
  }

  grades.push({ subject, grade });

  renderGrades();
  updateAverage();
  gradeForm.reset();
  subjectInput.focus();
});

/**
 * Search the Open Library public API.
 */
bookForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = bookQuery.value.trim();

  if (!query) return;

  bookStatus.textContent = "Searching for books...";
  bookStatus.className = "";
  bookResults.replaceChildren();

  try {
    const url =
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("The book service is unavailable.");
    }

    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      bookStatus.textContent = "No books found. Try another search.";
      return;
    }

    bookStatus.textContent = `Found ${data.docs.length} book results.`;

    data.docs.forEach((book) => {
      const card = document.createElement("article");
      card.className = "result-card";

      const title = document.createElement("h3");
      title.textContent = book.title || "Untitled book";

      const author = document.createElement("p");
      author.textContent =
        `Author: ${book.author_name?.slice(0, 3).join(", ") || "Unknown"}`;

      const published = document.createElement("p");
      published.textContent =
        `First published: ${book.first_publish_year || "Unknown"}`;

      card.append(title, author, published);
      bookResults.append(card);
    });
  } catch (error) {
    console.error("Book search error:", error);
    bookStatus.textContent =
      "Unable to load books. Check your internet connection and try again.";
    bookStatus.className = "status-error";
  }
});

/**
 * Look up a word using the Free Dictionary API.
 */
wordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const word = wordQuery.value.trim();

  if (!word) return;

  wordResult.replaceChildren();

  const status = document.createElement("p");
  status.textContent = "Looking up your word...";
  wordResult.append(status);

  try {
    const url =
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Word not found.");
    }

    const data = await response.json();
    const entry = data[0];

    wordResult.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = entry.word;

    wordResult.append(heading);

    entry.meanings.slice(0, 3).forEach((meaning) => {
      const section = document.createElement("section");
      section.className = "result-card";

      const partOfSpeech = document.createElement("h4");
      partOfSpeech.textContent = meaning.partOfSpeech;

      const definition = document.createElement("p");
      definition.textContent =
        meaning.definitions[0]?.definition || "No definition available.";

      section.append(partOfSpeech, definition);
      wordResult.append(section);
    });
  } catch (error) {
    console.error("Dictionary lookup error:", error);

    wordResult.replaceChildren();

    const message = document.createElement("p");
    message.className = "status-error";
    message.textContent =
      "Word not found, or the dictionary service is unavailable. Try another word.";

    wordResult.append(message);
  }
});