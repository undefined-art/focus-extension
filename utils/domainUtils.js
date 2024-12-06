const isValidDomain = (domain) => {
  const pattern = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

  return pattern.test(domain);
};

const isDomainAllowed = (domain, allowedDomains) => {
  return allowedDomains.some((allowedDomain) => {
    if (domain === allowedDomain) return true;

    if (domain.endsWith("." + allowedDomain)) return true;

    return false;
  });
};
