import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export function getErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined
): string {
  if (!error) return "";

  // FetchBaseQueryError 
  if ("status" in error) {
    const data = error.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || `Error ${error.status}`;
  }

  // SerializedError 
  if ("message" in error && error.message) {
    return error.message;
  }

  return "Unknown error";
}
