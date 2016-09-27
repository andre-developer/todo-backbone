import { UtilsTextEdition } from './../utils/textEdition';

export default class Todo extends Backbone.View {
    constructor (options) {
        options.events = {
            'click input[type=checkbox]': 'toggleDoneStatus',
            'keyup .contentEditable': 'updateTitle',
            'click .remove': 'remove'
        };
        options.className = 'item';

        super(options);

        if (this.model.get('doneStatus')) {
            this.$el.addClass('done');
        }

        this.template = _.template('<div class="ui checkbox"><input type="checkbox" <%= checked %>/> <label contenteditable="true" class="contentEditable noBorder"><%= title %></label></div>' +
            '<i class="remove icon right floated"></i>');
        this.inputTemplate = _.template('<input type="text" value="<%= value %> />');
        this.persistModel = _.debounce(() => {
            this.model.save();
        }, 800);
        this.model.on('change', this.persistModel, this);
    }

    updateTitle (e) {
        let newTitle = $(e.currentTarget).text();
        if (newTitle) {
            this.model.set({ title: newTitle });
        } else {
            this.remove();
        }
    }

    toggleDoneStatus (e) {
        let checkbox = $(e.currentTarget);
        let isChecked = checkbox.is(':checked');

        this.model.set({ 'doneStatus': !!isChecked});

        if (isChecked) {
            this.$el.addClass('done');
        } else {
            this.$el.removeClass('done');
        }
    }

    setFocus () {
        UtilsTextEdition.caretPlacer(this.$('.contentEditable').get(0));
    }

    remove () {
        this.model.destroy();
        this.$el.remove();
    }

    render () {
        this.$el.html(this.template({
            title: this.model.get('title'),
            checked: this.model.get('doneStatus') ? 'checked="checked"' : ''
        }));
        return this;
    }
}