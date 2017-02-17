from cc_json_utils import make_cc_data_from_json #Import functions from other files
from cc_dat_utils import write_cc_data_to_dat

cc_dat = make_cc_data_from_json("data/eye_cc1.json") #input name of json file
write_cc_data_to_dat(cc_dat, "eye_cc1.dat") #create dat file from json file
