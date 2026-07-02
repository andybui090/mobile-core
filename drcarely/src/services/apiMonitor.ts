const apiMonitor = (response: any) => {
  const { ok, problem, status, duration, config } = response;
  const method = config?.method?.toUpperCase() || 'UNKNOWN';
  const url = config?.url || 'N/A';
  const timestamp = new Date().toISOString();

  const logMeta = {
    timestamp,
    method,
    url,
    status: status ?? 'N/A',
    duration: duration != null ? `${duration}ms` : 'N/A',
    problem: problem || 'NONE',
  };

  if (ok) {
    console.info(
      '%c✓ API SUCCESS',
      'color: #10b981; font-weight: bold;',
      url,
      logMeta,
    );
  } else {
    console.error(
      '%c✗ API FAILED',
      'color: #ef4444; font-weight: bold;',
      url,
      logMeta,
    );
  }
};

export default apiMonitor;
