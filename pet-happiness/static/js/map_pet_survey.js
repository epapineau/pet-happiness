function mapSurvey() {
    // Route to survey data
    var url = "/map_survey";
    d3.json(url).then(function(surveyData){
        var data = surveyData;
        var layout = {
            scope: "usa",
            title: "Pet Population Survey",
            showlegend: false,
            height: 600,
                  // width: 980,
            geo: {
              scope: "usa",
              projection: {
                type: "albers usa"
              },
              showland: true,
              landcolor: "rgb(217, 217, 217)",
              subunitwidth: 1,
              countrywidth: 1,
              subunitcolor: "rgb(255,255,255)",
              countrycolor: "rgb(255,255,255)"
            }
        };

        // Plot data
        Plotly.newPlot("plot", data, layout);
    });
}

// Call function
mapSurvey();