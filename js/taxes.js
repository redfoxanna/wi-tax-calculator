const init = () => {
  let eventListener = document.querySelector("#calculateTaxes");
  eventListener.addEventListener("click", calculateTaxes);
}


// Calculates and returns the income for a specific tax bracket
const calculateTaxForBracket = (income, rate) => income * rate;

// Calculates and returns the tax based on bracket min, max and rate
const calculateTaxFromBrackets = (brackets, grossSalary) => {
  let tax = 0;

  for (const bracket of brackets) {
    if (grossSalary >= bracket.max) {
      tax += calculateTaxForBracket(bracket.max - bracket.min, bracket.rate);
    } else {
      tax += calculateTaxForBracket(grossSalary - bracket.min, bracket.rate);
      break;
    }
  }

  return { formatted: tax.toFixed(2), unprocessed: tax };
}

// Calculates federal tax based on gross salary entered
const calculateFederalTax = grossSalary => {
  const federalBrackets = [
    { min: 0, max: 9875, rate: 0.1 },
    { min: 9875, max: 40125, rate: 0.12 },
    { min: 40125, max: 85525, rate: 0.22 },
    { min: 85525, max: 163300, rate: 0.24 },
    { min: 163300, max: 207350, rate: 0.32 },
    { min: 207350, max: 518400, rate: 0.35 },
    { min: 518400, max: Infinity, rate: 0.37 }
  ]

  return calculateTaxFromBrackets(federalBrackets, grossSalary);
}

// Calculates state tax based on the tax tiers
const calculateStateTax = grossSalary => {
  const stateBrackets = [
    { min: 0, max: 11970, rate: 0.0354 },
    { min: 11970, max: 23930, rate: 0.0465 },
    { min: 23930, max: Infinity, rate: 0.0627 }
  ];

  return calculateTaxFromBrackets(stateBrackets, grossSalary);
}

// Calculates and returns Social Security tax based on threshold and rate
const calculateSocialSecurityTax = grossSalary => {
  const socialSecurityBrackets = [
    { min: 0, max: 137000, rate: 0.062 },
    { min: 137000, max: Infinity, rate: 0 }
  ]

  return calculateTaxFromBrackets(socialSecurityBrackets, grossSalary);
}

// Calculates and returns Medicare tax based on threshold and rates
const calculateMedicareTax = grossSalary => {
  const medicareTaxBrackets = [
    { min: 0, max: 200000, rate: 0.0145 },
    { min: 200000, max: Infinity, rate: .0235 }
  ]

  return calculateTaxFromBrackets(medicareTaxBrackets, grossSalary);
}

// Calculates and returns the netPay and totalTaxes taken and returns values
const calculateTotalTaxesAndNetPay = (federalTax, stateTax, socialSecurityTax, medicareTax, grossSalary) => {
  const taxesTaken = federalTax.unprocessed + stateTax.unprocessed + socialSecurityTax.unprocessed + medicareTax.unprocessed;
  const netPay = grossSalary - taxesTaken;
  return { taxesTaken, netPay };
};

// All tax amuonts needed in the calcultions, to be displayed to user in table
const formatTaxTypes = (grossSalary, federalTax, stateTax, socialSecurityTax, medicareTax, taxesTaken, netPay) => {
  return [
    { label: "GROSS PAY", amount: grossSalary.toFixed(2), id: "gross"},
    { label: "federal", amount: federalTax.formatted, id: "federal"},
    { label: "state", amount: stateTax.formatted, id: "state"},
    { label: "social security", amount: socialSecurityTax.formatted, id: "social"},
    { label: "medicare", amount: medicareTax.formatted, id: "medicare"},
    { label: "TOTAL TAXES", amount: taxesTaken.toFixed(2), id: "total" },
    { label: "NET PAY", amount: netPay.toFixed(2), id: "net"}
  ];
};

// Main method of the application to calculte the total taxes from gross salary
const calculateTaxes = () => {
  const grossSalaryInput = document.getElementById("grossSalary");
  const grossSalary = parseFloat(grossSalaryInput.value);
  const federalTax = calculateFederalTax(grossSalary);
  const stateTax = calculateStateTax(grossSalary);
  const socialSecurityTax = calculateSocialSecurityTax(grossSalary);
  const medicareTax = calculateMedicareTax(grossSalary);

  const { taxesTaken, netPay } = calculateTotalTaxesAndNetPay(federalTax, stateTax, socialSecurityTax, medicareTax, grossSalary);

  const taxTypes = formatTaxTypes(grossSalary, federalTax, stateTax, socialSecurityTax, medicareTax, taxesTaken, netPay);

  updateResult(taxTypes);
  // Reset for next calculation
  grossSalaryInput.value = "";
};

// Updates the #results div with the calculated results
const updateResult = taxTypes => {
  const resultContainer = document.getElementById("results");
  resultContainer.innerHTML = "";
  taxTypes.forEach(result => {
    const row = document.createElement("tr");
    row.id = `${result.id}`;
    row.class = "result-row"
    const cell1 = document.createElement("td");
    cell1.textContent = result.label;
    cell1.classList = "result-label";
    const cell2 = document.createElement("td");
    cell2.classList = "result-value";
    cell2.textContent = `$${result.amount}`;
    row.appendChild(cell1);
    row.appendChild(cell2);
    resultContainer.appendChild(row);
  });
}

// Automatically loads init() when window loads
window.onload = () => {
  init();
}
