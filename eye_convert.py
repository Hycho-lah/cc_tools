import sys
import json

from cc_json_utils import make_cc_data_from_json #Import functions from other files
from cc_dat_utils import write_cc_data_to_dat

default_input_json_file = "data/eye_cc1.json"
default_output_dat_file = "data/eye_cc1.dat"

if len(sys.argv) == 3:
    input_json_file = sys.argv[1]
    output_dat_file = sys.argv[2]
    print("Using command line args:", input_json_file, output_dat_file)
else:
    print("Unknown command line options. Using default values:", default_input_json_file, default_output_dat_file)
    input_json_file = default_input_json_file
    output_dat_file = default_output_dat_file

cc_dat = make_cc_data_from_json(input_json_file) #input name of json file
write_cc_data_to_dat(cc_dat, output_dat_file)  # create dat file from json file



