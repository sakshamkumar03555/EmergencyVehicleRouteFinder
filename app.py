
from flask import Flask, render_template, request, jsonify

from data.locations import LOCATIONS, GRAPH
from algorithms.dijkstra import dijkstra

app = Flask(__name__)


# Home Page
@app.route("/")
def home():
    return render_template("index.html")


# Get all available locations
@app.route("/api/locations", methods=["GET"])
def get_locations():

    return jsonify(LOCATIONS)


# Find shortest route
@app.route("/api/find-route", methods=["POST"])
def find_route():

    data = request.get_json()

    start = data.get("start")
    end = data.get("end")

    # Validate locations
    if start not in LOCATIONS or end not in LOCATIONS:
        return jsonify({
            "success": False,
            "message": "Invalid starting or destination location."
        }), 400

    if start == end:
        return jsonify({
            "success": False,
            "message": "Start and destination cannot be same."
        }), 400

    # Run Dijkstra Algorithm
    result = dijkstra(GRAPH, start, end)

    if result is None:
        return jsonify({
            "success": False,
            "message": "No route available."
        }), 404

    # Prepare route names
    route_names = [
        LOCATIONS[node]["name"]
        for node in result["path"]
    ]

    # Calculate estimated time
    # Assumed average speed = 40 km/hour
    estimated_time = round(
        (result["distance"] / 40) * 60
    )

    return jsonify({
        "success": True,
        "route": result["path"],
        "route_names": route_names,
        "distance": result["distance"],
        "estimated_time": estimated_time
    })


# Get complete road graph
@app.route("/api/graph", methods=["GET"])
def get_graph():

    return jsonify(GRAPH)


if __name__ == "__main__":
    app.run(debug=True)
