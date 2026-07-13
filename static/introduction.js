const button = document.getElementById("collectExpression");
const key = "latinAcademy.collectible.sineQuaNon";

if (localStorage.getItem(key) === "collected") {
  button.textContent = "✓ Collected";
  button.classList.add("collected");
}

button.addEventListener("click", () => {
  localStorage.setItem(key, "collected");
  button.textContent = "✓ Collected";
  button.classList.add("collected");
});
