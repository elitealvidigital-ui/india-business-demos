/* India-only demo analytics configuration. This public endpoint accepts only
 * anonymous demo events; Meta callbacks are separately guarded by phone ID. */
window.INDIA_DEMO_TRACKING = Object.freeze({
  version: '1',
  enabled: true,
  endpoint: 'https://script.google.com/macros/s/AKfycbz7V8xZFi1hsiN7V-VXUN9qRPYym4gdHNYUn8ZyqePJ52OIQ5lYmen0TF8oddlWYf0/exec',
  source: 'india_demo',
});
