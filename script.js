let scenarios = [];

// Function to initialize a chart and catch any errors
function initializeChart(chartId, config) {
    try {
        const ctx = document.getElementById(chartId).getContext('2d');
        return new Chart(ctx, config);
    } catch (error) {
        console.error(`Failed to initialize chart: ${chartId}`, error);
    }
}

// Function to add data to charts with error checking
function addChartData(chart, label, data) {
    if (!chart) return;
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

// Risk Score Bar Chart
const riskChart = initializeChart('riskChart', {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Risk Score',
            data: [],
            backgroundColor: 'rgba(255, 138, 101, 0.8)',
            borderColor: 'rgba(255, 138, 101, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
            }
        }
    }
});

// Trend Line Chart
const trendChart = initializeChart('trendChart', {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Risk Trend',
            data: [],
            backgroundColor: 'rgba(129, 199, 132, 0.2)',
            borderColor: 'rgba(129, 199, 132, 1)',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
            }
        }
    }
});

// Comparison Bar Chart
const comparisonChart = initializeChart('comparisonChart', {
    type: 'bar',
    data: {
        labels: ['Scenario 1', 'Scenario 2'],
        datasets: [
            {
                label: 'Scenario 1',
                data: [0],  // Only provide data for Scenario 1 initially
                backgroundColor: 'rgba(174, 213, 129, 0.8)',
                borderColor: 'rgba(174, 213, 129, 1)',
                borderWidth: 1
            },
            {
                label: 'Scenario 2',
                data: [0, 0],  // Provide an empty data point for Scenario 1, data for Scenario 2
                backgroundColor: 'rgba(77, 182, 172, 0.8)',
                borderColor: 'rgba(77, 182, 172, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            x: {
                categoryPercentage: 0.4,
                barPercentage: 0.3,
            }
        }
    }
});

// Event listener for comparison
document.getElementById('compareButton').addEventListener('click', function() {
    const scenario1Index = document.getElementById('scenario1').value;
    const scenario2Index = document.getElementById('scenario2').value;

    const scenario1 = scenarios[scenario1Index];
    const scenario2 = scenarios[scenario2Index];

    // Update both datasets with proper spacing
    comparisonChart.data.datasets[0].data = [scenario1.riskScore, 0];
    comparisonChart.data.datasets[1].data = [0, scenario2.riskScore];

    comparisonChart.update();
});

// Radar Chart
const radarChart = initializeChart('radarChart', {
    type: 'radar',
    data: {
        labels: ['Probability', 'Impact', 'Control Effectiveness'],
        datasets: []
    },
    options: {
        scales: {
            r: {
                beginAtZero: true,
                grid: {
                    color: "rgba(255, 255, 255, 0.1)"
                },
                pointLabels: {
                    color: '#ffffff'
                },
            }
        }
    }
});

// Function to add data to the radar chart
function addRadarData(chart, label, probability, impact, controlEffectiveness) {
    chart.data.datasets.push({
        label: label,
        data: [probability, impact * 10, controlEffectiveness], // Multiply impact by 10
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 2
    });
    chart.update();
}

// Update dropdowns for comparison chart
function updateScenarioDropdowns() {
    const scenario1Dropdown = document.getElementById('scenario1');
    const scenario2Dropdown = document.getElementById('scenario2');

    scenario1Dropdown.innerHTML = '';
    scenario2Dropdown.innerHTML = '';

    scenarios.forEach((scenario, index) => {
        const option1 = document.createElement('option');
        option1.value = index;
        option1.text = scenario.factor;
        scenario1Dropdown.add(option1);

        const option2 = document.createElement('option');
        option2.value = index;
        option2.text = scenario.factor;
        scenario2Dropdown.add(option2);
    });
}

// Add automatic comparison for testing purposes
document.getElementById("riskInputForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const factor = document.getElementById("factor").value;
    const probability = parseInt(document.getElementById("probability").value);
    const impact = parseInt(document.getElementById("impact").value);
    const controlEffectiveness = parseInt(document.getElementById("controlEffectiveness").value);

    const riskScore = (probability / 100) * impact;

    document.getElementById("result").textContent = `Risk Score for ${factor}: ${riskScore.toFixed(2)}`;
    document.getElementById("mitigation-suggestions").textContent = generateMitigationSuggestions(probability, impact);

    addChartData(riskChart, factor, riskScore);
    addChartData(trendChart, factor, riskScore);

    // Store the scenario for later comparison
    scenarios.push({ factor, riskScore, probability, impact, controlEffectiveness });
    updateScenarioDropdowns();

    // Add the data to the radar chart
    addRadarData(radarChart, factor, probability, impact, controlEffectiveness);
});

// Event listener for comparison
document.getElementById('compareButton').addEventListener('click', function() {
    const scenario1Index = document.getElementById('scenario1').value;
    const scenario2Index = document.getElementById('scenario2').value;

    const scenario1 = scenarios[scenario1Index];
    const scenario2 = scenarios[scenario2Index];

    comparisonChart.data.labels = ['Scenario 1', 'Scenario 2'];
    comparisonChart.data.datasets[0].data = [scenario1.riskScore];
    comparisonChart.data.datasets[1].data = [scenario2.riskScore];
    comparisonChart.update();
});

// Generate risk mitigation suggestions
function generateMitigationSuggestions(probability, impact) {
    if (probability > 70 && impact > 7) {
        return "Implement stringent controls and contingency plans.";
    } else if (probability > 50 && impact > 5) {
        return "Regular monitoring and review of risk factors recommended.";
    } else if (probability < 30) {
        return "Risk is low; standard monitoring should suffice.";
    }
    return "No suggestions available.";
}

// Export as PDF functionality
document.getElementById("exportButton").addEventListener("click", function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Risk Management Report', 20, 20);

    const resultText = document.getElementById("result").textContent;
    doc.setFontSize(12);
    doc.text(resultText, 20, 40);

    // Add charts if they exist
    if (riskChart) {
        const riskImg = riskChart.toBase64Image();
        doc.addImage(riskImg, 'PNG', 20, 60, 120, 60);
    }
    if (trendChart) {
        const trendImg = trendChart.toBase64Image();
        doc.addImage(trendImg, 'PNG', 20, 130, 120, 60);
    }

    doc.save('risk_management_report.pdf');
});
