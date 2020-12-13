const getChart = (ObjectManpower) => {
    const Manpower = JSON.parse(ObjectManpower);

    let labels = [];
    let dataWork = [];
    let dataPlan = [];

    for (const key in Manpower) {
        labels[key] = Manpower[key].Name
        dataWork[key] = Manpower[key].Hour
        dataPlan[key] = Manpower[key].TotalHour
    }

    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                    label: "Work",
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    data: dataWork,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 3
                },
                {
                    label: "Plan",
                    backgroundColor: 'rgba(54, 162, 235, 0.3)',
                    data: dataPlan,
                    borderColor: 'rgba(54, 162, 235, 0.4)',
                    borderWidth: 3
                },

            ]
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
}

const getWeekdaysInmonth = (year, month) => {
    const days = [];

    let date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        if (![0, 6].includes(date.getDay())) days.push(date.getDate());
        date.setDate(date.getDate() + 1);
    }

    return days;
}

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}