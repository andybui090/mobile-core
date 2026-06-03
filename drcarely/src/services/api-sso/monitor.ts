const apiMonitor = (response: any) => {
  response.ok
    ? console.log('[CALL API SUCCESS]: ' + response.config.url)
    : console.log('[CALL API FAILED]: ' + response.config.url);
  // console.log('[DURATION]: ' + response.duration);
  // console.log('[METHOD]: ' + response.config);
  // if (response.config.method == 'get') {
  //   console.log('[PARAMS]: ' + response.config.params);
  // } else {
  //   console.log('[BODY_DATA]: ' + response.config.data);
  // }
  // console.log('Dữ liệu API trả về data: ' + JSON.stringify(response));
  // console.log('Dữ liệu API trả về problem: ' + response.problem);
  // console.log('Dữ liệu API trả về ok: ' + response.ok);
  // console.log('Dữ liệu API trả về status: ' + response.status);
  // console.log('Dữ liệu API trả về headers: ' + response.headers);
  // console.log('Data post: ' + JSON.stringify(response.config.headers)); //show config header
  // console.log('Dữ liệu API trả về config: ' + JSON.stringify(response.config));
};

export default apiMonitor;
