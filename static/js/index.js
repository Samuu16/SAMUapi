document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch data from the API
    async function fetchData() {
        try {
            const response = await fetch('/api/sensor_data');
            const data = await response.json();
            console.log("Fetched data:", data); // Log the data structure
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    let sensorChart = null;

// Function to fetch data from the API
async function fetchData() {
    const response = await fetch('/api/sensor_data');
    const data = await response.json();
    return data;
}

// Function to create the line chart
async function createChart() {
    const data = await fetchData();

    // Destroy existing chart instance if it exists
    if (sensorChart) {
        sensorChart.destroy();
    }

    var ctx = document.getElementById('sensorChart').getContext('2d');
    sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Sensor Data',
                    data: data.sensorData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Volume Liters',
                    data: data.volumeLiters,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to filter data by date
async function filterByDate() {
    const datePicker = document.getElementById('datePicker');
    const selectedDate = datePicker.value;
    const data = await fetchData();

    const index = data.labels.findIndex(date => date === selectedDate);
    if (index !== -1) {
        const filteredLabels = data.labels.slice(index);
        const filteredSensorData = data.sensorData.slice(index);
        const filteredVolumeLiters = data.volumeLiters.slice(index);

        // Update the chart with the filtered data
        sensorChart.data.labels = filteredLabels;
        sensorChart.data.datasets[0].data = filteredSensorData;
        sensorChart.data.datasets[1].data = filteredVolumeLiters;
        sensorChart.update();
    } else {
        alert("Data not found for selected date!");
    }
}

// Function to filter data by month
async function filterByMonth() {
    const monthSelect = document.getElementById('monthSelect');
    const selectedMonth = parseInt(monthSelect.value);
    const data = await fetchData();
    const monthData = [];
    for (let i = 0; i < data.labels.length; i++) {
        const date = new Date(data.labels[i]);
        if (date.getMonth() === selectedMonth) {
            monthData.push({
                label: data.labels[i],
                sensorValue: data.sensorData[i],
                volumeValue: data.volumeLiters[i]
            });
        }
    }
    if (monthData.length > 0) {
        const labels = monthData.map(item => item.label);
        const sensorData = monthData.map(item => item.sensorValue);
        const volumeLiters = monthData.map(item => item.volumeValue);

        // Update the chart with the filtered data
        sensorChart.data.labels = labels;
        sensorChart.data.datasets[0].data = sensorData;
        sensorChart.data.datasets[1].data = volumeLiters;
        sensorChart.update();
    } else {
        alert("Data not found for selected month!");
    }
}

// Event listeners for the buttons
document.getElementById('filterByDateBtn').addEventListener('click', filterByDate);
document.getElementById('filterByMonthBtn').addEventListener('click', filterByMonth);

// Call createChart function to render the chart
createChart();


    // Add event listener for the "Filter by Date" button
    document.getElementById('filterByDateBtn').addEventListener('click', function() {
        filterByDate();
    });

    // Add event listener for the "Filter by Month" button
    document.getElementById('filterByMonthBtn').addEventListener('click', function() {
        filterByMonth();
    });

    // Menu icon functionality
    let menuicn = document.querySelector(".menuicn"); 
    let nav = document.querySelector(".navcontainer"); 

    menuicn.addEventListener("click", function() {
        nav.classList.toggle("navclose");
    });

    // Show form button functionality

    // Update form functionality
    const updateButtons = document.querySelectorAll('.update-btn');

    updateButtons.forEach(button => {
        button.addEventListener('click', () => {
            const entryId = button.getAttribute('data-entry-id');
            const updateForm = document.querySelector(`.update-form[data-entry-id="${entryId}"]`);
            updateForm.classList.toggle('hidden');
        });
    });

    function loadContent(page) {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                document.getElementById('content').innerHTML = html;
            })
            .catch(error => console.error('Error fetching content:', error));
    }

    // Fetch and update the count of device entries logged
    $.get("/api/device_entries_logged", function(data) {
        $("#devices_logged").text(data.device_entries_logged);
    });

    // Fetch and update the count of active devices
    $.get("/api/no_of_devices_active", function(data) {
        $("#active_devices").text(data.no_of_devices_active);
    });
});
