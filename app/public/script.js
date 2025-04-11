document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
  
    const res = await fetch("/add-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username }),
    });
  
    const result = await res.text();
    alert(result);
    document.getElementById("username").value = "";
  });
  
  document.getElementById("loadBtn").addEventListener("click", async () => {
    const res = await fetch("/users");
    const users = await res.json();
  
    const userList = document.getElementById("userList");
    userList.innerHTML = "";
  
    users.forEach((user) => {
      const li = document.createElement("li");
      li.innerText = user.name;
      userList.appendChild(li);
    });
  });
  