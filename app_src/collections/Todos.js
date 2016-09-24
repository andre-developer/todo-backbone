import AppModelsTodo from '../models/Todo';

export default class Todos extends Backbone.Collection {
    constructor () {
        super()
        this.localStorage = new Backbone.LocalStorage("TodosCollection");
        this.model = AppModelsTodo;
    }
}