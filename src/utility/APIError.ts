import httpStatus from "http-status";

/**
 * Class representing an API error.
 * @extends Error
 */
export default class APIError extends Error {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */

  name: string;
  message: string;
  status: number;
  isPublic: boolean;
  isError: boolean;

  constructor(
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic: boolean = false
  ) {
    super(message);
    this.name = APIError.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    this.isError = true;
  }
}

module.exports = APIError;
