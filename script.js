let LIMIT = 40000;
const CURRENCY = 'руб.'
const STATUS_IN_LIMIT = 'всё хорошо';
const STATUS_IN_LIMIT_CLASSNAME = 'status-green';
const STATUS_OUT_OF_LIMIT = 'всё плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status-red';

const validationWrapperNode = document.querySelector('#validationWrapper');
const expensesInputNode = document.querySelector('#expensesInput');
const categorySelectNode = document.querySelector('#categorySelect');
const addButtonNode = document.querySelector('#addButton');
const statsLimitNode = document.querySelector('#statsLimit');
const statsTotalNode = document.querySelector('#statsTotal');
const statsStatusNode = document.querySelector('#statsStatus');
const historyListNode = document.querySelector('#expensesHistoryList');
const emptyMessage = document.querySelector('#emptyMessage');
const resetButtonNode = document.querySelector('#resetButton');

const editButtonNode = document.querySelector('#editButton');
const modalNode = document.querySelector('#modal');
const modalBoxNode = document.querySelector('#modalBox');
const modalInputNode = document.querySelector('#modalInput');
const modalButtonNode = document.querySelector('#modalButton');
const modalCloseButtonNode = document.querySelector('#modalCloseButton');

let expenses = [];

const loadLimitFromLocalStorage = () => {
    const storedLimit = localStorage.getItem('expenseLimit');
    if (storedLimit) {
        LIMIT = parseInt(storedLimit);
    }
}

const saveLimitToLocalStorage = () => {
    localStorage.setItem('expenseLimit', LIMIT); 
}

const saveExpensesToLocalStorage = () => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

const loadExpensesFromLocalStorage = () => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        renderExpensesStats();
    }
}

const init = () => {
    loadLimitFromLocalStorage();
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


// validation

const errorForm = (error, input) => {
    let errorEl = document.createElement('div');
    errorEl.className = 'error-text';
    errorEl.innerText = error;
    input.appendChild(errorEl);
}

const clearInputErrors = () => {
    const expenseErrors = validationWrapperNode.querySelectorAll('.error-text');
    expenseErrors.forEach(error => {
        error.remove();
    });
}

const clearCategoryErrors = () => {
    const categoryErrors = validationWrapperNode.querySelectorAll('.error-text');
    categoryErrors.forEach(error => {
        if (error.innerText === 'Категория не выбрана!') {
            error.remove();
        }
    });
}


const getExpenseFromUser = () => {
    const enteredExpense = parseInt(expensesInputNode.value.trim());
    const selectedCategory = categorySelectNode.value;

    clearInputErrors();
    clearCategoryErrors();

    if (!enteredExpense || isNaN(enteredExpense)) {
        errorForm('Введите корректную сумму!', validationWrapperNode);
        return null;
    }

    if (selectedCategory === '') {
        errorForm('Категория не выбрана!', validationWrapperNode);
        return null;
    }

    return {
        amount: enteredExpense,
        category: selectedCategory
    };
}

const clearInputs = () => {
    expensesInputNode.value = '';
    categorySelectNode.value = '';
}

const trackExpense = (newExpense) => {
    expenses.push(newExpense);
    saveExpensesToLocalStorage();
}

function renderExpensesStats() {
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

loadLimitFromLocalStorage();
loadExpensesFromLocalStorage();

// modal
editButtonNode.addEventListener('click', function() {
    modalNode.classList.add('open');
})

modalCloseButtonNode.addEventListener('click', function() {
    modalNode.classList.remove('open');
})

modalNode.addEventListener('click', function(event) {
    const isClickOutsideContent = !modalBoxNode.contains(event.target);
    if (isClickOutsideContent) {
        modalNode.classList.remove('open');
    }
})
    
function limitChangeHandler() {
    const newLimit = parseInt(modalInputNode.value);
    if (!newLimit || isNaN(newLimit) || newLimit < 0) {
        return;
    }
    LIMIT = newLimit;
    statsLimitNode.innerText = LIMIT;
    saveLimitToLocalStorage(); 
    renderExpensesStats();
    modalNode.classList.remove('open');
    
}


function addButtonHandler() {
    const newExpense = getExpenseFromUser();
    if (newExpense) {
        trackExpense(newExpense);
        renderExpensesStats();
        clearInputs();
        }
    }
    

function resetButtonHandler() {
    expenses.length = 0;
    saveExpensesToLocalStorage();
    renderExpensesStats();
    clearInputErrors();
    clearCategoryErrors();
    clearInputs();
}


addButtonNode.addEventListener('click', addButtonHandler);
resetButtonNode.addEventListener('click', resetButtonHandler);
expensesInputNode.addEventListener('input', clearInputErrors);
categorySelectNode.addEventListener('change', clearCategoryErrors);
modalButtonNode.addEventListener('click', limitChangeHandler);