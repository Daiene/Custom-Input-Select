export const settings = {
    predefinedList: [
        'HTML',
        'CSS',
        'JavaScript',
        'Python',
        'Java'
    ],
    confirmationText: (item) => {
        return `Tem certeza que quer deletar esse item? ${item}`;
    },
    alertText: (value) => {
        return `O item: "${value}" já existe!`;
    }
};
