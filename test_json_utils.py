import test_data

import sys
import json
import test_data

#Creates and returns a GameLibrary object(defined in test_data) from loaded json_data
def make_game_library_from_json(json_data):
    games = json_data["games"]

    #Initialize a new GameLibrary
    game_library = test_data.GameLibrary()

    #Loop through the json_data
    for games in json_data:
        #Get data from current game in games list
        platform = games["platform"]
        name = platform["name"]
        launch_year = platform["launch_year"]
        platform = test_data.Platform(name, launch_year)
        title = games["title"]
        year = games["year"]
        #Create a new Game object from the json_data by reading
        new_game = test_data.Game(platform,title,year)

        #  title
        #  year
        #  platform (which requires reading name and launch_year)
        #Add that Game object to the game_library
        game_library.add_game(new_game)
    #Return the completed game_library

    return game_library

# Handling command line arguments
#  Note: sys.argv is a list of strings that contains each command line argument
#        The first element in the list is always the name of the python file being run
# Command line format: <input json filename>

default_input_json_file = "data/test_data.json"

if len(sys.argv) == 2:
    input_json_file = sys.argv[1]
    print("Using command line args:", input_json_file)
else:
    print("Unknown command line options. Using default values:", default_input_json_file)
    input_json_file = default_input_json_file

with open(input_json_file) as reader:
    json_data = json.load(reader)
    print(json_data)

game_library_data = make_game_library_from_json(json_data)
test_data.print_game_library(game_library_data)

#Load the json data from the input file
#Use make_game_library_from_json(json_data) to convert the data to GameLibrary data
#Print out the resulting GameLibrary data using print_game_library(game_library_data) in test_data.py
