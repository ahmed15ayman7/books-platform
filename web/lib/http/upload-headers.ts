/** Strip Content-Type so fetch can set multipart/form-data with boundary. */
export function headersForMultipartUpload(
  headers?: HeadersInit,
): HeadersInit | undefined {
  if (!headers) return undefined;

  if (headers instanceof Headers) {
    const copy = new Headers(headers);
    copy.delete("Content-Type");
    copy.delete("content-type");
    return copy;
  }

  if (Array.isArray(headers)) {
    return headers.filter(
      ([key]) => key.toLowerCase() !== "content-type",
    );
  }

  const copy = { ...headers } as Record<string, string>;
  for (const key of Object.keys(copy)) {
    if (key.toLowerCase() === "content-type") {
      delete copy[key];
    }
  }
  return copy;
}
