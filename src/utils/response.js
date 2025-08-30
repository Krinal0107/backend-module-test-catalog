export const ok = (data, meta = undefined) => (meta ? { ok: true, data, meta } : { ok: true, data });
export const fail = (message, code = 400) => ({ ok: false, message, code });


