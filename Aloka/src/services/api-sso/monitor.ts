const apiMonitor = (response: any) => {
  response.ok
    ? console.log('[CALL API SUCCESS]: ' + response.config.url + ' [DURATION]: ' + response.duration + 'ms')
    : console.log('[CALL API FAILED]: ' + response.config.url + ' [DURATION]: ' + response.duration + 'ms');
};

export default apiMonitor;