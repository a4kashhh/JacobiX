// Load example data
function loadExample() {
    const exampleMatrix = {
        a11: 10, a12: -1, a13: 2, a14: 0,
        a21: -1, a22: 11, a23: -1, a24: 3,
        a31: 2, a32: -1, a33: 10, a34: -1,
        a41: 0, a42: 3, a43: -1, a44: 8
    };
    const exampleB = { b1: 6, b2: 25, b3: -11, b4: 15 };
    
    // Fill matrix values with animation
    Object.keys(exampleMatrix).forEach((key, index) => {
        setTimeout(() => {
            const input = document.getElementById(key);
            if (input) {
                input.value = exampleMatrix[key];
                input.style.animation = 'valueLoad 0.3s ease-out';
                setTimeout(() => input.style.animation = '', 300);
            }
        }, index * 50);
    });
    
    // Fill vector values
    Object.keys(exampleB).forEach((key, index) => {
        setTimeout(() => {
            const input = document.getElementById(key);
            if (input) {
                input.value = exampleB[key];
                input.style.animation = 'valueLoad 0.3s ease-out';
                setTimeout(() => input.style.animation = '', 300);
            }
        }, (Object.keys(exampleMatrix).length + index) * 50);
    });
    
    showMessage('Example loaded successfully! This is a diagonally dominant system.', 'success');
}

// Clear all inputs
function clearAll() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.value = '';
        input.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => input.style.animation = '', 200);
    });
    
    document.getElementById('result').innerHTML = '';
    document.getElementById('iterations').innerHTML = '';
    
    showMessage('All fields cleared', 'info');
}

// Get matrix values from inputs
function getMatrixAndVector() {
    const matrix = [];
    const vector = [];
    
    // Get matrix values (using 1-based indexing like the formula)
    for (let i = 1; i <= 4; i++) {
        matrix[i-1] = [];
        for (let j = 1; j <= 4; j++) {
            const value = parseFloat(document.getElementById(`a${i}${j}`).value);
            if (isNaN(value)) {
                throw new Error(`Matrix element a${i}${j} is not a valid number`);
            }
            matrix[i-1][j-1] = value;
        }
    }
    
    // Get vector values
    for (let i = 1; i <= 4; i++) {
        const value = parseFloat(document.getElementById(`b${i}`).value);
        if (isNaN(value)) {
            throw new Error(`Vector element b${i} is not a valid number`);
        }
        vector[i-1] = value;
    }
    
    return { matrix, vector };
}

// Check diagonal dominance
function isDiagonallyDominant(matrix) {
    for (let i = 0; i < 4; i++) {
        let sum = 0;
        for (let j = 0; j < 4; j++) {
            if (i !== j) {
                sum += Math.abs(matrix[i][j]);
            }
        }
        if (Math.abs(matrix[i][i]) <= sum) {
            return false;
        }
    }
    return true;
}

// Calculate convergence based on decimal places
function hasConverged(xOld, xNew, decimalPlaces) {
    const tolerance = Math.pow(10, -decimalPlaces);
    for (let i = 0; i < 4; i++) {
        if (Math.abs(xNew[i] - xOld[i]) > tolerance) {
            return false;
        }
    }
    return true;
}

