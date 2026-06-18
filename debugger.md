# Debugging Analysis

## Breakpoint 1 - fetchQuestions()

Location:
Inside fetchQuestions() before the API call.

Observation:
The loading screen becomes visible and the API request begins.

After Stepping:
The response object is returned from the API and converted to JSON.

---

## Breakpoint 2 - displayQuestions()

Location:
Inside displayQuestions().

Observation:
The questions array contains 10 trivia questions.

After Stepping:
Question elements are dynamically inserted into the DOM.

---

## Breakpoint 3 - handleFormSubmit()

Location:
At the beginning of handleFormSubmit().

Observation:
The username and selected answers are available.

After Stepping:
Score is calculated and saved into localStorage.

---

## Critical State Analysis

The most important state occurred during handleFormSubmit() after calculateScore() executed.

At this point the score variable contained the total number of correct answers. This value was then passed into saveScore() and persisted using localStorage. This confirmed that user answers were processed correctly and the game logic worked as expected.