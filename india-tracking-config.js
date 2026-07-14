/* India-only demo analytics configuration. This public endpoint accepts only
 * anonymous demo events; Meta callbacks are separately guarded by phone ID. */
window.INDIA_DEMO_TRACKING = Object.freeze({
  version: '1',
  enabled: true,
  endpoint: 'https://script.google.com/macros/s/AKfycbyoU1toM2TDNjQQQXlRQAHxVxUxiqQzuY3tclAMGJeQ2qU_HGS9JINDMzOXGw0gvt7H/exec',
  source: 'india_demo',
});
