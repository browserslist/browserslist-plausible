/**
 * @typedef {'Desktop'|'Tablet'|'Mobile'} Device
 *   The API can respond with 'Laptop' as well. However, this is treated as
 *   'Desktop'.
 * 
 *   See: https://github.com/plausible/analytics/pull/2711
 * 
 * @typedef {'visitors'|'visits'|'pageviews'|'views_per_visit'|'bounce_rate'|
 *           'visit_duration'|'events'|'scroll_depth'|'percentage'|
 *           'conversion_rate'|'group_conversion_rate'|'total_revenue'|
 *           'time_on_page'} Metric
 * 
 * @typedef {object} Query
 * @property {string} site_id
 * @property {string} date_range
 * @property {Metric[]} metrics
 * @property {string[]?} dimensions
 * 
 * @typedef {object} QueryResult
 * @property {unknown[]} metrics
 * @property {unknown[]} dimensions
 * 
 * @typedef {object} QueryResponse
 * @property {QueryResult[]} results
 * @property {unknown} meta
 * @property {unknown} query
 * 
 * @typedef {object} PlausibleError
 * @property {string} error
 */

export {};
