export type ValidNumber = 1 | 2 | 4;

export async function getNumber(): Promise<ValidNumber> {
  return 1;
}

export const MY_NUMBER: ValidNumber = 1;
