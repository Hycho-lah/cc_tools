import test_data

import sys
import json

#Creates and returns a GameLibrary object(defined in test_data) from loaded json_data
def make_game_library_from_json(json_data):

    #Initialize a new GameLibrary
    game_library = test_data.GameLibrary()

    #Loop through the json_data
    for json_game in json_data:
        platform = json_game["platform"]
        name = platform["name"]
        launch_year = platform["launch_year"]
        platform = test_data.Platform(name, launch_year)

        title = json_game["title"]
        year = json_game["year"]

        #Create a new Game object from the json_data by reading
        game = test_data.Game(title,platform,year)
        game_library.add_game(game)
        #  title
        #  year
        #  platform (which requires reading name and launch_year)
        #Add that Game object to the game_library
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

with open(input_json_file,'r') as reader:
    json_data = json.load(reader)

game_library = make_game_library_from_json(json_data)
test_data.print_game_library(game_library)

#Load the json data from the input file
#Use make_game_library_from_json(json_data) to convert the data to GameLibrary data
#Print out the resulting GameLibrary data using print_game_library(game_library_data) in test_data.py
