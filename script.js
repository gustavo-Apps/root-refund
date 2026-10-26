const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");
const expenseList = document.querySelector("ul");

const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")


amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")
    console.log(value)

    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)

}

function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    return value
}

form.onsubmit = (event) => {
    event.preventDefault()
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }
    expenseAdd(newExpense)
}

function expenseAdd(newExpense) {
    try{
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        expenseInfo.append(expenseName, expenseCategory)

        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.replace("R$", "")}`

        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "./img/remove.svg")
        removeIcon.setAttribute("alt", "Remover")

        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        expenseList.append(expenseItem)

        updateTotals()
        formClear()

    } catch (error) {
        console.error("Erro ao adicionar despesa:", error);
        alert("Erro ao adicionar despesa");
    }
}

function updateTotals(){
    try{
        const items = expenseList.children
        // console.log(items)

        expenseQuantity.textContent = `${items.length} ${items.length >1 ? "despesas" : "despesa"}`
       
        let total = 0
        for(let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")
            // console.log(itemAmount)

            const value = itemAmount.textContent.replace(/[^\d,]/g,"").replace(",", ".")
            const valueFormatted = parseFloat(value)

            if(isNaN(valueFormatted)){
                return alert('Não foi possível calcular o total. O valor total não parece ser um número')
            }
            console.log(valueFormatted)
            total += valueFormatted
        }
        total = formatCurrencyBRL(total).replace("R$", "")
        expenseTotal.innerHTML = "<small>R$</small> "
        expenseTotal.append(total)
        
    }catch (error) {
        console.error("Erro ao atualizar totais:", error);
        alert("Erro ao atualizar totais");
    }
}

expenseList.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-icon")){
        const item = event.target.closest(".expense")
        item.remove()
    }
    updateTotals()

})

function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = ""
    expense.focus()
}