document.getElementById("btn").addEventListener("click", async () => {
  const res = await fetch("http://localhost:3000/api");
  const data = await res.json();
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
});
