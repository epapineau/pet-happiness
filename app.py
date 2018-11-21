# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from flask_sqlalchemy import SQLAlchemy

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/database.sqlite"
db = SQLAlchemy(app)

# Define classes
class Population(db.Model):
    __tablename__ = 'Pet_Population_Data'
    id = db.Column(db.Integer, primary_key=True)
    Pet = db.Column(db.String(100))
    Country = db.Column(db.String(100))
    Population = db.Column(db.Integer)

class Happiness(db.Model):
    __tablename__ = 'World_Happiness'
    id = db.Column(db.Integer, primary_key=True)
    Country = db.Column(db.String(100))
    Happiness_Rank = db.Column(db.Integer)
    Happiness_Score = db.Column(db.Integer)
    GDP_per_capita = db.Column(db.Integer)
    Life_expectancy = db.Column(db.Integer)
    Generosity = db.Column(db.Integer)

@app.before_first_request
def setup():
    db.create_all()

# Home Route
@app.route("/")
def home():
    return render_template("index.html")

# Test route to examine db output
@app.route("/test")
def test():
    # Query db
    resultsPet = db.session.query(Population.Pet, Population.Country, Population.Population).all()
    resultsHappiness = db.session.query(Happiness.Country, Happiness.Happiness_Score).all()

    # Convert data into lists
    petType = [result[0] for result in resultsPet]
    petCountry = [result[1] for result in resultsPet]
    petPop = [result[2] for result in resultsPet]
    happinessCountry = [result[0] for result in resultsHappiness]
    happinessScore = [result[1] for result in resultsHappiness]

    # Gather data in plotly friendly format
    graphObj = [{
        "type": "bar",
        "x": petCountry,
        "y": petPop,
    },
    {
        "type": "bar",
        "x": happinessCountry,
        "y": happinessScore
    }]

    return jsonify(graphObj)

if __name__ == "__main__":
    app.run()