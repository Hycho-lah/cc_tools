import sys
import json

from cc_json_utils import make_cc_data_from_json #Import functions from other files
from cc_dat_utils import write_cc_data_to_dat

input_json_file = "eye_testData4.json"

cc_dat = make_cc_data_from_json(input_json_file) #input name of json file
write_cc_data_to_dat(cc_dat, "eye_testData4.dat")  # create dat file from json file



