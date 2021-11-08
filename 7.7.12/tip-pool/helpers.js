
// accepts 'tipAmt', 'billAmt', 'tipPercent' and sums total from allPayments objects
function sumPaymentTotal(type) {
  let total = 0;

  for (let key in allPayments) {
    let payment = allPayments[key];

    total += Number(payment[type]);
  }

  return total;
}

// converts the bill and tip amount into a tip percent
function calculateTipPercent(billAmt, tipAmt) {
  return Math.round(100 / (billAmt / tipAmt));
}

// expects a table row element, appends a newly created td element from the value
function appendTd(tr, value) {
  let newTd = document.createElement('td');
  newTd.innerText = value;

  tr.append(newTd);
}

// adds a delete button to a given tr element
function appendDeleteBtn(tr) {
  let newTd = document.createElement('td');
  newTd.innerText = "X";
  newTd.classList.add("deleteBtn");

  newTd.addEventListener("click", function(event) {
    let toDelete = newTd.parentElement;

    delete allServers[toDelete.id];
    delete allPayments[toDelete.id];

    newTd.parentElement.remove();
    updateServerTable();
    updateSummary();
  });

  tr.append(newTd);
}