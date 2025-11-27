const query = (selector, context=document) => context.querySelector(selector);
const queryAll = (selector, context=document) => context.querySelectorAll(selector);

export { query, queryAll };
export default query;