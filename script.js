document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("inputField");
  const dropdown = document.getElementById("dropdown");
  const insertCategoryInput = document.querySelector(".insert-category input");
  let buttonCategory;

  document.addEventListener("click", function (e) {
    const isDropdownClick = e.target.closest("#dropdown") !== null;
    if (!isDropdownClick) {
      closeDropdown();
    }
  });

  inputField.addEventListener("click", function (e) {
    dropdown.classList.toggle("d-none");
    removeButton();
    e.stopPropagation();
  });

  dropdown.addEventListener("click", function (e) {
    const target = e.target;
    const isOption = target.classList.contains("option");
    const isDeleteIcon = target.classList.contains("bi-trash3");

    if (isOption && !isDeleteIcon) {
      updateInput(target.textContent.trim());
    } else if (isDeleteIcon) {
      const confirmDelete = confirm(
        "Tem certeza que quer deletar essa categoria?"
      );
      if (confirmDelete) {
        target.closest(".option").remove();
        inputField.value = null;
      }
    }

    closeDropdown();
  });

  insertCategoryInput.addEventListener("click", function (e) {
    e.stopPropagation();

    insertCategoryInput.addEventListener("input", function (e) {
      e.stopPropagation();
      if (!buttonCategory) {
        createButton();
      }
    });
  });

  insertCategoryInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      if (buttonCategory) {
        buttonCategory.click();
      }
    }
  });

  inputField.addEventListener("input", function () {
    const filterValue = inputField.value.trim().toLowerCase();
    const options = document.querySelectorAll(".option");
    options.forEach((option) => {
      const optionText = option.textContent.trim().toLowerCase();
      if (optionText.includes(filterValue)) {
        option.style.display = "block";
      } else {
        option.style.display = "none";
      }
    });
  });

  function updateInput(value) {
    inputField.value = value;
  }

  function createButton() {
    buttonCategory = document.createElement("button");
    buttonCategory.id = "buttonCategory";
    buttonCategory.textContent = "Adicionar";
    buttonCategory.addEventListener("click", function () {
      const newCategoryValue = insertCategoryInput.value.trim();
      if (newCategoryValue !== "") {
        const newCategory = document.createElement("li");
        newCategory.className = "option";
        newCategory.innerHTML = `${newCategoryValue} <span class="delete-icon"><i class="bi bi-trash3"></i></span>`;
        dropdown.insertBefore(newCategory, insertCategoryInput.parentNode);
        insertCategoryInput.value = "";
        updateInput(newCategoryValue);
        buttonCategory.style.display = "none";
      }
    });
    insertCategoryInput.parentNode.appendChild(buttonCategory);
  }

  function removeButton() {
    if (buttonCategory) {
      buttonCategory.remove();
      buttonCategory = null;
    }
  }

  function closeDropdown() {
    dropdown.classList.add("d-none");
  }
});
