const getAllowedDomains = async () => {
  const { allowedDomains } = await chrome.storage.sync.get(["allowedDomains"]);
  return allowedDomains || [];
};

const saveAllowedDomains = async (domains) => {
  await chrome.storage.sync.set({ allowedDomains: domains });
};

const getBlockerEnabled = async () => {
  const { blockerEnabled } = await chrome.storage.sync.get(["blockerEnabled"]);

  return blockerEnabled !== false;
};

const setBlockerEnabled = async (enabled) => {
  await chrome.storage.sync.set({ blockerEnabled: enabled });
};
