var window = global.window,
    document = window.document,
    $ = window.$,
    config = require('./config'),
    i18n = require('./i18n'),
    util = require('util'),
    utility = require('utility/utility'),
    TimeSet = require('./TimeSet'),
    Timer = require('./Timer'),
    date = utility.date,
    templates = {
        tplFieldset: '<fieldset><legend>%s</legend></fieldset>',
        tplInput: '<input type="text" size="4" maxlength="4" value="%s"/>',
        tplLabel: '<span>(%s)</span>',
        tplButton: '<button class="btn btn-success">%s</button>',
        tplProgress: '<div><div class="progress progress-success progress-striped"><div class="bar" style="width: 100%"></div><div class="percent"></div>&nbsp;</div></div>',
        tplExpendTime: '<span class="label label-inverse">0:0</span>',
        
        render: function(){
            var tpl = arguments[0];
            arguments[0] = this[tpl];
            return util.format.apply(null, arguments);
        }
    };
    

function TimeController(options){
    var me = this;
    me._id = 'tang-' + window.setTimeout(function(){}, 0);
    me._options = $.extend({title: 'Default'}, options || {});
    me._timeSet = new TimeSet();
    me._timeSet.initialize(this);
    me._timer = new Timer();
    me._timer.on('onpulse', function(){
        var retTime = me._timeSet.update();
        me._totalTime -= retTime.expendTime;//剩余总时间
        me._viewTotalTime = date.toMinute(me._totalTime);
        me._progressBar();
        me._expendLabel(retTime.rowTotalTime);
    });
    me._customTime = //用户输入的时间
    me._viewCustomTime = //用户输入的可视时间
    me._totalTime = //当前剩下可用的总时间
    me._viewTotalTime = null; //当前剩下可用的可视总时间
    
}
utility.defineProperties(TimeController.prototype, {
    mapping: function(key, val){
        var me = this;
        if(val !== undefined){
            (me._elementMapping || (me._elementMapping = {}))[key] = val;
        }
        return me._elementMapping[key];
    },
    
    _onToggle: function(evt){
        var me = this,
            target = $(evt.target),
            input = me.mapping('timeInput').prop('disabled', true),
            timeSet = me._timeSet,
            timer = me._timer;
            
        if(target.hasClass('btn-success')){//需要变成stop
            if(!me._customTime){//第一次点击开始
                me._viewCustomTime = input.prop('value');
                me._customTime = date.minuteToMillisecond(me._viewCustomTime);
                me._viewTotalTime = date.toMinute(me._customTime);
                me._totalTime = date.minuteToMillisecond(me._viewTotalTime);
            }
            
            target.removeClass('btn-success')
                .addClass('btn-danger')
                .html(i18n.btn_toggle.stop);
            me._progressBar();//render progressbar
            me._expendLabel();//render expandLabel
            me.mapping('progress').addClass('active');
            timeSet.render(me.mapping('fieldset'));//render table
            timeSet.appendRow();
            timer.start();
        }else{
            target.removeClass('btn-danger')
                .addClass('btn-success')
                .html(i18n.btn_toggle.start);
            timeSet.setRowTotalTime();//将表格最后一行进行设置
            me.mapping('progress').removeClass('active');
            timer.stop();
        }
    },
    
    render: function(container){
        if(this._container){return;}
        var me = this,
            opts = me._options,
            fieldset, timeInput, button;
        me._container = container;
        fieldset = me.mapping('fieldset', $(templates.render('tplFieldset', opts.title)).appendTo(container));
        timeInput = me.mapping('timeInput', $(templates.render('tplInput', config.defaultTime)).appendTo(fieldset))
            .css({width: '30px', margin: '0px'});
        fieldset.append('&nbsp;');//分隔符
        $(templates.render('tplLabel', i18n.comm_unit)).appendTo(fieldset);
        fieldset.append('&nbsp;');//分隔符
        button = me.mapping('toggleButton', $(templates.render('tplButton', i18n.btn_toggle.start)).appendTo(fieldset))
            .click(function(evt){me._onToggle(evt)});
        fieldset.append('&nbsp;');//分隔符
    },
    
    /**
     * 创建或是更新进度条
     */
    _progressBar: function(){
        var me = this,
            progress = me.mapping('progress'),
            bar = me.mapping('bar'),
            percent = me.mapping('percent'),
            val = Math.round(me._totalTime/me._customTime * 100),
            cssName = val < 15 ? 'progress-danger' : (val < 50 ? 'progress-warning' : 'progress-success'),
            clearCss = val < 15 ? 'progress-warning' : (val < 50 ? 'progress-success' : false);
//        debugger;
        if(!progress){
            progress = me.mapping('progress', $(templates.render('tplProgress')).appendTo(me.mapping('fieldset'))
                .css({position: 'relative', display: 'inline-block', width: '30%'}).find('.progress')
                .css({margin: '0px'}));
            bar = me.mapping('bar', $('.bar', progress));
            percent = me.mapping('percent', $('.percent', progress));
        }
        clearCss && progress.removeClass(clearCss).addClass(cssName);
        percent.text(me._viewTotalTime);
        bar.css('width', (val < 0 ? 100 : val) + '%');
    },
    
    _expendLabel: function(time){
        var me = this,
            expend = me.mapping('expendLabel');
        if(!expend){
            expend = me.mapping('expendLabel', $(templates.render('tplExpendTime')).appendTo(me.mapping('fieldset')))
                .css('margin', '0px 5px');
        }
        expend.text(date.toMinute(time || 0));
    }
});
module.exports = TimeController;