document.addEventListener("DOMContentLoaded", function () {
  const expenseForm = document.getElementById("expense-form");
  const expenseInput = document.getElementById("expense-input");
  const amountInput = document.getElementById("amount-input");
  const categorySelect = document.getElementById("category-select");
  const expensesList = document.getElementById("expenses-list");
  const totalAmountDisplay = document.getElementById("total-amount");
  const categoryFilter = document.getElementById("category-filter");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const filterByDateBtn = document.getElementById("filter-by-date");
  const editDescriptionInput = document.getElementById("edit-description");
  const editAmountInput = document.getElementById("edit-amount");
  const editCategorySelect = document.getElementById("edit-category");
  const editDateInput = document.getElementById("edit-date");
  const editModal = document.getElementById("edit-modal");
  const closeEditModalBtn = document.getElementById("close-edit-modal");
  const saveEditBtn = document.getElementById("save-edit");
  const cancelEditBtn = document.getElementById("cancel-edit");
  const deleteAllDataBtn = document.getElementById("delete-all-data");

  let expenses = [];

  // Load expenses from localStorage on page load
  if (localStorage.getItem("expenses")) {
    expenses = JSON.parse(localStorage.getItem("expenses"));
    displayExpenses();
    updateTotalAmount();
  }

  // Event listener for adding expense
  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const expense = {
      description: expenseInput.value,
      amount: parseFloat(amountInput.value),
      category: categorySelect.value,
      date: new Date().toLocaleDateString(),
    };
    expenses.push(expense);
    updateLocalStorage();
    displayExpenses();
    updateTotalAmount();
    expenseInput.value = "";
    amountInput.value = "";
  });

  // Event listener for filtering expenses by category
  categoryFilter.addEventListener("change", function () {
    displayExpenses();
  });

  // Event listener for filtering expenses by date range
  filterByDateBtn.addEventListener("click", function () {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    displayExpensesByDate(startDate, endDate);
  });

  // Event listener for editing expense
  expensesList.addEventListener("click", function (event) {
    const clickedElement = event.target;
    if (
      clickedElement.tagName === "BUTTON" &&
      clickedElement.textContent === "Edit"
    ) {
      const expenseIndex = clickedElement.dataset.index;
      const expenseToEdit = expenses[expenseIndex];
      editDescriptionInput.value = expenseToEdit.description;
      editAmountInput.value = expenseToEdit.amount;
      editCategorySelect.value = expenseToEdit.category;
      editDateInput.value = expenseToEdit.date;
      editModal.style.display = "block";
      editingIndex = expenseIndex;
    }
  });

  // Event listener for closing edit modal
  closeEditModalBtn.addEventListener("click", function () {
    editModal.style.display = "none";
  });

  // Event listener for saving edited expense
  saveEditBtn.addEventListener("click", function () {
    const editedExpense = {
      description: editDescriptionInput.value,
      amount: parseFloat(editAmountInput.value),
      category: editCategorySelect.value,
      date: editDateInput.value,
    };
    expenses[editingIndex] = editedExpense;
    updateLocalStorage();
    displayExpenses();
    updateTotalAmount();
    editModal.style.display = "none";
    editingIndex = null;
  });

  // Event listener for canceling edit
  cancelEditBtn.addEventListener("click", function () {
    editModal.style.display = "none";
    editingIndex = null;
  });

  // Event listener for deleting all data
  deleteAllDataBtn.addEventListener("click", function () {
    const confirmation = confirm("Are you sure you want to delete all data?");
    if (confirmation) {
      localStorage.removeItem("expenses");
      expenses = [];
      displayExpenses();
      updateTotalAmount();
    }
  });

  // Function to display expenses
  function displayExpenses() {
    const categoryToDisplay = categoryFilter.value;
    expensesList.innerHTML = "";
    expenses.forEach(function (expense, index) {
      if (
        categoryToDisplay === "all" ||
        expense.category === categoryToDisplay
      ) {
        const expenseItem = createExpenseItem(expense, index);
        expensesList.appendChild(expenseItem);
      }
    });
  }

  // Function to display expenses within a given date range
  function displayExpensesByDate(startDate, endDate) {
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    expensesList.innerHTML = "";
    filteredExpenses.forEach((expense, index) => {
      const expenseItem = createExpenseItem(expense, index);
      expensesList.appendChild(expenseItem);
    });

    // Update total amount for filtered expenses
    updateTotalAmount(filteredExpenses);
  }

  // Function to create an expense item HTML element
  function createExpenseItem(expense, index) {
    const expenseItem = document.createElement("div");
    expenseItem.classList.add("expense-item");
    expenseItem.innerHTML = `
      <p><strong>${expense.description}</strong></p>
      <p>Amount: $${expense.amount}</p>
      <p>Category: ${expense.category}</p>
      <p>Date: ${expense.date}</p>
      <button class="edit" data-index="${index}">Edit</button>
      <button onclick="deleteExpense(${index})">Delete</button>
    `;
    return expenseItem;
  }

  // Function to update total amount
  function updateTotalAmount(expensesArray = expenses) {
    const totalAmount = expensesArray.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
  }

  // Function to update localStorage
  function updateLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }
});

// Function to delete expense
function deleteExpense(index) {
  let expenses = JSON.parse(localStorage.getItem("expenses"));
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  location.reload(); // Reload the page to reflect changes
}
