import { settings } from './defaults.js'
import { shallowMerge as merge } from './helpers.js'

export default class CustomSelect {

    constructor({inputElement, options = {}}) {
        this.settings = merge(settings, options);
        this.inputElement = inputElement;
        this.insertCategoryInput = null;
        this.insertCategoryButton = null;
        this.dropdown = null;
        this.wrapper = null;
        this.inputWrapper = null;

        this.build();
        this.loadEvents();
    }

    loadEvents() {
        document.addEventListener('click', (event) => {
            if (!event.target.closest('[data-custom-select]')) {
                this.dropdown.style.display = 'none';
            }
        });

        this.wrapper.addEventListener('input', (event) => {

            if (event.target.hasAttribute('data-insert-category-input')) {
                const value = event.target.value;
                this.insertCategoryButton.style.display = value.length > 0 
                    ? 'block' 
                    : 'none';
                return;
            }

        });

        this.wrapper.addEventListener('click', (event) => {

            
            if (event.target.hasAttribute('data-option')) {
                const optionValue = event.target.dataset.optionValue;
                this.inputElement.value = optionValue;
                this.dropdown.style.display = "none";
                return;
            }

            if (event.target.hasAttribute('data-custom-select')) {
                this.dropdown.style.display = "block";
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

                if (this.inputElement.value === optionValue) {
                    this.inputElement.value = "";
                }

                event.target.parentNode.remove();
                event.stopPropagation();

                return;
            }
        })
    }

    destroy() {
        this.events.forEach(([target, event, fn]) => {
            target.removeEventListener(event, fn);
        });
        return this;
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
            <li data-option data-option-value=${value} class="option">
                ${value}
                <span data-action-delete class="delete-icon">
                    <i style="pointer-events: none;" class="bi bi-trash3"></i>
                </span>
            </li>
        `;

        return CustomSelect.parse(dropdownItemTemplate);
    }

    createDropdown() {
        // d-none
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

    getParent() {
       return this.inputElement.parentNode;
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
        this.inputWrapper.prepend(this.inputElement);

        this.wrapper.append(this.inputWrapper);
        this.wrapper.append(this.dropdown);
    }

    static create({inputElement, options}) {
        return new CustomSelect({inputElement, options});
    }
}