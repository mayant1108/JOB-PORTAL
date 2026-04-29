const toPlainObject = (value) => {
  if (!value) {
    return {};
  }

  if (typeof value.toObject === 'function') {
    return value.toObject();
  }

  return value;
};

export const normalizeRole = (role) => {
  if (!role) {
    return 'candidate';
  }

  return role === 'employer' ? 'recruiter' : role;
};

export const splitList = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const parseExperience = (value, fallback = 0) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }

  const parsed = Number.parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeEducation = (value, fallback = []) => {
  if (value === undefined) {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [{ degree: value.trim() }];
  }

  return [];
};

export const buildProfileData = (payload = {}, existingProfile = {}, role = 'candidate') => {
  const baseProfile = toPlainObject(existingProfile);
  const profileInput = payload.profile && typeof payload.profile === 'object' ? payload.profile : {};
  const locationInput = profileInput.location && typeof profileInput.location === 'object'
    ? profileInput.location
    : {};
  const companyInput = profileInput.company && typeof profileInput.company === 'object'
    ? profileInput.company
    : {};
  const socialLinks = profileInput.socialLinks && typeof profileInput.socialLinks === 'object'
    ? profileInput.socialLinks
    : {};

  return {
    ...baseProfile,
    ...profileInput,
    headline:
      payload.currentRole ??
      payload.headline ??
      profileInput.headline ??
      baseProfile.headline,
    summary:
      payload.summary ??
      profileInput.summary ??
      baseProfile.summary,
    skills:
      payload.skills !== undefined
        ? splitList(payload.skills)
        : profileInput.skills !== undefined
          ? splitList(profileInput.skills)
          : baseProfile.skills || [],
    languages:
      profileInput.languages !== undefined
        ? splitList(profileInput.languages)
        : baseProfile.languages || [],
    experience:
      payload.experience !== undefined
        ? parseExperience(payload.experience, baseProfile.experience || 0)
        : profileInput.experience !== undefined
          ? parseExperience(profileInput.experience, baseProfile.experience || 0)
          : baseProfile.experience || 0,
    salaryExpectation:
      payload.salary ??
      payload.salaryExpectation ??
      profileInput.salaryExpectation ??
      baseProfile.salaryExpectation,
    portfolio:
      payload.portfolio ??
      profileInput.portfolio ??
      socialLinks.portfolio ??
      baseProfile.portfolio,
    github:
      payload.github ??
      profileInput.github ??
      socialLinks.github ??
      baseProfile.github,
    linkedin:
      payload.linkedin ??
      profileInput.linkedin ??
      socialLinks.linkedin ??
      baseProfile.linkedin,
    location: {
      ...(baseProfile.location || {}),
      ...locationInput,
      city:
        payload.preferredCity ??
        payload.location ??
        locationInput.city ??
        baseProfile.location?.city,
    },
    education: normalizeEducation(
      payload.education ?? profileInput.education,
      baseProfile.education || [],
    ),
    workHistory: Array.isArray(profileInput.workHistory)
      ? profileInput.workHistory
      : baseProfile.workHistory || [],
    company: role === 'recruiter'
      ? {
          ...(baseProfile.company || {}),
          ...companyInput,
          name:
            payload.companyName ??
            companyInput.name ??
            baseProfile.company?.name,
          description:
            payload.companyDescription ??
            companyInput.description ??
            baseProfile.company?.description,
          website:
            payload.companyWebsite ??
            companyInput.website ??
            baseProfile.company?.website,
        }
      : baseProfile.company || {},
  };
};

export const mergeUserUpdates = (user, updates = {}) => {
  if (updates.name !== undefined) {
    user.name = updates.name;
  }

  if (updates.phone !== undefined) {
    user.phone = updates.phone;
  }

  if (updates.username !== undefined) {
    user.username = updates.username;
  }

  if (updates.email !== undefined) {
    user.email = updates.email;
  }

  if (updates.profile && typeof updates.profile === 'object') {
    user.profile = buildProfileData(updates, user.profile, user.role);
  }

  return user;
};
