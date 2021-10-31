let myChart1 = document.getElementById('myChart1').getContext('2d');

// Global Options
Chart.defaults.global.defaultFontFamily = 'Lato';
Chart.defaults.global.defaultFontSize = 17;
Chart.defaults.global.defaultFontColor = '#777';

let gastosDebito = new Chart(myChart1, {
    type: 'doughnut',
    data: {
        labels: ['Evitáveis', 'Não Evitáveis'],
        datasets: [{
            label: 'Débito',
            data: [
                550,
                1200,
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
            ],
            borderWidth: 1,
            borderColor: '#fff',
            hoverBorderWidth: 3,
            hoverBorderColor: '#000'
        }]
    },

    options: {
        title: {
            display: true,
            text: 'Gastos Débito ',
            fontSize: 25
        },
        legend: {
            display: true,
            position: 'right',
            labels: {
                fontColor: '#000'
            }
        },
        layout: {
            padding: {
                left: 15,
                right: 15,
                bottom: 0,
                top: 20
            }
        },
        tooltips: {
            enabled: true
        }
    }
});