// Main Gauss-Jacobi iteration function based on your exact formula
function gaussJacobiIteration(matrix, vector, maxIter, decimalPlaces) {
    const n = 4;
    
    // Initial guess: x^(0) = [0, 0, 0, 0]
    let x = [0, 0, 0, 0];
    const iterations = [];
    
    // Store initial iteration
    iterations.push({
        k: 0,
        values: [...x],
        error: 0,
        formulas: getFormulaDisplay(matrix, vector, x, 0, x, decimalPlaces)
    });
    
    for (let k = 0; k < maxIter; k++) {
        const xNew = [0, 0, 0, 0];
        
        // Apply the exact formula from your image:
        // x₁^(k+1) = (1/a₁₁)[b₁ - (a₁₂x₂^(k) + a₁₃x₃^(k) + a₁₄x₄^(k))]
        xNew[0] = (1/matrix[0][0]) * (vector[0] - (matrix[0][1]*x[1] + matrix[0][2]*x[2] + matrix[0][3]*x[3]));
        
        // x₂^(k+1) = (1/a₂₂)[b₂ - (a₂₁x₁^(k) + a₂₃x₃^(k) + a₂₄x₄^(k))]
        xNew[1] = (1/matrix[1][1]) * (vector[1] - (matrix[1][0]*x[0] + matrix[1][2]*x[2] + matrix[1][3]*x[3]));
        
        // x₃^(k+1) = (1/a₃₃)[b₃ - (a₃₁x₁^(k) + a₃₂x₂^(k) + a₃₄x₄^(k))]
        xNew[2] = (1/matrix[2][2]) * (vector[2] - (matrix[2][0]*x[0] + matrix[2][1]*x[1] + matrix[2][3]*x[3]));
        
        // x₄^(k+1) = (1/a₄₄)[b₄ - (a₄₁x₁^(k) + a₄₂x₂^(k) + a₄₃x₃^(k))]
        xNew[3] = (1/matrix[3][3]) * (vector[3] - (matrix[3][0]*x[0] + matrix[3][1]*x[1] + matrix[3][2]*x[2]));
        
        // Calculate error
        const errors = xNew.map((val, i) => Math.abs(val - x[i]));
        const maxError = Math.max(...errors);
        
        // Store iteration
        iterations.push({
            k: k + 1,
            values: [...xNew],
            error: maxError,
            formulas: getFormulaDisplay(matrix, vector, x, k + 1, xNew, decimalPlaces)
        });
        
        // Check convergence based on decimal places
        if (hasConverged(x, xNew, decimalPlaces)) {
            return {
                solution: xNew,
                iterations,
                converged: true,
                finalIteration: k + 1,
                finalError: maxError
            };
        }
        
        // Update x for next iteration
        x = [...xNew];
    }
    
    return {
        solution: x,
        iterations,
        converged: false,
        finalIteration: maxIter,
        finalError: Math.max(...x.map((val, i) => Math.abs(val - iterations[iterations.length-2]?.values[i] || 0)))
    };
}

// Generate formula display for each iteration
function getFormulaDisplay(matrix, vector, x, k, xNew, decimalPlaces) {
    const formulas = [];
    
    for (let i = 0; i < 4; i++) {
        let formula = `x${i+1}^(${k}) = (1/${matrix[i][i].toFixed(0)})`;
        let bracketContent = `[${vector[i]}`;
        
        const terms = [];
        for (let j = 0; j < 4; j++) {
            if (i !== j && matrix[i][j] !== 0) {
                const coeff = matrix[i][j];
                const value = x[j];
                if (coeff > 0) {
                    terms.push(` - ${coeff}×${value.toFixed(decimalPlaces)}`);
                } else {
                    terms.push(` + ${Math.abs(coeff)}×${value.toFixed(decimalPlaces)}`);
                }
            }
        }
        
        bracketContent += terms.join('') + ']';
        formula += bracketContent;
        
        if (xNew) {
            formula += ` = ${xNew[i].toFixed(decimalPlaces)}`;
        }
        
        formulas.push(formula);
    }
    
    return formulas;
}

// Show message notifications
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 12px 20px;
        border-radius: 8px;
        animation: messageSlideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'messageSlideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 4000);
}

// Main solve function
function solve() {
    try {
        const { matrix, vector } = getMatrixAndVector();
        const maxIter = parseInt(document.getElementById('max-iter').value);
        const decimalPlaces = parseInt(document.getElementById('decimal-places').value);
        
        // Validate inputs
        if (maxIter < 1) {
            throw new Error('Maximum iterations must be at least 1');
        }
        if (decimalPlaces < 1 || decimalPlaces > 15) {
            throw new Error('Decimal places must be between 1 and 15');
        }
        
        // Check for zero diagonal elements
        for (let i = 0; i < 4; i++) {
            if (Math.abs(matrix[i][i]) < 1e-12) {
                throw new Error(`Diagonal element a${i+1}${i+1} is zero or too small. Gauss-Jacobi method requires non-zero diagonal elements.`);
            }
        }
        
        const result = gaussJacobiIteration(matrix, vector, maxIter, decimalPlaces);
        
        // Display results
        displayResults(result, matrix, decimalPlaces);
        displayIterations(result.iterations, decimalPlaces);
        
        const message = result.converged 
            ? `Solution converged in ${result.finalIteration} iterations to ${decimalPlaces} decimal places!`
            : `Maximum ${maxIter} iterations reached without convergence to ${decimalPlaces} decimal places`;
        
        showMessage(message, result.converged ? 'success' : 'warning');
        
    } catch (error) {
        document.getElementById('result').innerHTML = `<div class="error"><strong>Error:</strong> ${error.message}</div>`;
        document.getElementById('iterations').innerHTML = '';
        showMessage(error.message, 'error');
    }
}

