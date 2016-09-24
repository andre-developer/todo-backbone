import { UtilsTextEdition } from './../utils/textEdition';

export default class Todo extends Backbone.View {
    constructor (options) {
        options.tagName = 'li';
        options.events = {
            'click input[type=checkbox]': 'toggleDoneStatus',
            'keyup .contentEditable': 'updateTitle',
            'click .remove': 'remove'
        };

        super(options);
        this.className = () => {
            return this.model.get('doneStatus') ? 'done' : '';
        };
        this.template = _.template('<input type="checkbox" <%= checked %>/><div contenteditable="true" class="contentEditable noBorder"><%= title %></div>' +
            '<div class="remove">x</div>');
        this.inputTemplate = _.template('<input type="text" value="<%= value %> />');
        this.persistModel = _.debounce(() => {
            this.model.save();
        }, 800);
        this.model.on('change', this.persistModel, this);
    }

    updateTitle (e) {
        var newTitle = $(e.currentTarget).text();
        if (newTitle) {
            this.model.set({ title: newTitle });
        } else {
            this.remove();
        }
    }

    toggleDoneStatus (e) {
        var checkbox = $(e.currentTarget);
        var isChecked = checkbox.is(':checked');

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