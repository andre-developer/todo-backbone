import AppViewsTodo from './Todo';

export default class TodoList extends Backbone.View {
    constructor (options) {
        options.tagName = 'ul';
        options.id = 'todo-list';
        super(options);
        this.collection.on('add', this.addItem, this);
    }

    render () {
        this.collection.each(this.addItem, this);
        return this;
    }

    addItem (todo, todoList, options) {
        var todoView = new AppViewsTodo({ model: todo });
        var todoViewEl = todoView.render().$el;
        this.$el.append(todoViewEl);
        if (options.setFocus) {
            todoView.setFocus();
        }
        return todoView;
    }
}