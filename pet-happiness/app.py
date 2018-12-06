# Import Libraries
import os
import requests
import json
import numpy as np
import pandas as pd
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
# from config import DATABASE_URL, gkey, localHost, localPass

# Flask setup
app = Flask(__name__)

# Get keys from environment
gkey = os.environ['gkey']
url = os.environ['DATABASE_URL']

# Connect to database
engine = create_engine(url)
# engine = create_engine(f'postgresql://{localHost}:{localPass}@localhost/pethappiness')

# Home Route
@app.route("/")
def home():
    return render_template("index.html")

# Ian's graph Route
@app.route("/pet_per_capita")
def ian():
    return render_template("pet-per-capita.html")

# Mehrun's graph Route
@app.route("/pet_life_expectancy")
def mehrun():
    return render_template("pet-life-expectancy.html")

# Preeti's graph Route
@app.route("/preeti")
def preeti():
    return render_template("preeti.html")

# Read Geojson
@app.route("/geojson")
def geojson():
    with open("/templates/custom.geo.json") as f:
        data = json.load(f)
    return jsonify(data)
# Survey map route
@app.route("/survey_mapped")
def survey_map():
    return render_template("survey-map.html")

# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        # Get form data
        petType = request.form["petType"]
        petName = request.form["petName"] # does not grab default value of 1
        petCity = request.form["petCity"] 
        petCountry = request.form["petCountry"]  # country db id, not country name (needed to query for lat/long?) 
        petCountryId = petCountry.split(";")[0]
        petCountryName = petCountry.split(";")[1]
        
        # Get lattitude and longitude for city, country
        targetCity = f"{petCity}, {petCountryName}"
        targetUrl = f"https://maps.googleapis.com/maps/api/geocode/json?address={targetCity}&key={gkey}"
        locData = requests.get(targetUrl).json()
        lat = locData["results"][0]["geometry"]["location"]["lat"]
        lng = locData["results"][0]["geometry"]["location"]["lng"]

        # Insert results into db
        insert = f"INSERT INTO pet_survey VALUES ({petType}, '{petName}', {petCountryId}, '{petCity}', {lat}, {lng})"
        engine.execute(insert)

        return redirect("/survey_mapped", code=302)

    return render_template("contribute.html")

# Route to display pet survery data
@app.route("/map_survey")
def map_survey():
    # Query for pet survey data
    q = "SELECT ps.pet_name, ps.city, ps.latitude, ps.longitude, pi.pet_type\
         FROM pet_survey ps\
         NATURAL JOIN pet_id pi"
    surveyData = pd.read_sql(q, engine)

    # Transform to dictionary
    surveyDict = {}
    for col in list(surveyData.columns.values):
        surveyDict[col] = [x for x in surveyData[col]]

    # Create list of map labels
    petNames = surveyDict['pet_name']
    petType = surveyDict['pet_type']
    dataLabels = []
    for i in np.arange(len(petNames)):
        label = f"{petNames[i]} the {petType[i]}"
        dataLabels.append(label)

    # Plot 
    pet_data = [{
        "type": "scattergeo",
        "locationmode": "USA-states",
        "lat": surveyDict['latitude'],
        "lon": surveyDict['longitude'],
        "text": dataLabels,
        "hoverinfo": "text",
        "marker": {
            "size": 50,
            "line": {
                "color": "rgb(8,8,8)",
                "width": 1
            },
        }
    }]

    return jsonify(pet_data)

