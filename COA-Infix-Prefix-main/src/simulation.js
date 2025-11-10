// Simulation state
let simulationState = {
    currentStep: 0,
    input: '',
    stack: [],
    output: [],
    steps: [],
    isRunning: false,
    currentCharIndex: 0,
    isComplete: false
};


function resetSimulation() {
    const stackElement = document.getElementById('stack');
    const outputElement = document.getElementById('output');
    const currentCharElement = document.getElementById('currentChar');
    
    // Clear the display
    stackElement.innerHTML = '<div class="stack-empty">Empty</div>';
    outputElement.innerHTML = '';
    currentCharElement.textContent = '-';
    
    
    document.getElementById('nextStepBtn').disabled = !simulationState.isRunning;
}

// Function to update the visualization
function updateVisualization() {
    const stackElement = document.getElementById('stack');
    const outputElement = document.getElementById('output');
    const currentCharElement = document.getElementById('currentChar');
    const expressionDisplay = document.getElementById('expressionDisplay');
    const nextStepBtn = document.getElementById('nextStepBtn');
    
    // Update the full expression display
    expressionDisplay.textContent = simulationState.input;
    
    // Update current character with highlighting
    if (simulationState.currentCharIndex < simulationState.input.length) {
        const currentChar = simulationState.input[simulationState.currentCharIndex];
        currentCharElement.textContent = currentChar === ' ' ? '␣' : currentChar;
        currentCharElement.classList.add('active-char');
    } else if (simulationState.stack.length > 0) {
        currentCharElement.textContent = 'Processing stack...';
        currentCharElement.classList.remove('active-char');
    } else {
        currentCharElement.textContent = 'Done';
        currentCharElement.classList.remove('active-char');
    }
    
    // Update stack display
    stackElement.innerHTML = '';
    if (simulationState.stack.length === 0) {
        stackElement.innerHTML = '<div class="stack-empty">Empty</div>';
    } else {
        // Display stack from top to bottom (visually)
        for (let i = simulationState.stack.length - 1; i >= 0; i--) {
            const item = document.createElement('div');
            item.className = 'stack-item';
            
            // Highlight the top of the stack
            if (i === simulationState.stack.length - 1) {
                item.classList.add('stack-top');
            }
            
            // Special styling for parentheses
            if (simulationState.stack[i] === '(' || simulationState.stack[i] === ')') {
                item.classList.add('parenthesis');
            }
            
            item.textContent = simulationState.stack[i];
            stackElement.appendChild(item);
        }
    }
    
    // Update output display
    outputElement.innerHTML = '';
    if (simulationState.output.length === 0) {
        // Show empty state if needed
    } else {
        simulationState.output.forEach(char => {
            const item = document.createElement('div');
            item.className = 'output-item';
            
            // Special styling for operators in output
            if ('+-*/'.includes(char)) {
                item.classList.add('operator');
            }
            
            item.textContent = char;
            outputElement.appendChild(item);
        });
    }
    
    // Update button state
    if (simulationState.isComplete) {
        nextStepBtn.disabled = true;
        nextStepBtn.textContent = '✅ Complete';
    } else {
        nextStepBtn.disabled = false;
        nextStepBtn.textContent = '⏭️ Next Step';
    }
}

// Function to process the next step in the simulation
function nextStep() {
    if (simulationState.currentCharIndex >= simulationState.input.length) {
        // If we've processed all characters, pop remaining operators from stack
        if (simulationState.stack.length > 0) {
            const op = simulationState.stack.pop();
            if (op !== '(') {
                simulationState.output.push(op);
            }
            
            // Check if this was the last operation
            if (simulationState.stack.length === 0) {
                simulationState.isComplete = true;
                simulationState.isRunning = false;
                
                // Update the prefix output
                const prefix = infixToPrefix(simulationState.input);
                document.getElementById('prefixOutput').textContent = prefix;
            }
            
            updateVisualization();
            return;
        } else {
            // Simulation complete
            simulationState.isComplete = true;
            simulationState.isRunning = false;
            updateVisualization();
            return;
        }
    }
    
    const currentChar = simulationState.input[simulationState.currentCharIndex];
    
    // Skip whitespace
    if (currentChar === ' ') {
        simulationState.currentCharIndex++;
        nextStep();
        return;
    }
    
    if (/[a-zA-Z0-9]/.test(currentChar)) {
        // Operand: add to output
        simulationState.output.push(currentChar);
    } else if (currentChar === '(') {
        // Left parenthesis: push to stack
        simulationState.stack.push(currentChar);
    } else if (currentChar === ')') {
        // Right parenthesis: pop from stack until left parenthesis
        while (simulationState.stack.length > 0 && simulationState.stack[simulationState.stack.length - 1] !== '(') {
            simulationState.output.push(simulationState.stack.pop());
        }
        // Pop the left parenthesis
        simulationState.stack.pop();
    } else {
        // Operator
        while (
            simulationState.stack.length > 0 &&
            simulationState.stack[simulationState.stack.length - 1] !== '(' &&
            precedence(simulationState.stack[simulationState.stack.length - 1]) >= precedence(currentChar)
        ) {
            simulationState.output.push(simulationState.stack.pop());
        }
        simulationState.stack.push(currentChar);
    }
    
    simulationState.currentCharIndex++;
    updateVisualization();
}

// Function to start the simulation
function startSimulation() {
    const expr = document.getElementById('expr').value.trim();
    if (!expr) {
        alert('Please enter an expression to simulate!');
        return;
    }
    
    // Reset simulation state
    simulationState = {
        currentStep: 0,
        input: expr.replace(/\s+/g, ''), // Remove all whitespace
        stack: [],
        output: [],
        isRunning: true,
        currentCharIndex: 0,
        isComplete: false
    };
    
    // Reset UI
    resetSimulation();
    
    // Update the infix expression display
    document.getElementById('infixExpression').textContent = formatExpression(expr);
    
    // Enable the next step button
    document.getElementById('nextStepBtn').disabled = false;
    
    // Show initial state
    updateVisualization();
    
    // Auto-scroll to the simulation section
    document.querySelector('.simulation-panel').scrollIntoView({ behavior: 'smooth' });
}

// Helper function to format expression with spaces for better readability
function formatExpression(expr) {
    return expr.replace(/([+\-*/()])/g, ' $1 ').replace(/\s+/g, ' ').trim();
}

// Helper function to get operator precedence
function precedence(op) {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Enter key in input field starts simulation
    document.getElementById('expr').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startSimulation();
        }
    });
    
    // Auto-focus the input field when the page loads
    document.getElementById('expr').focus();
    
    // Add tooltips to buttons
    const buttons = {
        'startSimulation': 'Start the step-by-step simulation',
        'nextStepBtn': 'Process the next step in the conversion',
        'generateCode': 'Generate assembly code from the expression'
    };
    
    for (const [id, text] of Object.entries(buttons)) {
        const element = document.getElementById(id) || document.querySelector(`[onclick*="${id}"]`);
        if (element) {
            element.setAttribute('title', text);
            element.classList.add('tooltip');
        }
    }
});