function normalizeInput(value) {
  return String(value ?? '');
}

function encodeSimplePassword(password) {
  const normalized = normalizeInput(password);
  return Buffer.from(normalized, 'utf8').toString('base64');
}

function decodeSimplePassword(encodedPassword) {
  const normalized = normalizeInput(encodedPassword);
  if (!normalized) return '';

  try {
    const decodedBuffer = Buffer.from(normalized, 'base64');
    const reencoded = decodedBuffer.toString('base64').replace(/=+$/, '');
    const comparable = normalized.replace(/=+$/, '');
    if (reencoded !== comparable) return '';
    return decodedBuffer.toString('utf8');
  } catch (error) {
    return '';
  }
}

module.exports = {
  encodeSimplePassword,
  decodeSimplePassword,
};
