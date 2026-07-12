document.querySelectorAll('.activity-grid button').forEach((button) => {
  button.addEventListener('click', () => {
    alert('This activity will be connected in the next build.');
  });
});

document.querySelector('.profile-button').addEventListener('click', () => {
  alert('Learner profiles will be added after the homepage.');
});
