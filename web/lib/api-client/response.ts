import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiCreated<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function apiError(code: string, message: string, status = 400, details?: unknown) {
  const errorBody: { code: string; message: string; details?: unknown } = { code, message };
  if (details !== undefined) {
    errorBody.details = details;
  }
  return NextResponse.json(
    { success: false, error: errorBody },
    { status }
  );
}

export function apiPaginated<T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
) {
  return NextResponse.json({ success: true, data, pagination });
}

export const ApiErrors = {
  notFound: (resource = "Resource") =>
    apiError("NOT_FOUND", `${resource} not found`, 404),
  unauthorized: () =>
    apiError("UNAUTHORIZED", "Authentication required", 401),
  forbidden: () =>
    apiError("FORBIDDEN", "Insufficient permissions", 403),
  badRequest: (message: string, details?: unknown) =>
    apiError("VALIDATION_ERROR", message, 400, details),
  internal: (message = "Internal server error") =>
    apiError("INTERNAL_ERROR", message, 500),
  rateLimited: () =>
    apiError("RATE_LIMITED", "Too many requests, please try again later", 429),
};
