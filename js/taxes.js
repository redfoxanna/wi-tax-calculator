/**
 * 
 * State and Federal by tax brackets
 * 
 */

// Calculates and returns the income for a specific tax bracket
const calculateTaxForBracket = (income, rate) => income * rate;

// Calculates federal tax based on gross salary entered
const calculateFederalTax = grossSalary => {
  let federalTax = 0;

  if (grossSalary <= 9875) {
    federalTax += calculateTaxForBracket(grossSalary, 0.1);
  } else if (grossSalary <= 40125) {
    federalTax += calculateTaxForBracket(grossSalary - 9875, 0.12);
  } else if (grossSalary <= 85525) {
    federalTax += calculateTaxForBracket(grossSalary - 40125, 0.22);
  } else if (grossSalary <= 163300) {
    federalTax += calculateTaxForBracket(grossSalary - 85525, 0.24);
  } else if (grossSalary <= 207350) {
    federalTax += calculateTaxForBracket(grossSalary - 163300, 0.32);
  } else if (grossSalary <= 518400) {
    federalTax += calculateTaxForBracket(grossSalary - 207350, 0.35);
  } else {
    federalTax += calculateTaxForBracket(grossSalary - 518400, 0.37);
  }

  return federalTax.toFixed(2);
}


// Calculates state tax based on the tax brackets
const calculateStateTax = grossSalary => {
  if (grossSalary <= 11970) {
    stateTax = calculateTaxForBracket(grossSalary, 0.0354);
  } else if (grossSalary <= 23930) {
    stateTax = calculateTaxForBracket(grossSalary - 11970, 0.0465);
  } else if (grossSalary <= 0.0627) {
    stateTax = calculateTaxForBracket(grossSalary - 23930, 0.0627);
  } else {
    stateTax = calculateTaxForBracket(grossSalary - 0, 0.0765).toFixed(2);
  }
  return stateTax.toFixed(2);
};

// Calculates Social Security tax based on predefined threshold and rate
const calculateSocialSecurityTax = grossSalary => {
  const socialSecurityThreshold = 137000;
  const socialSecurityRate = 0.062;

  /**
   * 
   * 
   * Types of taxes methods
   * 
   */

  // Calculate Social Security tax
  return Math.min(grossSalary, socialSecurityThreshold) * socialSecurityRate;
};

// Calculates Medicare tax based on predefined threshold and rates
const calculateMedicareTax = grossSalary => {
  const medicareThreshold = 200000;
  const medicareRate = 0.0145;
  const additionalMedicareRate = 0.009;

  // Calculate Medicare tax based on income and thresholds
  return grossSalary <= medicareThreshold ?
    grossSalary * medicareRate :
    (medicareThreshold * medicareRate) + ((grossSalary - medicareThreshold) * additionalMedicareRate);
};

// Generic function to calculate tax based on provided tax brackets
const calculateTax = (income, brackets) => {
  let remainingIncome = income;
  let totalTax = 0;

  // Iterate through tax brackets and calculate tax for each
  for (const bracket of brackets) {
    const taxableAmount = Math.min(remainingIncome, bracket.threshold);
    totalTax += taxableAmount * bracket.rate;
    remainingIncome -= taxableAmount;

    // Break if there is no remaining income
    if (remainingIncome <= 0) {
      break;
    }
  }

  return totalTax;
};

/* 
 * Main function to calculate all taxes and update results on the webpage
*/
const calculateTaxes = () => {
  const grossSalary = parseFloat(document.getElementById("grossSalary").value);

  // Calculate each of the tax types
  const federalTax = calculateFederalTax(grossSalary);
  const stateTax = calculateStateTax(grossSalary);
  const socialSecurityTax = calculateSocialSecurityTax(grossSalary).toFixed(2);
  const medicareTax = calculateMedicareTax(grossSalary);

  // Calculate net pay after deducting taxes
  const netPay = grossSalary - (federalTax + stateTax + socialSecurityTax + medicareTax);

  // Define tax types for displaying to user
  const taxTypes = [
    { id: "federalTax", label: "Federal Tax" },
    { id: "stateTax", label: "State Tax" },
    { id: "socialSecurityTax", label: "Social Security Tax" },
    { id: "medicareTax", label: "Medicare Tax" },
    { id: "netPay", label: "Net Pay" }
  ];

  // Update results on the webpage for gross salary after all taxes
  taxTypes.forEach((taxType) => {
    updateResult(
      taxType.id,
      `${taxType.label}: $${(taxType.id === "netPay" ? netPay : eval(taxType.id))}`
    );
  });
};

// Function to update or create a result element on the webpage
const updateResult = (elementId, content) => {
  let resultContainer = document.getElementById("results");

  // If the #results div doesn't exist, create it (optional, depending on your scenario)
  if (!resultContainer) {
    console.error("Error: #results div not found.");
    return;
  }

  // Create a new paragraph element for each result
  const resultElement = document.createElement("p");
  resultElement.id = elementId;

  // Format the content with two decimal places
  const formattedContent = typeof content === 'number' ? content.toFixed(2) : content;

  // Update the content of the result element
  resultElement.innerText = `${formattedContent}`;

  // Append the result element to the #results div
  resultContainer.appendChild(resultElement);
};
