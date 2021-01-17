$(document).ready(function() {

    function getData(country) {
        if (country === 'Global') {
            $.getJSON("https://disease.sh/v3/covid-19/all", function(data) {
                $('#country-name').empty()
                $('#country-name').append('Global')
                $('#country-flag').attr("src", "./images/global.png");

                fetchData(data)
            });
        } else {
            $.getJSON(`https://disease.sh/v3/covid-19/countries/${country}/`, function(data) {
                $('#country-name').empty()
                $('#country-name').append(data.country)
                $('#country-flag').attr("src", data.countryInfo.flag);

                fetchData(data, country)
            });

        }
    }

    function clearAllData() {
        $('#cases').empty()
        $('#today_cases').empty()
        $('#recoveries').empty()
        $('#today_recoveries').empty()
        $('#active').empty()
        $('#today_critical').empty()
        $('#deaths').empty()
        $('#today_deaths').empty()
        $('[id="date_now"]').empty()
    }

    function fetchData(data, filter = 'Global') {
        clearAllData()  
        let country = filter
        let get_date = []
        if (country === 'Global') {
            $.getJSON("https://disease.sh/v3/covid-19/historical/all", function(data) {
                get_date.push(...Object.keys(data.cases))

                displayChart(data)
            });
        } else {
            $.getJSON(`https://disease.sh/v3/covid-19/historical/${country}`, function(data) {
                get_date.push(...Object.keys(data.timeline.cases))

                displayChart(data)
            });
        }

        function displayChart(data) {
            let cases = []
            let deaths = []
            let recovered = []

            if (country == 'Global') {
                cases = data.cases
                deaths = data.deaths
                recovered = data.recovered
            } else {
                cases = data.timeline.cases
                deaths = data.timeline.deaths
                recovered = data.timeline.recovered
            }

            // Chart for Cases
            var myChart = new Chart(document.getElementById('chart_cases').getContext('2d'), {
                type: 'line',
                data: {
                    labels: [get_date][0],
                    datasets: [
                        {
                            data: Object.values(cases),
                            backgroundColor:"#f1c40f",
                        }, 
                    ],
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Confirmed Cases History for the Past Month'
                    },
                    legend:
                    {
                        display: false
                    }
                }
            });

            // Chart for Recovered
            var myChart2 = new Chart(document.getElementById('chart_recovery').getContext('2d'), {
                type: 'line',
                data: {
                    labels: [get_date][0],
                    datasets: [
                        {
                            data: Object.values(recovered),
                            label: 'Recovered',
                            backgroundColor: 'rgba(0, 255, 0, 0.5)',
                            fill: true
                        }, 
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Recovery History for the Past Month'
                    },
                    legend:
                    {
                        display: false
                    }
                }
            });

            // Chart for Deaths
            var myChart3 = new Chart(document.getElementById('chart_death').getContext('2d'), {
                type: 'line',
                data: {
                    labels: [get_date][0],
                    datasets: [
                        {
                            data: Object.values(deaths),
                            label: 'Deaths',
                            backgroundColor: 'rgba(255, 0, 0, 0.5)',
                            fill: true
                        }, 
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Deaths History for the Past Month'
                    },
                    legend:
                    {
                        display: false
                    }
                }
            });
        }



        today  = new Date();
        $('[id="date_now"]').append(today.toDateString("en-US"));

        let total_cases = formatNumber((data.cases));
        let total_recoveries = formatNumber(data.recovered);
        let total_deaths = formatNumber(data.deaths);
        let total_active = formatNumber(data.active);

        let today_cases = formatNumber((data.todayCases));
        let today_recoveries = formatNumber(data.todayRecovered);
        let today_deaths = formatNumber(data.todayDeaths);
        let today_active = formatNumber(data.critical);
        

        $('#cases').append(total_cases);
        $('#recoveries').append(total_recoveries);
        $('#deaths').append(total_deaths);
        $('#active').append(total_active);

        $('#today_cases').append(today_cases);
        $('#today_recoveries').append(today_recoveries);
        $('#today_deaths').append(today_deaths);
        $('#today_critical').append(today_active);
    }

    getData('Global')

    // format numbers
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    
    //Get the selected country name
    $("select").change(function () {
        selected_country = document.getElementById("countries").value
        getData(selected_country);
    });

    // fetch all countries
    $.getJSON("https://corona.lmao.ninja/v2/countries", function(data) {
        for(let countries of data) {
            // create option element with the value of country name
            let option = '<option style="width:90%"> ' + countries.country + '</option>'
            $('#countries').append(option);
        }
        

        
    });



});