// Display final results
function displayResults(result, matrix, decimalPlaces) {
    let html = '';
    
    // Convergence status
    if (result.converged) {
        html += `<div class="success">
            <strong>✅ Solution Converged!</strong><br>
            Iterations: ${result.finalIteration}<br>
            Decimal Places: ${decimalPlaces}<br>
            Final Error: ${result.finalError.toExponential(3)}
        </div>`;
    } else {
        html += `<div class="warning">
            <strong>⚠️ Maximum Iterations Reached</strong><br>
            Final Error: ${result.finalError.toExponential(3)}<br>
            Try increasing maximum iterations or reducing decimal places.
        </div>`;
    }
    
    // Diagonal dominance check
    if (!isDiagonallyDominant(matrix)) {
        html += `<div class="warning">
            <strong>⚠️ Warning:</strong> Matrix is not diagonally dominant.<br>
            Convergence is not guaranteed for Gauss-Jacobi method.
        </div>`;
    }
    
    // Display formula used
    html += `<div style="background: rgba(37, 99, 235, 0.08); padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid var(--primary-color);">
        <strong>Gauss-Jacobi Formula Applied:</strong><br>
        <div style="font-family: 'Times New Roman', serif; font-size: 1.1em; margin-top: 8px;">
            x<sub>i</sub><sup>(k+1)</sup> = <sup>1</sup>⁄<sub>a<sub>ii</sub></sub> [b<sub>i</sub> - Σ(a<sub>ij</sub>x<sub>j</sub><sup>(k)</sup>)] &nbsp; where j ≠ i
        </div>
    </div>`;
    
    // Final solution
    html += '<h4>Final Solution Vector:</h4>';
    html += '<div class="solution-vector">';
    for (let i = 0; i < 4; i++) {
        html += `<div class="solution-value">x<sub>${i+1}</sub> = ${result.solution[i].toFixed(decimalPlaces)}</div>`;
    }
    html += '</div>';
    
    document.getElementById('result').innerHTML = html;
}

// Display iteration steps
function displayIterations(iterations, decimalPlaces) {
    let html = '';
    const maxDisplay = Math.min(iterations.length, 12);
    
    for (let i = 0; i < maxDisplay; i++) {
        const iter = iterations[i];
        
        html += `<div class="iteration-step" style="animation-delay: ${i * 0.03}s">`;
        html += `<strong>Iteration k = ${iter.k}:</strong><br>`;
        
        // Show formulas for first few iterations
        if (i > 0 && i < 4 && iter.formulas) {
            html += '<div class="formula-steps">';
            iter.formulas.forEach((formula, idx) => {
                if (idx < 2) { // Show only first 2 equations to save space
                    html += `<div style="font-size: 0.85em; margin: 2px 0;">${formula}</div>`;
                }
            });
            if (iter.formulas.length > 2) {
                html += `<div style="font-size: 0.8em; color: var(--text-secondary);">... (and ${iter.formulas.length - 2} more equations)</div>`;
            }
            html += '</div>';
        }
        
        // Show values
        html += `<strong>Values:</strong> [${iter.values.map(v => v.toFixed(decimalPlaces)).join(', ')}]<br>`;
        
        if (iter.k > 0) {
            html += `<strong>Max Error:</strong> ${iter.error.toFixed(Math.min(decimalPlaces + 2, 10))}`;
        }
        
        html += '</div>';
    }
    
    if (iterations.length > maxDisplay) {
        html += `<div class="iteration-step">
            <em>... and ${iterations.length - maxDisplay} more iterations</em>
        </div>`;
    }
    
    document.getElementById('iterations').innerHTML = html;
}

// Add CSS for messages and additional animations
const additionalCSS = `
    @keyframes valueLoad {
        0% { background: rgba(37, 99, 235, 0.3); transform: scale(1.05); }
        100% { background: var(--background-primary); transform: scale(1); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0.3; }
    }
    
    @keyframes messageSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes messageSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .message {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
    }
    
    .message.success {
        background: rgba(34, 197, 94, 0.1);
        color: #059669;
        border: 1px solid rgba(34, 197, 94, 0.2);
    }
    
    .message.error {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
        border: 1px solid rgba(239, 68, 68, 0.2);
    }
    
    .message.warning {
        background: rgba(245, 158, 11, 0.1);
        color: #d97706;
        border: 1px solid rgba(245, 158, 11, 0.2);
    }
    
    .message.info {
        background: rgba(59, 130, 246, 0.1);
        color: #2563eb;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }
`;

const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize with example when page loads
window.addEventListener('load', function() {
    setTimeout(loadExample, 1500);
});
