import { settings } from './defaults.js'
import { shallowMerge as merge } from './helpers.js'

export const EVENTS = {
    ADD_ITEM: 'customselect:add:item',
    DELETE_ITEM: 'customselect:add:item',
    FOCUS_SELECT: 'customselect:focus:select',
    CLICK_OUTSIDE: 'customselect:click:outside',
    MOUNTED: 'customselect:mounted',
};

export default class CustomSelect {

    constructor({inputElement, options = {}}) {
        this.settings = merge(settings, options);
        this.inputElement = inputElement;
        this.insertCategoryInput = null;
        this.insertCategoryButton = null;
        this.dropdown = null;
        this.wrapper = null;
        this.inputWrapper = null;
        this.events = [];

        this.build();
        this.loadEvents();
        this.dispatch(EVENTS.MOUNTED, { self: this });
    }

    loadEvents() {
        this.addEvent(document,'click', (event) => {
            if (!event.target.closest('[data-custom-select]')) {
                this.dropdown.style.display = 'none';
                this.dispatch(EVENTS.CLICK_OUTSIDE);
            }
        });

        this.addEvent(this.wrapper, 'input', (event) => {

            if (event.target.hasAttribute('data-custom-select')) {
                const hasString = (text) => text.includes(event.target.dataset.optionValue.toLowerCase());

                this.dropdown.querySelectorAll('[data-option]').forEach((option) => {
                    option.style.display = hasString(option.textContent.toLowerCase()) 
                        ? "block" 
                        : 'none';
                });

                return this.dispatch(EVENTS.FOCUS_SELECT, {
                    dropdownStatus: hasString(option.textContent.toLowerCase())
                        ? "opened" 
                        : "closed"
                })
            }

            if (event.target.hasAttribute('data-insert-category-input')) {
                const value = event.target.value;
                this.insertCategoryButton.style.display = value.length > 0 
                    ? 'block' 
                    : 'none';
                return;
            }

        });

        this.addEvent(this.wrapper, 'click', (event) => {

            if (event.target.hasAttribute('data-option')) {
                const optionValue = event.target.dataset.optionValue;
                this.inputElement.value = optionValue;
                this.dropdown.style.display = "none";
                return;
            }

            if (event.target.hasAttribute('data-custom-select')) {
                console.log();
                this.dropdown.style.display = this.dropdown.style.display === "block"
                    ? "none"
                    : "block";
                return;
            }

            if (event.target.hasAttribute('data-insert-category-button')) {
                const value = this.insertCategoryInput.value;
                
                if (!value) return;

                this.addDropdownItem(value);
                this.insertCategoryInput.value = '';

                return;
            }

            if (event.target.closest('[data-action-delete]')) {
                const optionValue = event.target.parentNode.dataset.optionValue;

                const canDelete = confirm(this.settings.confirmationText(optionValue));

                if (!canDelete) return;

                if (this.inputElement.value === optionValue) {
                    this.inputElement.value = "";
                }

                event.target.parentNode.remove();

                this.dispatch(EVENTS.DELETE_ITEM, { value: optionValue });

                event.stopPropagation();

                return;
            }
        });

        

        this.addEvent(this.wrapper, 'keydown', (event) => {
            if (event.target.hasAttribute('data-insert-category-input')) {
                if (event.key !== 'Enter') return;

                const value = this.insertCategoryInput.value;

                if (!value) return;
                if (this.verifyIfExists(value)) {
                    return alert(this.settings.alertText(value));
                }

                this.addDropdownItem(value);
                this.insertCategoryInput.value = '';

                this.dispatch(EVENTS.ADD_ITEM, { value });

                return;
            }
        });
    }

    addEvent(target, event, fn) {
        this.events = [...(this.events || []), [target, event, fn]];
        target.addEventListener(event, fn);
    }

    verifyIfExists(value) {
        return Array.from(this.dropdown.querySelectorAll('[data-option]')).find((item) => {
            return item.dataset.optionValue.toLowerCase() === value.toLowerCase();
        });
    }

