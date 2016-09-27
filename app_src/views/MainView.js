import AppCollectionsTodos from './../collections/Todos';
import AppTodoForm from './TodoForm';
import AppViewsTodoList from './TodoList';

export default class mainView extends Backbone.View {
    constructor (options) {
        super(options);
        this.todosCollection = new AppCollectionsTodos();
        this.todosCollection.on('add remove reset', this.updateStats, this);

        this.todosCollection.fetch({
            success: _.bind(this.render, this)
        });
        this.init();
    }

    updateStats () {
        let count = this.todosCollection.length;
        this.$('.totalItems').text(count);
    }

    render () {
        let todoListView = new AppViewsTodoList({ collection: this.todosCollection });
        this.$('main .myList').html(todoListView.render().$el);
    }

    init() {
        let todoFormView = new AppTodoForm({ todosCollection: this.todosCollection });
        this.updateStats();
        this.$('main').append(todoFormView.render().$el);
    }
}