export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: 'too_large' | 'invalid_json' };

export async function readBoundedJson(
  request: Request,
  maxBytes: number,
): Promise<JsonBodyResult> {
  const contentLength = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { ok: false, reason: 'too_large' };
  }

  const body = request.body;
  if (!body) return { ok: false, reason: 'invalid_json' };

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        void reader.cancel().catch(() => undefined);
        return { ok: false, reason: 'too_large' };
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const text = new TextDecoder().decode(bytes);
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    void reader.cancel().catch(() => undefined);
    return { ok: false, reason: 'invalid_json' };
  }
}
