export function getDtThemeNotValidError(value: string): Error {
  return Error(
    `The provided theme value "${value}" for dtTheme is not a valid theme!`,
  );
}

export function getDtThemeVariantNotValidError(
  theme: string,
  variant: string,
): Error {
  return Error(
    `The provided variant "${variant}" for dtTheme "${theme} is not a valid variant!`,
  );
}
