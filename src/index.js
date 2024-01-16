import CustomSelect, { EVENTS } from "./custom-select.js";

document.addEventListener("DOMContentLoaded", function () {
    const selectLang = document.querySelector("[data-select='linguagens']");
    const selectCategory = document.querySelector("[data-select='categorias']");
    const selectCountry = document.querySelector("[data-select='paises']");
    const selectFruit = document.querySelector("[data-select='frutas']");
    
    const CSLang = CustomSelect.create({ 
      inputElement: selectLang,
      options: {
        predefinedList: [
          'Português',
          'Inglês',
          'Espanhol',
          'Alemão',
          'Irlandês',
        ],
        confirmationText: (lang) => {
          return `Tem certeza que quer deletar esta língua? ${lang}`;
        }
      }
    })
    .on(EVENTS.ADD_ITEM, (event) => {
      console.log(event);
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
        ],
        confirmationText: (category) => {
          return `Tem certeza que quer deletar esta categoria? ${category}`;
        }
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
        ],
        confirmationText: (country) => {
          return `Tem certeza que quer deletar este país? ${country}`;
        }
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
        ],
        confirmationText: (fruit) => {
          return `Tem certeza que quer deletar esta fruta? ${fruit}`;
        }
      }
    });

    setTimeout(() => {
      CSLang.destroy(); 
      console.log('destroyed');
      CustomSelect.create({ 
      inputElement: selectLang,
      options: {
        predefinedList: [
          'Português',
          'Inglês',
          'Espanhol',
          'Alemão',
          'Irlandês',
        ],
        confirmationText: (lang) => {
          return `Tem certeza que quer deletar esta língua? ${lang}`;
        }
      }
    });
    console.log('created')
  }, 3000);

  });
  

