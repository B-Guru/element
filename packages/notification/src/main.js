import Vue from 'vue';
var NotificationConstructor = Vue.extend(require('./main.vue'));

var instance;
var instances = [];
var seed = 1;

var Notification = function(options) {
  options = options || {};
  var userOnClose = options.onClose;
  var id = 'notification_' + seed++;

  options.onClose = function() {
    Notification.close(id, userOnClose);
  };

  instance = new NotificationConstructor({
    data: options
  });
  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;

  var topDist = 0;
  for (var i = 0, len = instances.length; i < len; i++) {
    topDist += instances[i].$el.offsetHeight + 16;
  }
  topDist += 16;
  instance.top = topDist;
  instances.push(instance);
};

Notification.close = function(id, userOnClose) {
  for (var i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i]);
      }
      var index = i;
      var removedHeight = instances[i].dom.offsetHeight;
      instances.splice(i, 1);
      break;
    }
  }

  if (len > 1) {
    for (i = index; i < len - 1 ; i++) {
      instances[i].dom.style.top = parseInt(instances[i].dom.style.top, 10) - removedHeight - 16 + 'px';
    }
  }
};

export default Notification;
