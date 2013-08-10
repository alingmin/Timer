var window = global.window,
    document = window.document,
    $ = window.$,
    util = require('util'),
    utility = require('utility/utility'),
    i18n = require('./i18n'),
    date = utility.date,
    templates = {
        tplTable: '<table class="table table-bordered"><thead><tr><th>%s</th><th>%s</th><th>%s</th></tr></thead><tbody></tbody><tfoot><tr><td colspan="2">%s</td><td>%s</td></tr></tfoot></table>',
        tplCell: '<div class="tablecell">0:0</div>',
        
        render: function(){
            var tpl = arguments[0];
            arguments[0] = this[tpl];
            return util.format.apply(null, arguments);
        }
    };



function TimeSet(){
    var me = this;
    me._cellTimes = [];
}

utility.defineProperties(TimeSet.prototype, {
    mapping: function(key, val){
        var me = this;
        if(val !== undefined){
            (me._elementMapping || (me._elementMapping = {}))[key] = val;
        }
        return me._elementMapping[key];
    },
    
    initialize: function(parent){
        this._parent = parent;
    },
    
    render: function(container){
        if(this._container){return;}
        var me = this,
            th = i18n.table_th,
            table = me.mapping('table', $(templates.render('tplTable', th[0], th[1], th[2], th[2], templates.tplCell)).appendTo(container))
                .css('margin', '10px 0px');
        me.mapping('totalTime', $('tfoot div', table));//
        me._container = container;
    },
    
    
    update: function(){
        var me = this,
            parentInstance = me._parent,
            peek = utility.peek(me._cellTimes),
            viewCurrTime = me.mapping('currTime'),
            now = new Date(),
            expendTime = now - peek[1];
        peek[1] = now;
        peek[2] = peek[1] - peek[0];
        viewCurrTime.text(date.format(peek[1], i18n.timePattern));
        me.mapping('totalTime').text(date.toMinute(parentInstance._customTime - parentInstance._totalTime + expendTime));
        return {
            expendTime: expendTime,
            rowTotalTime: peek[1] - peek[0]
        };
    },
    
    setRowTotalTime: function(){
        var me = this,
            peek = utility.peek(me._cellTimes);
        me.mapping('expendTime').text(date.toMinute(peek[2]));
    },
    
    setTotalTime: function(){
        var me = this,
            timeController = me._parent;
        me.mapping('totalTime').text();
    },
    
    appendRow: function(){
        var me = this,
            table = me.mapping('table'),
            tableEl = table.get(0),
            tbody = tableEl.tBodies[0],
            row = tbody.insertRow(tbody.rows.length),
            cell = templates.render('tplCell'),
            startTime = me.mapping('startTime', $(cell).appendTo(row.insertCell(0))),
            currTime = me.mapping('currTime', $(cell).appendTo(row.insertCell(1))),
            expendTime = me.mapping('expendTime', $(cell).appendTo(row.insertCell(2))),
            cellTime = [new Date(), new Date(), 0];
        me._cellTimes.push(cellTime);
        startTime.text(date.format(cellTime[0], i18n.timePattern));
        currTime.text(date.format(cellTime[1], i18n.timePattern));
        expendTime.html('&nbsp;');
    }
});

module.exports = TimeSet;