const LIMIT = 1000;
const CURRENCY = 'руб.'
const STATUS_IN_LIMIT = 'всё хорошо';
const STATUS_IN_LIMIT_CLASSNAME = 'status-green';
const STATUS_OUT_OF_LIMIT = 'всё плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status-red';

const expensesInputNode = document.querySelector('#expensesInput');
const categorySelectNode = document.querySelector('#categorySelect');
const addButtonNode = document.querySelector('#addButton');
const statsLimitNode = document.querySelector('#statsLimit');
const statsTotalNode = document.querySelector('#statsTotal');
const statsStatusNode = document.querySelector('#statsStatus');
const historyListNode = document.querySelector('#expensesHistoryList');
const emptyMessage = document.querySelector('#emptyMessage');
const resetButtonNode = document.querySelector('#resetButton');

let expenses = [];

const init = () => {
    statsLimitNode.innerText = LIMIT;
    statsStatusNode.innerText = STATUS_IN_LIMIT;
    statsStatusNode.classList.add(STATUS_IN_LIMIT_CLASSNAME);
    historyListNode.innerHTML = '';
    emptyMessage.style.display = 'block';
    historyListNode.style.display = 'none';
}

init();

const expensesTotal = () => {
    let sum = 0;
    expenses.forEach(expense => {
        sum += expense.amount;
    });
    return sum;
}

const getExpenseFromUser = () => {
    const enteredExpense = parseInt(expensesInputNode.value.trim());
    const selectedCategory = categorySelectNode.value.trim();

    return {
        amount: enteredExpense,
        category: selectedCategory
    }
}

const clearInputs = () => {
    expensesInputNode.value = '';
    categorySelectNode.value = '';
}

const trackExpense = (newExpense) => {
    expenses.push(newExpense)
}

const renderExpensesStats = () => {
    renderStats();
    renderHistory();
}

const renderStats = () => {
    const total = expensesTotal();
    statsTotalNode.innerText = total;

    if (total < LIMIT) {
        statsStatusNode.innerText = STATUS_IN_LIMIT;
        statsStatusNode.classList.add('status-green');
    } else {
        statsStatusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${LIMIT - total} ${CURRENCY})`;
        statsStatusNode.classList.remove(STATUS_IN_LIMIT_CLASSNAME);
        statsStatusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
        }
}

const renderHistory = () => {
    historyListNode.innerHTML = ''; 
    expenses.forEach(expense => {
        const historyItem = document.createElement('li');
        historyItem.className = 'expenses__history-item';

        const amountNode = document.createElement('span');
        amountNode.className = 'rub';
        amountNode.innerText = expense.amount;

        const categoryNode = document.createElement('span');
        categoryNode.innerText = ` - ${expense.category}`;

        historyItem.appendChild(amountNode);
        historyItem.appendChild(categoryNode);
        historyListNode.appendChild(historyItem);
    });

    if (historyListNode.children.length === 0) {
        emptyMessage.style.display = 'block'; 
    } else {
        emptyMessage.style.display = 'none';
        historyListNode.style.display = 'block';
    }
}



function addButtonHandler() {
    const newExpense = getExpenseFromUser();
    console.log(newExpense)
    trackExpense(newExpense);
    renderExpensesStats();
    clearInputs();
}

function resetButtonHandler() {
    expenses = [];
    renderExpensesStats();
}


addButtonNode.addEventListener('click', addButtonHandler);
resetButtonNode.addEventListener('click', resetButtonHandler);