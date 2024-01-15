import CustomSelect from "./custom-select.js";

document.addEventListener("DOMContentLoaded", function () {
    const inputElement = document.querySelector("[data-custom-select]");
    
    CustomSelect.create({
      inputElement,
    });
  });
  