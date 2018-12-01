# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import pandas as pd
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
from config import DATABASE_URL

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
# url = os.environ['DATABASE_URL']
engine = create_engine(DATABASE_URL)

# @app.before_first_request
# def setup():
#     db.create_all()

# Home Route
@app.route("/")
def home():
    return render_template("index.html")

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

    # Transform to dictionary
    queryDict = {}
    for col in list(petData.columns.values):
        queryDict[col] = [x for x in petData[col]]

    # # Gather data in plotly friendly format
    # graphObj = [{
    #     "type": "bar",
    #     "x": petCountry,
    #     "y": petPop,
    # },
    # {
    #     "type": "bar",
    #     "x": happinessCountry,
    #     "y": happinessScore
    # }]

    return jsonify(queryDict)

# Route to get all world bank country data
@app.route("/get_wb_data")
def get_wb_data():
    # Query for all world happiness data
    q = "SELECT * FROM happiness_data\
        NATURAL JOIN country_id\
        INNER JOIN world_bank_2017 ON happiness_data.country_id = world_bank_2017.country_id"

    # Send query, clean response
    worldData = pd.read_sql(q, engine)
    worldData = worldData.drop("country_id", axis = 1)

    # Transform to dictionary
    worldDict = {}
    for col in list(worldData.columns.values):
        worldDict[col] = [x for x in worldData[col]]

    return jsonify(worldDict)

if __name__ == "__main__":
    app.run()