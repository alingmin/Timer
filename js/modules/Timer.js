var window = global.window,
    $ = window.$,
    util = require('util'),
    utility = require('utility/utility'),
    events = require('events');

function Timer(options){
    var me = this;
    events.EventEmitter.call(me);
    me._timer = null;
    me._options = $.extend({
        interval: 500
    }, options);
}
util.inherits(Timer, events.EventEmitter);

utility.defineProperties(Timer.prototype, {
    _interval: function(){
        var me = this,
            interval = me._options.interval;
        me._timer = window.setTimeout(function(){
            me.emit('onpulse');
            me._interval();
        }, interval);
    },
    
    start: function(){
        var me = this;
        window.clearTimeout(me._timer);
        me._interval();
    },
    
    stop: function(){
        window.clearTimeout(this._timer);
    },
    
    isRunning: function(){
        return !!this._timer;
    }
});


module.exports = Timer;