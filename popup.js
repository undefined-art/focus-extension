document.addEventListener("DOMContentLoaded", () => {
  const toggleBlocking = document.getElementById("toggleBlocking");
  const newDomainInput = document.getElementById("newDomain");
  const addDomainButton = document.getElementById("addDomain");
  const blockedDomainsList = document.getElementById("blockedDomains");

  chrome.storage.sync.get(["isEnabled", "blockedDomains"], (result) => {
    toggleBlocking.checked = result.isEnabled ?? true;
    updateBlockedDomainsList(result.blockedDomains || []);
  });

  toggleBlocking.addEventListener("change", () => {
    chrome.storage.sync.set({ isEnabled: toggleBlocking.checked });
  });

  function addDomain() {
    const domain = newDomainInput.value.trim().toLowerCase();

    if (!domain) return;

    chrome.storage.sync.get(["blockedDomains"], (result) => {
      const blockedDomains = result.blockedDomains || [];

      if (!blockedDomains.includes(domain)) {
        blockedDomains.push(domain);

        chrome.storage.sync.set({ blockedDomains }, () => {
          updateBlockedDomainsList(blockedDomains);
          newDomainInput.value = "";
        });
      }
    });
  }

  addDomainButton.addEventListener("click", addDomain);

  newDomainInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addDomain();
  });

  // Update blocked domains list
  function updateBlockedDomainsList(domains) {
    blockedDomainsList.innerHTML = "";

    domains.forEach((domain) => {
      const li = document.createElement("li");
      li.textContent = domain;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.innerHTML = '<span class="material-icons">delete</span>';

      deleteButton.addEventListener("click", () => {
        const updatedDomains = domains.filter((d) => d !== domain);
        chrome.storage.sync.set({ blockedDomains: updatedDomains }, () => {
          updateBlockedDomainsList(updatedDomains);
        });
      });

      li.appendChild(deleteButton);
      blockedDomainsList.appendChild(li);
    });
  }
});
