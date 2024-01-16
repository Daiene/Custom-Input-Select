import CustomSelect from "./custom-select.js";

document.addEventListener("DOMContentLoaded", function () {
    const selectLang = document.querySelector("[data-select='linguagens']");
    const selectCategory = document.querySelector("[data-select='categorias']");
    const selectCountry = document.querySelector("[data-select='paises']");
    const selectFruit = document.querySelector("[data-select='frutas']");
    
    CustomSelect.create({ 
      inputElement: selectLang,
      options: {
        predefinedList: [
          'Português',
          'Inglês',
          'Espanhol',
          'Alemão',
          'Irlandês',
        ]
      }
    });

    CustomSelect.create({ 
      inputElement: selectCategory,
      options: {
        predefinedList: [
          'Aguardando Confirmação',
          'Processando',
          'Pagamento Realizado',
          'Em Análise',
          'Expedido',
        ]
      }
    });

    CustomSelect.create({ 
      inputElement: selectCountry,
      options: {
        predefinedList: [
          'Brasil',
          'EUA',
          'França',
          'Irlanda',
          'Noruega',
        ]
      }
    });

    CustomSelect.create({ 
      inputElement: selectFruit,
      options: {
        predefinedList: [
          'Banana',
          'Maçã',
          'Uva',
          'Pêra',
          'Tomate',
        ]
      }
    });
  });
  