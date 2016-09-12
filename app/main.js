"use strict";
var app = app || {
    views: {},
    models: {},
    collections: {},
    helpers: {}
};
$(function () {
    app.models.todo = Backbone.Model.extend({
        defaults: {
            title: "",
            doneStatus: false
        }
    });

    app.collections.todos = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("SomeCollection"),
        model: app.models.todo
    });

    app.views.todo = Backbone.View.extend({
        tagName: 'li',
        events: {
            'click input[type=checkbox]': 'toggleDoneStatus',
            'keyup .contentEditable': 'updateTitle',
            'click .remove': 'remove'
        },
        className: function () {
            return this.model.get('doneStatus') ? 'done' : '';
        },
        template: _.template('<input type="checkbox" <%= checked %>/><div contenteditable="true" class="contentEditable noBorder"><%= title %></div>' +
                                '<div class="remove">x</div>'),
        inputTemplate: _.template('<input type="text" value="<%= value %> />'),
        initialize: function () {
            this.model.on('change:doneStatus', this.updateDoneStatus, this);
        },
        updateTitle: function (e) {
            var newTitle = $(e.currentTarget).text();
            this.model.save({ title: newTitle });
        },
        toggleDoneStatus: function (e) {
            var checkbox = $(e.currentTarget);
            var isChecked = checkbox.is(':checked');

            this.model.save({ 'doneStatus': !!isChecked});
        },
        updateDoneStatus: function (m, value) {
            if (value) {
                this.$el.addClass('done');
            } else {
                this.$el.removeClass('done');
            }
        },
        setFocus: function () {
            app.helpers.caretPlacer(this.$('.contentEditable').get(0));
        },
        remove: function () {

            this.model.destroy();
            this.$el.remove();
        },
        render: function () {
            this.$el.html(this.template({
                title: this.model.get('title'),
                checked: this.model.get('doneStatus') ? 'checked="checked"' : ''
            }));
            return this;
        }
    });

    app.views.todoList = Backbone.View.extend({
        tagName: 'ul',
        id: 'todo-list',
        initialize: function () {
            this.collection.on('add', this.addItem, this);
        },
        render: function () {
            this.collection.each(this.addItem, this);
            return this;
        },
        addItem: function (todo, todoList, options) {
            var todoView = new app.views.todo({ model: todo });
            var todoViewEl = todoView.render().$el;
            this.$el.append(todoViewEl);
            if (options.setFocus) {
                todoView.setFocus();
            }
            return todoView;
        }
    });

    app.views.todoForm = Backbone.View.extend({
        initialize: function (options) {
            this.todosCollection = options.todosCollection;
        },
        events: {
            'focus .addTodo': 'onAddTodoFocus',
            'keyup .addTodo': 'onAddTodoKeyUp'
        },
        template: _.template('<div class="addTodo noBorder" contenteditable="true" data-placeholder="+ Add new todo list"></div>'),
        onAddTodoFocus: function () {
            this.$('.addTodo').html('');
        },
        onAddTodoKeyUp: function () {
            var newTodo = new app.models.todo({ title: this.$('.addTodo').html() });
            this.todosCollection.add(newTodo, { setFocus: true });
            this.$('.addTodo').html('');
        },
        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });

    app.views.mainView = Backbone.View.extend({
        el: '#app',
        initialize: function() {
            this.todosCollection = new app.collections.todos();
            this.todosCollection.on('add remove reset', this.updateStats, this)
            //this.todosCollection.on('sync', this.render, this);
            this.todosCollection.on('all', function() { console.log(arguments); });

            this.todosCollection.fetch({
                success: _.bind(this.render, this)
            });
            this.init();
        },
        updateStats: function () {
            var count = this.todosCollection.length;
            this.$('header span').text(count);
        },
        render: function () {
            var todoListView = new app.views.todoList({ collection: this.todosCollection });
            this.$('main .myList').html(todoListView.render().$el);
        },
        init: function () {
            var todoFormView = new app.views.todoForm({ todosCollection: this.todosCollection });
            this.updateStats();
            this.$('main').append(todoFormView.render().$el);
        }
    });

    new app.views.mainView();
});

app.helpers.caretPlacer = function (el) {
    if (!el) return;
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
};