    dispatch(event, args = {}) {
        document.dispatchEvent(new CustomEvent(event, { detail: { ...args } }));
        return this;
    }

    on(event, fn) {
        document.addEventListener(event, fn);
        return this;
    }

    destroy() {
        this.events.forEach(([target, event, fn]) => {
            target.removeEventListener(event, fn);
        });

        const parent = this.getParent(this.wrapper);
        parent.insertBefore(this.inputElement, this.wrapper);
        this.wrapper.remove();
    }

    createWrapper() {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-custom-select', '');
        return wrapper;
    }

    createInputWrapper() {
        const inputWrapper = `
            <div data-input-select class="inputSelect w-100 d-flex">
                <!-- add inputElement here -->
                <div class="select-icon">
                    <i style="pointer-events: none;" class="bi bi-chevron-down"></i>
                </div>
            </div>
        `;

        return CustomSelect.parse(inputWrapper);
    }

    createInsertCategory() {
        const insertCategoryInputTemplate = `
            <li data-insert-category class="insert-category">
                <i class="bi bi-plus-lg"></i>
            </li>
        `;

        return CustomSelect.parse(insertCategoryInputTemplate);
    }

    createInsertCategoryInput() {
        const insertCategoryInputTemplate = `
            <input data-insert-category-input type="text" placeholder="Adicione uma nova categoria">
        `;

        return CustomSelect.parse(insertCategoryInputTemplate);
    }

    createInsertCategoryButton() {
        const insertCategoryButton = document.createElement('button');
        insertCategoryButton.setAttribute('data-insert-category-button', '');
        insertCategoryButton.style.display = "none";
        insertCategoryButton.textContent = "Adicionar";
        return insertCategoryButton;
    }

    addDropdownItem(item) {
        const dropdownItem = this.createDropdownItem(item);
        this.dropdown.prepend(dropdownItem);
    }

    createDropdownItem(value) {
        const dropdownItemTemplate = `
            <li data-option data-option-value="${value}" class="option">
                ${value}
                <span data-action-delete class="delete-icon">
                    <i style="pointer-events: none;" class="bi bi-trash3"></i>
                </span>
            </li>
        `;

        return CustomSelect.parse(dropdownItemTemplate);
    }

    createDropdown() {
        const dropdownTemplate = `
            <ul data-dropdown class="dropdown"></ul>
        `;

        const dropdown = CustomSelect.parse(dropdownTemplate);

        dropdown.style.display = "none";

        this.settings.predefinedList.forEach(item => {
            dropdown.append(this.createDropdownItem(item))
        });
        
        return dropdown;
    }

    getParent(target = this.inputElement) {
       return target.parentNode;
    }

    closeDropdown() {
        this.dropdown.classList.add("d-none");
    }

    removeButton() {
        if (this.cateforyButton) {
            this.cateforyButton.remove();
            this.cateforyButton = null;
        }
    }

    static parse(templateString) {
        const root = document.createElement('div');
        root.insertAdjacentHTML('afterbegin', templateString);
        return root.children[0];
    }

    build() {
        this.wrapper = this.createWrapper();
        this.inputWrapper = this.createInputWrapper();
        this.insertCategory = this.createInsertCategory();
        this.insertCategoryInput = this.createInsertCategoryInput();
        this.insertCategoryButton = this.createInsertCategoryButton();
        this.dropdown = this.createDropdown();

        this.getParent().insertBefore(this.wrapper, this.inputElement);

        this.insertCategory.append(this.insertCategoryInput);
        this.insertCategory.append(this.insertCategoryButton);

        this.dropdown.append(this.insertCategory);

        this.inputElement.setAttribute('data-custom-select', '');

        this.inputWrapper.prepend(this.inputElement);

        this.wrapper.append(this.inputWrapper);
        this.wrapper.append(this.dropdown);
    }

    static create({inputElement, options}) {
        return new CustomSelect({inputElement, options});
    }
}