/**
 * Validates step 2 fields (profile summary) of the application wizard.
 * Returns true when valid; false after calling snackbar.error with a message.
 * Does NOT mutate any state — caller is responsible for all state updates.
 */
export const validateStep2 = (
  purpose,
  formData,
  resumeValidationError,
  coverLetterValidationError,
  snackbar
) => {
  const missingFields = [];
  const invalidFields = [];

  // Common validations
  if (!formData.age) {
    missingFields.push('age');
  } else if (!/^\d+$/.test(formData.age) || formData.age < 18 || formData.age > 80) {
    invalidFields.push('age (must be 18-80, numbers only)');
  }

  if (!formData.highestEducation) missingFields.push('highest education');
  if (!formData.country) missingFields.push('country');

  if (formData.state) {
    if (!/^[a-zA-Z\s-]+$/.test(formData.state)) {
      invalidFields.push('state (letters, spaces, hyphens only)');
    } else if (formData.state.length > 50) {
      invalidFields.push('state (max 50 characters)');
    }
  }

  if (purpose === 'work') {
    if (!formData.workExperience) missingFields.push('work experience');

    if (!formData.jobTitle) {
      missingFields.push('job title');
    } else {
      const jobTitleWords = formData.jobTitle.trim().split(/\s+/);
      if (!/^[a-zA-Z\s-]+$/.test(formData.jobTitle)) {
        invalidFields.push('job title (letters, spaces, hyphens only)');
      } else if (jobTitleWords.length > 5) {
        invalidFields.push('job title (max 5 words)');
      } else if (formData.jobTitle.length > 50) {
        invalidFields.push('job title (max 50 characters)');
      }
    }

    if (!formData.resume) {
      missingFields.push('resume');
    } else if (resumeValidationError) {
      invalidFields.push(`resume (${resumeValidationError})`);
    }

    if (coverLetterValidationError) {
      invalidFields.push(`cover letter (${coverLetterValidationError})`);
    }
  } else if (purpose === 'study') {
    if (!formData.studyLevel) missingFields.push('study level');

    if (!formData.stream) {
      missingFields.push('stream');
    } else if (!/^[a-zA-Z\s-]+$/.test(formData.stream)) {
      invalidFields.push('stream (letters, spaces, hyphens only)');
    } else if (formData.stream.length > 50) {
      invalidFields.push('stream (max 50 characters)');
    }

    if (!formData.percentage) {
      missingFields.push('percentage');
    } else if (
      isNaN(formData.percentage) ||
      formData.percentage < 0 ||
      formData.percentage > 100
    ) {
      invalidFields.push('percentage (must be 0-100)');
    }

    if (!formData.budget) {
      missingFields.push('budget');
    } else if (
      !/^\d+$/.test(formData.budget) ||
      formData.budget < 0 ||
      formData.budget.length > 15
    ) {
      invalidFields.push('budget (positive number, max 15 digits)');
    }
  }

  if (missingFields.length > 0) {
    snackbar.error(`Please fill in: ${missingFields.join(', ')}`);
    return false;
  }
  if (invalidFields.length > 0) {
    snackbar.error(`Invalid fields: ${invalidFields.join(', ')}`);
    return false;
  }
  return true;
};
