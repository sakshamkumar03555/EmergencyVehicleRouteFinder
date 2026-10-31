
from data.locations import LOCATIONS, GRAPH
from algorithms.dijkstra import dijkstra

# Select starting and ending locations
start = "A"
end = "J"

# Calculate shortest route
result = dijkstra(GRAPH, start, end)

print("===================================")
print("   EMERGENCY VEHICLE ROUTE FINDER")
print("===================================")

print("\nStarting Location:", LOCATIONS[start]["name"])
print("Destination:", LOCATIONS[end]["name"])

if result:

    print("\nShortest Route:")

    for location in result["path"]:
        print(LOCATIONS[location]["name"], end="")

        if location != result["path"][-1]:
            print(" -> ", end="")

    print("\n\nTotal Distance:", result["distance"], "KM")

else:
    print("\nNo route available!")
