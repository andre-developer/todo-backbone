import AppModelsTodo from '../models/Todo';

export default class TodoForm extends Backbone.View {
    constructor (options) {
        options.events = {
            'focus .addTodo': 'onAddTodoFocus',
            'keyup .addTodo': 'onAddTodoKeyUp'
        };

        super(options);
        this.todosCollection = options.todosCollection;
        this.template = _.template('<div class="addTodo noBorder" contenteditable="true" data-placeholder="+ Add new todo list"></div>');
    }

    onAddTodoFocus () {
        this.$('.addTodo').html('');
    }
    onAddTodoKeyUp () {
        let title = this.$('.addTodo').html();

        if (title.length) {
            var newTodo = new AppModelsTodo({ title: this.$('.addTodo').html() });
            this.todosCollection.add(newTodo, { setFocus: true });
            this.$('.addTodo').html('');
        }
    }

    render () {
        this.$el.html(this.template());
        return this;
    }
}