function addCountries() {
  // Data route 
  var url = "/get_country_list";

  d3.json(url).then(function(countries) {
    // Convert id values to integers
    countries.forEach(cont => {
      cont.id = +cont.id;
    });      

    // Sort list
    countries.sort(function(a, b){
      if(a.country < b.country) { return -1; }
      if(a.country > b.country) { return 1; }
      return 0;
    });

    // Move US to the top of the list
    var cutOut = countries.splice(208, 1)[0];
    countries.splice(0, 0, cutOut);

    // Select dropdown
    var countryDropDown = d3.select("#inputCountry")
      .selectAll("option")
      .data(countries)
      .enter()
      .append("option")
      .attr("value", d => `${d.id};${d.country}`)
      .html(d => d.country)
  });
}
addCountries();