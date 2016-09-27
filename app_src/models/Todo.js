export default class Todo extends Backbone.Model {
    constructor (options) {
        super(options);
        this.localStorage = new Backbone.LocalStorage("TodosCollection");
    }
}