const form = document.getElementById('vote-form');

form.addEventListener('submit', (e)=>{
    
    const choice = document.querySelector('input[name=os]:checked').value;

    const data = {os : choice};

    postRequestPoll(data);

    e.preventDefault();
});

let dataPoints = [
    {label: 'Windows', y: 0},
    {label: 'MacOS', y: 0},
    {label: 'Linux', y: 0},
    {label: 'Other', y: 0},
];

const chartContainer = document.querySelector('#chartContainer');

if(chartContainer){

    const chart = initializeChart(dataPoints);

    chart.render();

    bindDataChartInPusher(chart, dataPoints);
}

function initializeChart(data){

    return new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        theme: 'theme1',
        title:{
            text:'OS Results'
        },
        data :[
            {
                type: 'column',
                dataPoints: data
            }
        ]
    });
}

function postRequestPoll(data){
    
    fetch('/poll', {
        method:'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type' : 'application/json'
        })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

function bindDataChartInPusher(chart, dataPoints){
   
    Pusher.logToConsole = true;

    const pusherAppKey = 'YOUR-PUSHER-APP-KEY';
    const pusherCluster = 'YOUR-PUSHER-CLUSTER';

    let pusher = new Pusher(pusherAppKey, {
    cluster: pusherCluster,
    forceTLS: true
    });
 
    let channel = pusher.subscribe('os-poll');
    
    channel.bind('os-vote', function(data) {
    dataPoints = dataPoints.map(dataPoint => {
        if(dataPoint.label == data.os){
            dataPoint.y += data.points
            return dataPoint;
        }

        return dataPoint;
    });

    chart.render();
    });
}