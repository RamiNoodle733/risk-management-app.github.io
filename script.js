document.getElementById("riskInputForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form values
    const factor = document.getElementById("factor").value;
    const probability = parseInt(document.getElementById("probability").value);
    const impact = parseInt(document.getElementById("impact").value);

    // Calculate risk score
    const riskScore = (probability / 100) * impact;

    // Display result
    const resultElement = document.getElementById("result");
    resultElement.textContent = `Risk Score for ${factor}: ${riskScore.toFixed(2)}`;

    // Clear form
    document.getElementById("riskInputForm").reset();

    // Add data to chart
    addChartData(riskChart, factor, riskScore);
});

// Chart initial setup
const ctx = document.getElementById('riskChart').getContext('2d');
const riskChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [], // Factor names
        datasets: [{
            label: 'Risk Score',
            data: [], // Risk scores
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Function to add data to chart
function addChartData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

document.getElementById('exportPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Add title
    pdf.text("Risk Management Report", 10, 10);

    // Add risk analysis result
    const resultText = document.getElementById("result").textContent;
    pdf.text(resultText, 10, 20);

    // Add chart
    const chartCanvas = document.getElementById("riskChart");
    const chartImage = chartCanvas.toDataURL("image/png");
    pdf.addImage(chartImage, 'PNG', 10, 30, 180, 80); // Adjust the size and position as needed

    // Save the PDF
    pdf.save("risk_management_report.pdf");
});
