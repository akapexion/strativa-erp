import { gooeyToast } from "goey-toast";

/**
 * Display both field-level errors and a summary toast notification.
 * Handles Zod validation errors, field error objects, and API response errors.
 */
export const showValidationToast = (errorOrMessage) => {
  let message = "Please correct the highlighted errors before submitting.";

  if (!errorOrMessage) {
    message = "Please check all required fields.";
  } else if (typeof errorOrMessage === "string") {
    message = errorOrMessage;
  } else if (errorOrMessage.flatten) {
    // Zod error
    const flattened = errorOrMessage.flatten();
    const fieldErrors = flattened.fieldErrors;
    const firstFieldKey = Object.keys(fieldErrors)[0];
    if (firstFieldKey && fieldErrors[firstFieldKey]?.[0]) {
      message = fieldErrors[firstFieldKey][0];
    } else if (flattened.formErrors?.[0]) {
      message = flattened.formErrors[0];
    }
  } else if (typeof errorOrMessage === "object") {
    // Generic field errors object: { field_name: "Error msg" }
    const firstKey = Object.keys(errorOrMessage)[0];
    if (firstKey && errorOrMessage[firstKey]) {
      message = errorOrMessage[firstKey];
    }
  }

  gooeyToast.error(message, {
    fillColor: "#FFF",
    bounce: 0.45,
    timing: { displayDuration: 3000 },
  });

  return message;
};

export default showValidationToast;
