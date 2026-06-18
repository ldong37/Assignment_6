/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");
/**
 * Add cookie storage function
*/
function setCookie(name, value, days) {
  let expires = "";

  if (days) {
    const date = new Date();
    date.setTime(
      date.getTime() + days * 24 * 60 * 60 * 1000);

    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
  const cookieName = name + "=";

  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();

    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length);
    }
  }

  return "";
}

/**
 * Implement checkUsername function to check for existing username cookie and update the UI accordingly.
 */
// checkUsername();
function checkUsername() {

  const username = getCookie("username");

  if (username) {

    document.getElementById("username").value = username;

    document.getElementById("username").disabled = true;

    newPlayerButton.classList.remove("hidden");

  } else {

    document.getElementById("username").disabled = false;

    newPlayerButton.classList.add("hidden");
  }
}
/**
 * Add calculateScore function to compute the user's score based on their answers and store it in cookies.
 */
function calculateScore() {
    let score = 0;
    const answers = document.querySelectorAll('input[type="radio"]:checked');
    answers.forEach((answer) => {   
        if (answer.dataset.correct === "true") {
            score++;
        }
    });
    return score;
}
/**
 * Add displayScores function to retrieve and display the list of scores from local storage.
 */
function displayScores() {
  const tbody =
    document.querySelector("#score-table tbody");

  tbody.innerHTML = "";

  const scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.forEach((entry) => {const row = document.createElement("tr");

    row.innerHTML = `
      <td>${entry.username}</td>
      <td>${entry.score}</td>
    `;

    tbody.appendChild(row);
  });
}

/**
 * Handles the form submission for the trivia game.
 * @param {*} event 
 * @returns 
 */
function handleFormSubmit(event) {
  event.preventDefault();

  let username =
    document.getElementById("username").value.trim();

  if (!username) {
    alert("Please enter a username.");
    return;
  }

  if (!getCookie("username")) {
    setCookie("username", username, 7);
  }

  const score = calculateScore();

  saveScore(username, score);

  displayScores();

  alert(`You scored ${score}/10`);

  checkUsername();

  fetchQuestions();
}
/**
 * Add newPlayer function to reset the game for a new player by clearing the username cookie and updating the UI.
 */
function newPlayer() {
  setCookie("username", "", -1);

  document.getElementById("username").value = "";

  checkUsername();
}
/**
 * Fetches trivia questions from the API and displays them.
*/
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false); // Hide loading state
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false); // Hide loading state on error
            });
    }
/**
* Toggles the display of the loading state and question container.
*
* @param {boolean} isLoading - Indicates whether the loading state should be shown.
*/
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
    }

 /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = ""; // Clear existing questions
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }
/**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${
                    answer === correctAnswer ? 'data-correct="true"' : ""
                }>
                ${answer}
            </label>
        `
            )
            .join("");
    }
// Event listeners for form submission and new player button
    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);
// Initialize the game
    checkUsername(); 
    fetchQuestions();
    displayScores();
});

    