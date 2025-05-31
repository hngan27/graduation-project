function saveAnswer(radio, courseId, examId) {
  const questionId = radio.name;
  const answerId = radio.value;

  fetch(`/courses/${courseId}/exam/${examId}/save-answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questionId, answerId }),
  })
  .then(response => response.json())
  .then(data => console.log('Answer saved:', data))
  .catch((error) => console.error('Error:', error));
}
