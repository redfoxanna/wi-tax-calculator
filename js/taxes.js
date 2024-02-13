// Calculates and returns the income for a specific tax bracket
const calculateTaxForBracket = (income, rate) => income * rate;


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

  return {formatted: tax.toFixed(2), unprocessed: tax};
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

// Calculates Social Security tax based on predefined threshold and rate
const calculateSocialSecurityTax = grossSalary => {
  const socialSecurityBrackets = [
    {min: 0, max: 137000, rate: 0.062},
    {min: 137000, max: Infinity, rate: 0}
  ]

  return calculateTaxFromBrackets(socialSecurityBrackets, grossSalary);
};

// Calculates Medicare tax based on predefined threshold and rates
const calculateMedicareTax = grossSalary => {
  const medicareTaxBrackets = [
    {min: 0, max: 200000, rate: 0.0145},
    {min: 200000, max: Infinity, rate: .0235}
  ]

  return calculateTaxFromBrackets(medicareTaxBrackets, grossSalary);
};


/* 
 * Main function to calculate all taxes and update results on the webpage
*/
const calculateTaxes = () => {
  const grossSalaryInput = document.getElementById("grossSalary");
  const grossSalary = parseFloat(grossSalaryInput.value);

  // Calculate each of the tax types
  const federalTax = calculateFederalTax(grossSalary);
  const stateTax = calculateStateTax(grossSalary);
  const socialSecurityTax = calculateSocialSecurityTax(grossSalary);
  const medicareTax = calculateMedicareTax(grossSalary);

  // Calculate net pay after deducting taxes
  let netPay = 0;
  netPay = grossSalary - (federalTax.unprocessed + stateTax.unprocessed + socialSecurityTax.unprocessed + medicareTax.unprocessed);

  // Define tax types for displaying to user
  const taxTypes = [
    { label: "Federal Tax", amount: federalTax.formatted },
    { label: "State Tax", amount: stateTax.formatted },
    { label: "Social Security Tax", amount: socialSecurityTax.formatted },
    { label: "Medicare Tax", amount: medicareTax.formatted },
    { label: "Net Pay", amount: netPay.toFixed(2) }
  ];

  // Update results on the webpage for gross salary after all taxes
  updateResult(taxTypes);

  // Clear the input field
  grossSalaryInput.value = "";
};


// Function to update or create a result element on the webpage
const updateResult = (taxTypes) => {
  let resultContainer = document.getElementById("results");

  // Clear existing content in #results
  resultContainer.innerHTML = "";

  // Create a table element
  const table = document.createElement("table");

  // Create rows for each tax type
  taxTypes.forEach((result) => {
    const row = document.createElement("tr");
    const cell1 = document.createElement("td");
    cell1.textContent = result.label;
    const cell2 = document.createElement("td");
    cell2.textContent = `$${result.amount}`;
    row.appendChild(cell1);
    row.appendChild(cell2);
    table.appendChild(row);
  });

  // Append the table to the #results div
  resultContainer.appendChild(table);
};
