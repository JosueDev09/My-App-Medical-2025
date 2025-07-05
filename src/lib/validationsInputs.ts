

export function getInputValidationClasses(value: string, options?: { minLength?: number }) {
  if (value.trim() === "") {
    return "border border-red-500 focus:ring-red-500";
  }

  if (options?.minLength && value.trim().length < options.minLength) {
    return "border border-yellow-500 focus:ring-yellow-500";
  }

  return "border border-green-500 focus:ring-green-500";
}