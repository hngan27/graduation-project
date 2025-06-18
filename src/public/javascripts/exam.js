function saveAnswer(radio, courseId, examId) {
  const questionId = radio.name;
  const answerId = radio.value;

  // Lưu vào localStorage
  const key = `exam_${examId}_answers`;
  let answers = {};
  try {
    answers = JSON.parse(localStorage.getItem(key)) || {};
  } catch (e) {}
  answers[questionId] = answerId;
  localStorage.setItem(key, JSON.stringify(answers));

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

// Lưu thời gian còn lại vào localStorage mỗi giây
function saveExamTimer(examId, remaining) {
  localStorage.setItem(`exam_${examId}_timer`, remaining);
}

// Xóa dữ liệu tạm khi nộp bài hoặc hết giờ
function clearExamStorage(examId) {
  localStorage.removeItem(`exam_${examId}_answers`);
  localStorage.removeItem(`exam_${examId}_timer`);
}

// Khôi phục đáp án đã chọn khi load lại trang
function restoreAnswers(examId) {
  const key = `exam_${examId}_answers`;
  let answers = {};
  try {
    answers = JSON.parse(localStorage.getItem(key)) || {};
  } catch (e) {}
  Object.keys(answers).forEach(qid => {
    const val = answers[qid];
    const radio = document.querySelector(`input[type=radio][name='${qid}'][value='${val}']`);
    if (radio) radio.checked = true;
  });
}

// Khôi phục thời gian còn lại
function restoreTimer(examId, defaultTime) {
  const saved = localStorage.getItem(`exam_${examId}_timer`);
  if (saved !== null) {
    return parseInt(saved, 10);
  }
  return defaultTime;
}

// Tự động gọi khi trang load (nếu có examId)
document.addEventListener('DOMContentLoaded', function() {
  const examId = window.examId || (window.exam && window.exam.id);
  if (!examId) return;
  restoreAnswers(examId);
});
