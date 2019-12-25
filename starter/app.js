/*
add event handlers
get input values
add them to DS
add them to UI
calculate budget 
update UI

UI modude:
get input values
add them to UI
update UI

Data modude:
add them to DS
calculate budget 

controller module:
add event handlers

*/

var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        }
        else{
            this.percentage = -1;
        }
    }
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var data = {
        expenses: [],
        incomes: [],
        totalExpense: 0,
        totalIncome: 0,
        budget: 0,
        percentage: -1
    };
    var getId = function (typeArray) {
        if (typeArray.length === 0) {
            return 0;
        } else {
            return typeArray[typeArray.length - 1].id + 1;
        }
    };
    var calculateAll = function () {
        data.totalExpense = data.expenses.reduce((acc, next) => acc + next.value, 0);
        data.totalIncome = data.incomes.reduce((acc, next) => acc + next.value, 0);
    }
    return {
        addItem: function (type, description, value) {
            var newItem;
            var id;
            if (type === 'inc') {
                id = getId(data.incomes);
                newItem = new Income(id, description, value);
                data.incomes.push(newItem);
            } else if (type === 'exp') {
                id = getId(data.expenses);
                newItem = new Expense(id, description, value);
                data.expenses.push(newItem);
            }
            return newItem;
        },
        deleteItem: function (type, id) {
            var deletedItem, selectedItem;
            if (type === 'exp') {
                var exps = data.expenses;
                selectedItem = exps.filter(e => e.id === id);
                exps.splice(exps.indexOf(selectedItem[0]), 1);
            } else if (type === 'inc') {
                var incs = data.incomes;
                selectedItem = incs.filter(e => e.id === id);
                incs.splice(incs.indexOf(selectedItem[0]), 1);
            }
        },
        calculateBudget: function () {
            calculateAll();
            data.budget = data.totalIncome - data.totalExpense;
            if (data.totalIncome > 0) {
                data.percentage = Math.round((data.totalExpense / data.totalIncome) * 100);
            }else{
                data.percentage = -1;
            }
        },
        updatePercentages: function () {
            data.expenses.forEach((expense) => {
                expense.calcPercentage(data.totalIncome);
            });
        },
        getPercentages: function () {
            return data.expenses.map((expense) =>
                expense.getPercentage());

        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalIncome: data.totalIncome,
                totalExpense: data.totalExpense,
                percentage: data.percentage
            }
        }
    }
})();


var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
    eaddButton: '.add__btn',
        itemDescription: '.item__description',
        itemValue: '.item__value',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        PercentLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercentage: '.item__percentage',
        monthLabel: '.budget__title--month'

    };
    var formatNumber = function(num, type){
        num = Math.abs(num);
        num = num.toFixed(2);
        var numSplit = num.split('.');
        var int = numSplit[0];
        var dec = numSplit[1];
        return (type === 'exp'? '-': '+') + ' '+ int + '.'+ dec;
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector('.add__type').value,
                description: document.querySelector('.add__description').value,
                value: parseFloat(document.querySelector('.add__value').value)
            }
        },
        addListItem: function (item, type) {
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMStrings.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value% </div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace('%description%', item.description);
            newHtml = newHtml.replace('%value%', formatNumber(item.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function (id) {
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
        },
        clearFields: function () {
            var fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            Array.prototype.slice.call(fields).forEach(function (current) {
                current.value = "";
            });
            fields[0].focus();
        },
        displayBudget: function (obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, obj.budget >= 0? 'inc': 'exp');
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome,'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExpense,'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.PercentLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.PercentLabel).textContent = '--';
            }
        },
        displayPercentages: function (allPercents) {
            if (allPercents.length > 0) {
                document.querySelectorAll(DOMStrings.expensePercentage).forEach((e, index) => {if(allPercents[index]> 0)
                    e.textContent = allPercents[index]+ "%";
                else
                e.textContent= '--' });
            }
        },
        displayMonth: function(){
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            document.querySelector(DOMStrings.monthLabel).textContent = month + "/"+year;
        },
        changeType: function(){
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ','+
                DOMStrings.inputValue);
            fields.forEach(element => {
                element.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.addButton).classList.toggle('red');
        },
        getDOMStrings: function () {
            return DOMStrings;
        }
    }

})();

var controller = (function (budgetCtrl, UiCtrl) {

    function setUpEventListeners() {
        var DOMStrings = UiCtrl.getDOMStrings();
        document.querySelector(DOMStrings.addButton).addEventListener('click', addItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                addItem();
            }
        });
        document.querySelector(DOMStrings.container).addEventListener('click', deleteItem);
        document.querySelector(DOMStrings.inputType).addEventListener('change', UiCtrl.changeType);
    };


    var updateBudget = function () {
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        UiCtrl.displayBudget(budget);
    }
    var updatePercentages = function () {
        budgetCtrl.updatePercentages();
        UiCtrl.displayPercentages(budgetCtrl.getPercentages());
    }
    var addItem = function () {
        var input = UiCtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UiCtrl.addListItem(newItem, input.type);
            UiCtrl.clearFields();
            updateBudget();
            updatePercentages();
        }
    }
    var deleteItem = function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
            var splitId = id.split('-');
            var deletedItem = budgetCtrl.deleteItem(splitId[0], parseInt(splitId[1]));
            UiCtrl.deleteListItem(id);
            updateBudget();
            updatePercentages();

        }
    }
    return {
        init: function () {
            console.log("Initializing the app");
            UiCtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: 0
            });
            UiCtrl.displayMonth();
            setUpEventListeners();
        }
    }


})(budgetController, UIController);


controller.init();