# Route to get all pet population data, formatted for plotly
@app.route("/get_pet_data")
def get_pet_data():
    # Query for all pet population data
    q = "SELECT * FROM pet_population\
         NATURAL JOIN country_id\
         NATURAL JOIN pet_id\
         NATURAL JOIN happiness_data\
         INNER JOIN world_bank_2017 ON pet_population.country_id = world_bank_2017.country_id"

    # Send query, clean response
    petData = pd.read_sql(q, engine)
    petData = petData.drop(["country_id", "pet_id"], axis = 1)

    # Calculate pets per capita
    petData['per_capita'] = petData['pet_population'] / petData['population']
    
    # Create dfs by pet type
    dogData = petData.loc[petData['pet_type'] == "dog"]
    catData = petData.loc[petData['pet_type'] == "cat"]
    fishData = petData.loc[petData['pet_type'] == "fish"]
    birdData = petData.loc[petData['pet_type'] == "bird"]

    # Function to transfrom df to dictionary
    def makedictionary(df):
        queryDict = {}
        for col in list(df.columns.values):
            queryDict[col] = [x for x in df[col]]
        return queryDict

    # Everything together in one dictionary
    petDict = {}
    petDict['dog'] = makedictionary(dogData)
    petDict['cat'] = makedictionary(catData)
    petDict['fish'] = makedictionary(fishData)
    petDict['bird'] = makedictionary(birdData)

    return jsonify(petDict)

# Route to get all pet population data, formatted for d3
@app.route("/get_pet_data_d3")
def get_pet_data_d3():
    # Query for all pet population data
    q = "SELECT * FROM pet_population\
         NATURAL JOIN country_id\
         NATURAL JOIN pet_id\
         NATURAL JOIN happiness_data\
         INNER JOIN world_bank_2017 ON pet_population.country_id = world_bank_2017.country_id"

    # Send query, clean response
    petData = pd.read_sql(q, engine)
    petData = petData.drop(["country_id", "pet_id"], axis = 1)

    # Calculate pets per capita
    petData['per_capita'] = petData['pet_population'] / petData['population']
    
    # Create dfs by pet type
    dogData = petData.loc[petData['pet_type'] == "dog"]
    catData = petData.loc[petData['pet_type'] == "cat"]
    fishData = petData.loc[petData['pet_type'] == "fish"]
    birdData = petData.loc[petData['pet_type'] == "bird"]

    def maked3dictionary(df):
        colNames = list(df.columns.values)
        petDataList = []
        for i in np.arange(len(df)):
            d3Dict = {}
            for col in np.arange(len(colNames)):
                value = df.iloc[i, col]
                if(isinstance(value, str) or isinstance(value, int)):
                    d3Dict[colNames[col]] = value
                else:
                    d3Dict[colNames[col]] = np.asscalar(value)
            petDataList.append(d3Dict) 
        return petDataList

    d3PetDict = {}
    d3PetDict['dog'] = maked3dictionary(dogData)
    d3PetDict['cat'] = maked3dictionary(catData)
    d3PetDict['fish'] = maked3dictionary(fishData)
    d3PetDict['bird'] = maked3dictionary(birdData)

    return jsonify(d3PetDict)

# Route to get all world bank country data
@app.route("/get_wb_data")
def get_wb_data():
    # Query for all world happiness data
    q = "SELECT * FROM happiness_data\
        NATURAL JOIN country_id\
        INNER JOIN world_bank_2017 ON happiness_data.country_id = world_bank_2017.country_id"

    # Send query, clean response
    worldData = pd.read_sql(q, engine)
    worldData = worldData.fillna(0)
    worldData = worldData.drop("country_id", axis = 1)

    # Transform to dictionary
    worldDict = {}
    for col in list(worldData.columns.values):
        worldDict[col] = [x for x in worldData[col]]

    return jsonify(worldDict)

# Route to get all pet population data
@app.route("/get_country_list")
def get_country_list():
    # Query for all pet population data
    q = "SELECT * FROM country_id"

    # Send query, clean response
    countries = pd.read_sql(q, engine)
    countriesList = []
    for i in np.arange(len(countries)):
        countryID = str(countries['country_id'][i])
        countryName = countries['country'][i]
        countriesList.append({'id': countryID, 'country': countryName})

    return jsonify(countriesList)

if __name__ == "__main__":
    app.run()