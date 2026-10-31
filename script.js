
// ==========================================
// EMERGENCY VEHICLE ROUTE FINDER
// JavaScript Frontend Integration
// ==========================================


// Store locations and graph connections
let locations = {};
let graph = {};


// SVG Map Elements
const roadsGroup = document.getElementById("roads");
const routeLinesGroup = document.getElementById("routeLines");
const mapNodesGroup = document.getElementById("mapNodes");


// Form Elements
const routeForm = document.getElementById("routeForm");

const startLocation = document.getElementById("startLocation");
const endLocation = document.getElementById("endLocation");
const vehicleType = document.getElementById("vehicleType");

const findRouteBtn = document.getElementById("findRouteBtn");

const resultSection = document.getElementById("resultSection");

const distanceElement = document.getElementById("distance");
const estimatedTimeElement = document.getElementById("estimatedTime");
const selectedVehicleElement = document.getElementById("selectedVehicle");

const routeNamesElement = document.getElementById("routeNames");
const errorMessage = document.getElementById("errorMessage");


// ==========================================
// 1. LOAD LOCATIONS FROM FLASK BACKEND
// ==========================================

async function loadLocations() {

    try {

        const response = await fetch("/api/locations");

        if (!response.ok) {
            throw new Error("Unable to load locations");
        }

        locations = await response.json();

        // Draw custom city map
        drawCityMap();

        console.log("Locations loaded successfully!");

    }

    catch (error) {

        console.error("Location Error:", error);

        errorMessage.textContent =
            "Unable to load city locations.";

    }

}


// ==========================================
// 2. DRAW CITY MAP
// ==========================================

function drawCityMap() {

    roadsGroup.innerHTML = "";
    routeLinesGroup.innerHTML = "";
    mapNodesGroup.innerHTML = "";

    // Draw roads using graph connections
    for (const [source, connections] of Object.entries(graph)) {

        for (const [destination, distance] of Object.entries(connections)) {

            // Avoid drawing duplicate roads
            if (source < destination) {

                const start = locations[source];
                const end = locations[destination];

                const road = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );

                road.setAttribute("x1", start.x);
                road.setAttribute("y1", start.y);

                road.setAttribute("x2", end.x);
                road.setAttribute("y2", end.y);

                road.setAttribute("stroke", "#475569");
                road.setAttribute("stroke-width", "7");
                road.setAttribute("stroke-linecap", "round");

                roadsGroup.appendChild(road);


                // Road distance label
                const middleX = (start.x + end.x) / 2;
                const middleY = (start.y + end.y) / 2;

                const label = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );

                label.setAttribute("x", middleX);
                label.setAttribute("y", middleY - 10);

                label.setAttribute("fill", "#cbd5e1");
                label.setAttribute("font-size", "16");
                label.setAttribute("text-anchor", "middle");

                label.textContent = distance + " km";

                roadsGroup.appendChild(label);

            }

        }

    }


    // Draw location nodes
    for (const [id, location] of Object.entries(locations)) {

        const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        circle.setAttribute("cx", location.x);
        circle.setAttribute("cy", location.y);
        circle.setAttribute("r", "13");

        circle.setAttribute("fill", "#3b82f6");
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", "3");

        mapNodesGroup.appendChild(circle);


        // Location name
        const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        text.setAttribute("x", location.x);
        text.setAttribute("y", location.y + 35);

        text.setAttribute("fill", "#ffffff");
        text.setAttribute("font-size", "17");
        text.setAttribute("font-weight", "bold");
        text.setAttribute("text-anchor", "middle");

        text.textContent = location.name;

        mapNodesGroup.appendChild(text);

    }

}


// ==========================================
// 3. LOAD ROAD GRAPH
// ==========================================

async function loadGraph() {

    try {

        const response = await fetch("/api/graph");

        if (!response.ok) {
            throw new Error("Unable to load road graph");
        }

        graph = await response.json();

        drawCityMap();

    }

    catch (error) {

        console.error("Graph Error:", error);

        errorMessage.textContent =
            "Unable to load road connections.";

    }

}


// ==========================================
// 4. FIND SHORTEST ROUTE
// ==========================================

routeForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    errorMessage.textContent = "";

    resultSection.classList.add("hidden");

    const start = startLocation.value;
    const end = endLocation.value;

    const vehicle = vehicleType.value;


    // Validate selection
    if (start === end) {

        errorMessage.textContent =
            "Starting location and destination cannot be same.";

        return;

    }


    findRouteBtn.disabled = true;

    findRouteBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Finding Route...';


    try {

        const response = await fetch("/api/find-route", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                start: start,
                end: end
            })

        });


        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message || "Route not found"
            );

        }


        // Display route information
        displayResults(result, vehicle);

        // Highlight route on map
        highlightRoute(result.route);

    }


    catch (error) {

        console.error("Route Error:", error);

        errorMessage.textContent = error.message;

    }


    finally {

        findRouteBtn.disabled = false;

        findRouteBtn.innerHTML =
            '<i class="fa-solid fa-magnifying-glass-location mr-2"></i> Find Best Route';

    }

});


// ==========================================
// 5. DISPLAY ROUTE RESULTS
// ==========================================

function displayResults(result, vehicle) {

    resultSection.classList.remove("hidden");

    distanceElement.textContent =
        result.distance + " KM";

    estimatedTimeElement.textContent =
        result.estimated_time + " Min";

    selectedVehicleElement.textContent = vehicle;


    routeNamesElement.innerHTML = "";


    result.route_names.forEach((name, index) => {

        const routeItem = document.createElement("span");

        routeItem.className =
            "bg-slate-800 px-4 py-2 rounded-lg";

        routeItem.textContent = name;

        routeNamesElement.appendChild(routeItem);


        if (index < result.route_names.length - 1) {

            const arrow = document.createElement("span");

            arrow.className = "text-green-400";

            arrow.textContent = " → ";

            routeNamesElement.appendChild(arrow);

        }

    });

}


// ==========================================
// 6. HIGHLIGHT SHORTEST ROUTE
// ==========================================

function highlightRoute(route) {

    routeLinesGroup.innerHTML = "";

    // Draw highlighted route
    for (let i = 0; i < route.length - 1; i++) {

        const start = locations[route[i]];
        const end = locations[route[i + 1]];


        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.setAttribute("x1", start.x);
        line.setAttribute("y1", start.y);

        line.setAttribute("x2", end.x);
        line.setAttribute("y2", end.y);

        line.setAttribute("stroke", "#22c55e");
        line.setAttribute("stroke-width", "11");

        line.setAttribute("stroke-linecap", "round");

        routeLinesGroup.appendChild(line);

    }


    // Draw selected locations above route lines
    drawRouteMarkers(route);

}


// ==========================================
// 7. ROUTE START AND END MARKERS
// ==========================================

function drawRouteMarkers(route) {

    route.forEach((id, index) => {

        const location = locations[id];

        const marker = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        marker.setAttribute("cx", location.x);
        marker.setAttribute("cy", location.y);

        marker.setAttribute("r", "17");

        marker.setAttribute(
            "fill",
            index === 0 ? "#16a34a" :
            index === route.length - 1 ? "#dc2626" :
            "#22c55e"
        );

        marker.setAttribute("stroke", "#ffffff");
        marker.setAttribute("stroke-width", "3");

        mapNodesGroup.appendChild(marker);

    });

}


// ==========================================
// 8. INITIALIZE APPLICATION
// ==========================================

async function initializeApp() {

    await loadLocations();

    if (Object.keys(locations).length > 0) {

        await loadGraph();

    }

}


// Start application
initializeApp();
