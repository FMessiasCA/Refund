// # Seleção de elementos do fomulário
const form = document.querySelector('form');

const expense = document.getElementById('expense');
const category = document.getElementById('category');
const amount = document.getElementById('amount');

// # Seleção de elementos da lista
const expensesTotal = document.querySelector('aside header h2');
const expenseList = document.querySelector('ul');
const expenseQuantity = document.querySelector('aside header p span');

// # Eventos no formulário
// ## Faz o controle de valores que possam ser inseridos no input
amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "");

    // Transforma o valor em centavos
    value = Number(value) / 100;

    amount.value = formatCurrencyBRL(value);
};

// ## Captura eventos de submit no formulário para obter valores
form.onsubmit = (event) => {
    event.preventDefault();

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    };

    expenseAdd(newExpense);
};

// ## Evento de Captura de clique na lista
expenseList.addEventListener('click', (event) => {
    
    if (event.target.classList.contains('remove-icon')) {
        const item = event.target.closest('.expense');
        item.remove();
    }

    updateTotals();
});

// # Funções
// ## Função de formatação de moeda para reais (BRL)
function formatCurrencyBRL(value) {
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return value;
};

// ## Função de adicionar item na lista
function expenseAdd(newExpense) {
    try {
        // Criando a lista
        const expenseItem = document.createElement('li');
        expenseItem.classList.add('expense');

        // Criando elementos da lista
        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute('alt', newExpense.category_name);

        const expenseInfo = document.createElement('div');
        expenseInfo.classList.add('expense-info');
        const expenseName = document.createElement('strong');
        expenseName.textContent = newExpense.expense;
        const expenseCategory = document.createElement('span');
        expenseCategory.textContent = newExpense.category_name;

        const expenseAmount = document.createElement('span');
        expenseAmount.classList.add('expense-amount');
        expenseAmount.innerHTML = `<small>R$</small>${newExpense
            .amount
            .toUpperCase()
            .replace('R$', '')
        }`;

        const removeIcon = document.createElement('img');
        removeIcon.classList.add('remove-icon');
        removeIcon.setAttribute('src', 'img/remove.svg');
        removeIcon.setAttribute('alt', 'remover');

        // Adicionando elementos
        expenseList.append(expenseItem);
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
        expenseInfo.append(expenseName, expenseCategory);

        // Limpa o formulário
        formClear();

        // Atualizando os totais
        updateTotals();

    } catch (error) {
        alert('Não foi possível atualizar a lista de despesas.')
        console.log(error)
    };
};

// ## Função para atualizar os valores totais inseridos;
function updateTotals() {
    try{
        const items = expenseList.children;

        expenseQuantity.textContent = (items.length > 1) ? `${items.length} despesas`: `${items.length} despesa`;

        // Lidando com o valor total
        let total = 0

        for (let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector('.expense-amount');

            // Removendo caracteres não numéricos e virgular por ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',', '.');

            value = parseFloat(value);

            if (isNaN(value)) {
                return alert('Não foi possível seguir com o total. O valor não parece ser um número.')
            };

            total += Number(value);
        };

        expensesTotal.innerHTML = `<small>R$</small> ${formatCurrencyBRL(total).toUpperCase().replace('R$', '')}`
        
    } catch (err) {
        console.log(err);
        alert('Não foi possível atualizar os totais.')
    }
};

// ## Formata os inputs
function formClear() {
    expense.value = '';
    category.value = '';
    amount.value = '';

    expense.focus();
}