function calculateAMT() {
    const filingStatus = document.getElementById('filingStatus').value;
    const totalIncome = parseFloat(document.getElementById('totalIncome').value);
    const deductions = parseFloat(document.getElementById('deductions').value);

    // AMT Exemption based on filing status
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

    // Calculate AMT income
    const amtIncome = totalIncome - deductions;

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

    // Show the result
    document.getElementById('results').style.display = 'block';
    document.getElementById('amtResult').textContent = tentativeAMT > 0 ? 
        `You owe an AMT of $${tentativeAMT.toFixed(2)}` : 
        'You do not owe any AMT.';
}
