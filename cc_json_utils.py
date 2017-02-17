import cc_data

import sys
import json

def make_optional_fields_from_json(json_optional_fields): #take array of optional fields from json file and returns cc_fields
    cc_fields = []
    for json_field in json_optional_fields: # for each item in array json_optional_fields array...
        field_type = json_field["type"] # determine field type
        if field_type == cc_data.CCMapTitleField.TYPE: #Type 3
            cc_field = cc_data.CCMapTitleField(json_field["title"])#CCMapTitleField requires input of a string
            cc_fields.append(cc_field)
        elif field_type == cc_data.CCTrapControlsField.TYPE: #Type 4 - CCTrapControls field requires input of list of traps
            cc_traps =[] #create list of traps
            for json_trap in json_field["traps"]: #each trap in json_field["traps"] array has x,y coordinates for a button and corresponding trap
                bx = json_trap["button"][0]
                by = json_trap["button"][1]
                tx = json_trap["trap"][0]
                ty = json_trap["trap"][1]
                cc_traps.append(cc_data.CCTrapControl(bx,by,tx,ty)) # CCTrapControl requires input of four integers
            cc_field = cc_data.CCTrapControlsField(cc_traps) #add list of traps to CCTrapControlsField
            cc_fields.append(cc_field)
        elif field_type == cc_data.CCCloningMachineControlsField.TYPE: #Type 5
            cc_machines = [] #A cloning machine control field is defined by a list of machines
            for json_machine in json_field["machines"]: #single cloning machine control has member vars button coord and machine coord
                bx= json_machine["button"][0]
                by = json_machine["button"][1]
                tx = json_machine["machine"][0]
                ty = json_machine["machine"][1]
                cc_machines.append(cc_data.CCCloningMachineControl(bx,by,tx,ty))#similar to Trap field...
            cc_field = cc_data.CCCloningMachineControlsField(cc_machines)
            cc_fields.append(cc_field)
        elif field_type == cc_data.CCEncodedPasswordField.TYPE: #Type 6 - similar to title
            cc_field = cc_data.CCEncodedPasswordField(json_field["password"])#CCEncodedPasswordField requires list of 4-9 integers
            cc_fields.append(cc_field)
        elif field_type == cc_data.CCMapHintField.TYPE: #Type 7 - CCMapHintField requires string input
            cc_field = cc_data.CCMapHintField(json_field["hint"])
            cc_fields.append(cc_field)
        elif field_type == cc_data.CCMonsterMovementField.TYPE: #Type 10 - CCMonsterMovementField requires a list of monsters coordinates
            cc_monsters = []#list of monster coordinates
            for json_monster in json_field["monsters"]:# The monsters list consist of x,y coordinates for each monster
                x = json_monster[0]
                y = json_monster[1]
                cc_monsters.append(cc_data.CCCoordinate(x,y))#CCCordinate requires int input x and y
            cc_field = cc_data.CCMonsterMovementField(cc_monsters)
            cc_fields.append(cc_field)
    return cc_fields

def make_cc_level_from_json(json_data): # makes cc level using json data - includes initialized variables and optional fields
    cc_level = cc_data.CCLevel()  # Create a CCLevel Class from cc_data.py
    cc_level.level_number = json_data["level_number"]
    cc_level.time = json_data["time"]
    cc_level.num_chips = json_data["num_chips"]
    cc_level.upper_layer = json_data["upper_layer"]
    cc_level.lower_layer = json_data["lower_layer"]
    cc_level.optional_fields = make_optional_fields_from_json(json_data["optional_fields"])# make_optional_fields_from_json takes the json_data "optional_fields" and returns list of cc_fields
    return cc_level

def make_cc_data_from_json(json_file):
    cc_data_file = cc_data.CCDataFile() #class defining the data of dat file with a list of CCLevel
    with open(json_file,'r') as reader:
        json_data = json.load(reader)
        for json_level in json_data:#loops through each level in json data
            cc_level = make_cc_level_from_json(json_level)
            cc_data_file.add_level(cc_level) # append a CCLevel to the cc_data_file
    return cc_data_file
