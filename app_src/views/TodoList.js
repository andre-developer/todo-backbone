import AppViewsTodo from './Todo';

export default class TodoList extends Backbone.View {
    constructor (options) {
        options.id = 'todo-list';
        options.className = 'ui divided relaxed list';
        super(options);
        this.collection.on('add', this.addItem, this);
    }

    render () {
        this.collection.each(this.addItem, this);
        return this;
    }

    addItem (todo, todoList, options) {
        let todoView = new AppViewsTodo({ model: todo });
        let todoViewEl = todoView.render().$el;
        this.$el.append(todoViewEl);

        if (options.setFocus) {
            todoView.setFocus();
        }

        return todoView;
    }
}