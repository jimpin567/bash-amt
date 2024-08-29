function toggleDeductions() {
    const deductionsType = document.getElementById('deductionsType').value;
    document.getElementById('itemizedDeductions').style.display = deductionsType === 'itemized' ? 'block' : 'none';
}

function calculateAMT() {
    const filingStatus = document.getElementById('filingStatus').value;
    const totalIncome = parseFloat(document.getElementById('totalIncome').value);
    
    // Stock Options
    const isoShares = parseFloat(document.getElementById('isoShares').value) || 0;
    const exercisePrice = parseFloat(document.getElementById('exercisePrice').value) || 0;
    const fmv = parseFloat(document.getElementById('fmv').value) || 0;
    const isoIncome = isoShares * (fmv - exercisePrice);

    // Deductions
    let deductions = 0;
    const deductionsType = document.getElementById('deductionsType').value;
    if (deductionsType === 'standard') {
        deductions = filingStatus === 'single' || filingStatus === 'separate' ? 13850 : filingStatus === 'married' ? 27700 : 20800;
    } else {
        const salt = parseFloat(document.getElementById('salt').value) || 0;
        const mortgageInterest = parseFloat(document.getElementById('mortgageInterest').value) || 0;
        const charitableContributions = parseFloat(document.getElementById('charitableContributions').value) || 0;
        const medicalExpenses = parseFloat(document.getElementById('medicalExpenses').value) || 0;
        const miscDeductions = parseFloat(document.getElementById('miscDeductions').value) || 0;
        deductions = salt + mortgageInterest + charitableContributions + medicalExpenses + miscDeductions;
    }

    // AMT Income Calculation
    const amtIncome = totalIncome + isoIncome - deductions;

    // AMT Exemption Calculation
    let exemption = 0;
    if (filingStatus === 'single') {
        exemption = 81800;
    } else if (filingStatus === 'married') {
        exemption = 126500;
    } else if (filingStatus === 'separate') {
        exemption = 63250;
    } else if (filingStatus === 'head') {
        exemption = 81800;
    }

    // Reduce exemption for high-income earners
    if (amtIncome > (filingStatus === 'married' ? 1036800 : 523600)) {
        exemption -= 0.25 * (amtIncome - (filingStatus === 'married' ? 1036800 : 523600));
    }

    // Calculate tentative AMT
    let tentativeAMT = 0;
    if (amtIncome <= 220700) {
        tentativeAMT = amtIncome * 0.26;
    } else {
        tentativeAMT = 220700 * 0.26 + (amtIncome - 220700) * 0.28;
    }

    // Subtract exemption
    tentativeAMT -= exemption;

    // Display the result
    document.getElementById('results').style.display = 'block';
    document.getElementById('amtResult').textContent = tentativeAMT > 0 ? 
        `You owe an AMT of $${tentativeAMT.toFixed(2)}` : 
        'You do not owe any AMT.';
}
