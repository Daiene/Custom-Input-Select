import { settings } from './defaults.js'
import { shallowMerge as merge } from './helpers.js'

export default class CustomSelect {

    constructor(inputElement, options) {
        this.settings = merge(settings, options);
        this.inputElement = inputElement;
        this.insertCategoryInput = null;
        this.dropdown = null;
        this.categoryButton = null;
        this.wrapper = null;
        this.inputWrapper = null;

        this.build();
    }

    loadEvents() {
        this.addEvent(document, "click", (e) => {
            if (e.target.closest("[data-dropdown]") === null) {
              this.closeDropdown();
            }
        });

        this.addEvent(this.wrapper, 'click', (e) => {

            if (e.target.hasAttribute('data-dropdown-category-button')) {
                const categoryValue = this.insertCategoryInput.value.trim();
               
                if (categoryValue === "") {
                    return;
                }

                const category = this.createDropdownItem(categoryValue);

                this.dropdown.insertBefore(category, this.insertCategoryInput);

                this.inputField.value = categoryValue;
                this.insertCategoryInput.value = "";
                this.categoryButton.style.display = "none";

                return;
            }

            if (e.target.hasAttribute('data-dropdown')) {
                const target = e.target;
                const isOption = target.classList.contains("option");
                const isDeleteIcon = target.classList.contains("bi-trash3");
            
                if (isOption && !isDeleteIcon) {
                  this.inputField.value = target.textContent.trim();
                } else if (isDeleteIcon) {
                    
                  const confirmDelete = confirm(
                    "Tem certeza que quer deletar essa categoria?"
                  );

                  if (confirmDelete) {
                    target.closest(".option").remove();
                    this.inputField.value = null;
                  }
                }
            
                return this.closeDropdown();
            }

        }) 

        this.addEvent(this.inputField, "click", (e) => {
            this.dropdown.classList.toggle("d-none");
            this.removeButton();
            e.stopPropagation();
        });

        this.addEvent(this.insertCategoryInput, "click", (e) => {
            e.stopPropagation();
        
            this.insertCategoryInput.addEventListener("input", (e) => {
              e.stopPropagation();

              if (!this.categoryButton) {
                this.createButton();
              }
            });
        });

        this.addEvent(this.insertCategoryInput, "keydown", function (e) {
            if (e.key === "Enter" && this.categoryButton) {
                this.categoryButton.click();
            }
        });

        this.addEvent(this.inputElement, "input", () => {
            const filterValue = this.inputField.value.trim().toLowerCase();
            const options = this.dropdown.querySelectorAll(".option");

            options.forEach((option) => {
              const optionText = option.textContent.trim().toLowerCase();
              const display = optionText.includes(filterValue) ? "block" : "none";
              option.style.display = display;
            });
        });
    }

    addEvent(target, event, fn) {
        target.addEventListener(event, fn);
        this.events = [...this.events, [target, event, fn]];
        return this;
    }

    destroy() {
        this.events.forEach(([target, event, fn]) => {
            target.removeEventListener(event, fn);
        });
        return this;
    }

    createWrapper() {
        const wrapper = document.createElement('div');

        wrapper.setAttribute('data-custom-select');

        return wrapper;
    }

    createInputWrapper() {
        const inputWrapper = `
            <div data-input-select class="inputSelect w-100 d-flex">
                <!-- add inputElement here -->
                <div class="select-icon">
                    <i class="bi bi-chevron-down"></i>
                </div>
            </div>
        `;

        return this.parse(inputWrapper);
    }

    createCategoryButton() {
        this.categoryButton = document.createElement("button");
        this.categoryButton.setAttribute = "data-dropdown-category-button";
        this.categoryButton.textContent = "Adicionar";

        this.categoryButton.addEventListener("click", function () {
          
        });

        return categoryButton;
      }

    createInsertCategoryinput() {
        const insertCategoryInputTemplate = `
            <li data-insert-category class="insert-category">
                <i class="bi bi-plus-lg"></i>
                <input type="text" placeholder="Adicione uma nova categoria">
            </li>
        `;

        return this.parse(insertCategoryInputTemplate);
    }

    createDropdownItem(item) {
        const dropdownItemTemplate = `
            <li class="option">
                ${item}<span class="delete-icon"><i class="bi bi-trash3"></i></span>
            </li>
        `;

        const dropdownItem = this.parse(dropdownItemTemplate);

        return dropdownItem;
    }

    createDropdown() {
        const predefinedList = this.settings.predefinedList.map(this.createDropdownItem);

        const dropdownTemplate = `
            <ul data-dropdown class="dropdown d-none">
                ${predefinedList}
                <li class="insert-category"><i class="bi bi-plus-lg"></i><input type="text"
                    placeholder="Adicione uma nova categoria"></li>
            </ul>
        `;

        return this.parse(dropdownTemplate);
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

    parse(templateString) {
        const root = document.createElement('div');
        root.insertAdjacentHTML('afterbegin', templateString);
        return root.children[0];
    }

    build() {
        this.wrapper = this.createWrapper();
        this.inputWrapper = this.createInputWrapper();
        this.insertCategoryInput = this.createInsertCategoryinput();
        this.dropdown = this.createDropdown();
        this.categoryButton = this.createCategoryButton();

        this.getParent().insertBefore(this.wrapper, this.inputElement);

        this.dropdown.append(insertCategoryInput);
        this.inputWrapper.prepend(this.inputElement);

        this.wrapper.append(this.inputWrapper);
        this.inputWrapper.append(this.inputWrapper);
    }
}