const ElSpinner = require('./src/spinner');

ElSpinner.install = function(Vue) {
  Vue.component(ElSpinner.name, ElSpinner);
};

module.exports = ElSpinner;
