# import necessary libraries
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
from config import DATABASE_URL, gkey, localHost, localPass

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
# gkey = os.environ['gkey']
# url = os.environ['DATABASE_URL']
engine = create_engine(DATABASE_URL)
# engine = create_engine(f'postgresql://{localHost}:{localPass}@localhost/pethappiness')

# Home Route
@app.route("/")
def home():
    return render_template("index.html")

# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        # Get form data
        petType = request.form["petType"]
        petQuant = request.form["petQuant"] # does not grab default value of 1
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
        insert = f"INSERT INTO pet_survey VALUES ({petType}, {petQuant}, {petCountryId}, '{petCity}', {lat}, {lng})"
        engine.execute(insert)

        return redirect("/", code=302)

    return render_template("contribute.html")

# Route to get all pet population data
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

    # Everything together in one dictionar
    petDict = {}
    petDict['dog'] = makedictionary(dogData)
    petDict['cat'] = makedictionary(catData)
    petDict['fish'] = makedictionary(fishData)
    petDict['bird'] = makedictionary(birdData)

    return jsonify(petDict)

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