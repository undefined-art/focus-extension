document.addEventListener("DOMContentLoaded", async () => {
  const blockerEnabled = await getBlockerEnabled();

  document.getElementById("blockerToggle").checked = blockerEnabled;
  loadDomains();
  document.getElementById("addDomain").addEventListener("click", addDomain);

  document.getElementById("newDomain").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addDomain();
    }
  });

  document
    .getElementById("blockerToggle")
    .addEventListener("change", async (e) => {
      await setBlockerEnabled(e.target.checked);
    });
});

const loadDomains = async () => {
  const domains = await getAllowedDomains();
  displayDomains(domains);
};

const displayDomains = async (domains) => {
  const domainsList = document.getElementById("domainsList");
  domainsList.innerHTML = "";

  domains.forEach((domain) => {
    const li = document.createElement("li");
    li.className = "domain-item";

    const domainText = document.createElement("span");
    domainText.textContent = domain;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-btn";
    removeButton.textContent = "Remove";
    removeButton.onclick = () => removeDomain(domain);

    li.appendChild(domainText);
    li.appendChild(removeButton);
    domainsList.appendChild(li);
  });
};

const addDomain = async () => {
  const input = document.getElementById("newDomain");
  const domain = input.value.trim().toLowerCase();

  if (!domain) return;

  if (!isValidDomain(domain)) {
    alert("Please enter a valid domain");
    return;
  }

  const domains = await getAllowedDomains();

  if (!domains.includes(domain)) {
    domains.push(domain);
    await saveAllowedDomains(domains);
    displayDomains(domains);
    input.value = "";
  }
};

const removeDomain = async (domainToRemove) => {
  const domains = await getAllowedDomains();
  const updatedDomains = domains.filter((domain) => domain !== domainToRemove);
  await saveAllowedDomains(updatedDomains);
  displayDomains(updatedDomains);
};
