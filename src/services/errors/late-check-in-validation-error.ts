export class LateCheckInValidateError extends Error {
  constructor(limitTime: number) {
    super(
      `The check-in can only be validated until ${limitTime} minutes of its creation.`,
    );
  }
}
