var util = require('util'),
    i18n = require('./i18n'),
    TimeController = require('./TimeController'),
    window = global.window,
    document = window.document,
    $ = window.$,
    view = module.exports = {
        templates: {
            tplTitle: [
                '<h3>%s</h3>'
            ].join(''),
            
            tplTab: [
                '<ul class="nav nav-tabs" id="timeTab">',
                  '<li class="active"><a href="#timer">%s</a></li>',
                  '<li><a href="#search">%s</a></li>',
                '</ul>',
                '<div class="tab-content">',
                  '<div class="tab-pane active" id="timer"></div>',
                  '<div class="tab-pane" id="search"></div>',
                '</div>'].join(''),
                
            tplCreate: [
                '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">%s</button>'
            ].join(''),
            
            tplDialog: [
                '<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
                  '<div class="modal-header">',
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
                    '<h3 id="myModalLabel">%s</h3>',
                  '</div>',
                  '<div class="modal-body">',
                    '<input id="inputId" type="text" placeholder="%s"/>',
                  '</div>',
                  '<div class="modal-footer">',
                    '<button class="btn" data-dismiss="modal" aria-hidden="true">%s</button>',
                    '<button id="primaryId" class="btn btn-primary">%s</button>',
                  '</div>',
                '</div>'
            ].join('')
        },
        
        initializeLayout: function(){
            $('body').append(util.format(this.templates.tplTitle, i18n.comm_title));
            this.initTab();
            this.initCreatButton();
        },
        
        initTab: function(){
            var c = i18n.title_tab;
            $('body').append(util.format(this.templates.tplTab, c[0], c[1]));
            $('#timeTab').css('margin-bottom', '5px');
            $('#timeTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            })
        },
        initCreatButton: function(){
            var c = i18n.comm_prompt;
            $(util.format(this.templates.tplCreate, i18n.btn_create)).appendTo($('#timer').css('padding', '5px'));
            $(util.format(this.templates.tplDialog, c.title, c.des, c.cancel, c.ok)).appendTo(document.body);
            $('#primaryId').click(function(evt){
                var input = $('#inputId'),
                    title = input.prop('value');
                view.timeView({title: title || 'Default'});
                $('#myModal').modal('hide');
                input.prop('value', '');
            });
//            view.timeView();
        },        
        timeView: function(title){
            var c = new TimeController(title);
            c.render($('#timer'));
        }
    };