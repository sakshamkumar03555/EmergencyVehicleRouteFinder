
# Emergency Vehicle Route Finder
# Custom City Locations and Road Network

# All locations with their map coordinates
LOCATIONS = {
    "A": {
        "name": "City Hospital",
        "x": 150,
        "y": 300
    },
    "B": {
        "name": "Railway Station",
        "x": 350,
        "y": 100
    },
    "C": {
        "name": "Bus Stand",
        "x": 350,
        "y": 300
    },
    "D": {
        "name": "City Center",
        "x": 550,
        "y": 100
    },
    "E": {
        "name": "Police Station",
        "x": 550,
        "y": 300
    },
    "F": {
        "name": "Fire Station",
        "x": 750,
        "y": 100
    },
    "G": {
        "name": "Airport",
        "x": 950,
        "y": 200
    },
    "H": {
        "name": "University",
        "x": 750,
        "y": 400
    },
    "I": {
        "name": "Market",
        "x": 350,
        "y": 500
    },
    "J": {
        "name": "Emergency Center",
        "x": 950,
        "y": 450
    }
}


# Weighted Graph (Road distances in KM)
GRAPH = {
    "A": {"B": 5, "C": 3, "I": 7},
    "B": {"A": 5, "C": 2, "D": 4},
    "C": {"A": 3, "B": 2, "D": 3, "E": 4, "I": 3},
    "D": {"B": 4, "C": 3, "E": 2, "F": 3},
    "E": {"C": 4, "D": 2, "F": 4, "H": 3, "I": 5},
    "F": {"D": 3, "E": 4, "G": 5, "H": 6},
    "G": {"F": 5, "H": 4, "J": 3},
    "H": {"E": 3, "F": 6, "G": 4, "I": 4, "J": 2},
    "I": {"A": 7, "C": 3, "E": 5, "H": 4},
    "J": {"G": 3, "H": 2}
}
