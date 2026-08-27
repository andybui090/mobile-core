const apiMonitor = (response: any) => {
  const isOk = response.ok;
  const url = response.config?.url || response.originalError?.config?.url || '';
  const duration = response.duration || 0;

  if (isOk) {
    console.log(`[CALL API SUCCESS]: ${url} [DURATION]: ${duration}ms`);
  } else {
    console.log(
      `[CALL API FAILED]: ${url} [STATUS]: ${response.status} [PROBLEM]: ${response.problem} [ERROR]:`,
      JSON.stringify(response.data || response.originalError?.message),
    );
  }

  if (__DEV__ && console.tron && typeof console.tron.display === 'function') {
    try {
      console.tron.display({
        name: 'API RESPONSE',
        preview: `${response.status} ${response.config?.method?.toUpperCase()} ${url} (${duration}ms)`,
        value: {
          url,
          method: response.config?.method,
          status: response.status,
          duration: `${duration}ms`,
          headers: response.config?.headers,
          params: response.config?.params,
          dataSent: response.config?.data,
          response: response.data,
          problem: response.problem,
        },
        important: !isOk,
      });
    } catch {
      // Ignore Reactotron logging errors if socket is not open
    }
  }
};

export default apiMonitor;