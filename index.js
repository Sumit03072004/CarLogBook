let month, year, startingKilometer;
const daysInMonth = {
    1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30,
    7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
};
let dailyRuns = [];
const resultsBody = document.getElementById('results');

function setMonthYear() {
    month = parseInt(document.getElementById('monthInput').value);
    year = parseInt(document.getElementById('yearInput').value);

    if (isNaN(month) || month < 1 || month > 12 || isNaN(year) || year < 1) {
        alert("Please enter a valid month (1-12) and year.");
        return;
    }

    // Handle leap year for February
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))) {
        daysInMonth[2] = 29;
    }

    document.getElementById('startingKilometerEntry').style.display = 'block';
    document.getElementById('monthInput').disabled = true;
    document.getElementById('yearInput').disabled = true;
}

function setStartingKilometer() {
    startingKilometer = parseFloat(document.getElementById('startingKilometerInput').value);

    if (isNaN(startingKilometer) || startingKilometer < 0) {
        alert("Please enter a valid starting kilometer.");
        return;
    }

    document.getElementById('runEntry').style.display = 'block';
    document.getElementById('resultsTable').style.display = 'table';
    document.getElementById('startingKilometerInput').disabled = true;
    document.getElementById('startingKilometerEntry').style.display = 'none';
}

function addRun() {
    const kilometersRun = parseFloat(document.getElementById('kilometersRun').value);
    if (isNaN(kilometersRun)) {
        alert("Please enter a valid number for kilometers run.");
        return;
    }

    if (dailyRuns.length >= daysInMonth[month]) {
        alert("All days in the selected month are already logged.");
        return;
    }

    const currentDate = new Date(year, month - 1, dailyRuns.length + 1); // JavaScript month is 0-indexed
    const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dayFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'long' });

    let randomExtra = 0;
    let endingKilometer = startingKilometer;
    let startingText = startingKilometer;
    let endingText = endingKilometer;

    if (kilometersRun === 0) {
        startingText = "Stand By";
        endingText = "Stand By";
    } else {
        if (dailyRuns.length < daysInMonth[month] && currentDate.getDate() !== 1) {
            randomExtra = 7 + Math.floor(Math.random() * 6); // Generate a random number between 7 and 12
            startingKilometer += randomExtra; // Add random extra to the starting kilometer
        }
        endingKilometer = startingKilometer + kilometersRun;
        startingText = startingKilometer;
        endingText = endingKilometer;
    }

    dailyRuns.push({ 
        date: currentDate, 
        day: dayFormatter.format(currentDate),
        kilometersRun, 
        startingText, 
        endingText, 
        randomExtra 
    });
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${formatter.format(currentDate)}</td>
        <td>${dayFormatter.format(currentDate)}</td>
        <td>${kilometersRun}</td>
        <td>${startingText}</td>
        <td>${endingText}</td>
        <td>${randomExtra > 0 ? randomExtra : ''}</td>
    `;
    resultsBody.appendChild(row);

    if (kilometersRun !== 0) {
        startingKilometer = endingKilometer; // Update starting kilometer for the next entry only if kilometersRun is not 0
    }
    document.getElementById('kilometersRun').value = '';
}

// Add event listener for the Enter key
document.getElementById('kilometersRun').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addRun();
    }
});
