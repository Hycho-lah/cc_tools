//Preload and store the values of the Icon Values sheet
//This will prevent the code from reloading the data over and over as we use it
var ICON_KEY_RANGE = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Icon Values").getDataRange();
var ICON_FORMULA_DATA = ICON_KEY_RANGE.getFormulas();
var ICON_VALUE_DATA = ICON_KEY_RANGE.getValues();

function lookupValue(toFind, lookupColumn) {
    /* Looks up a icon value in the "Icon Values" worksheet and returns
       the item in the same row but in the column specified by lookupColumn

       toFind (String): the formula string of an icon
       lookupColumn (int): index of the column to return the value of
    */
    var ICON_INDEX = 2; // This corresponds to column B with the Value of icons in the "Icon Values" sheet
    for (var i = 0; i < ICON_FORMULA_DATA.length; i++){
        if (ICON_FORMULA_DATA[i][ICON_INDEX] ==toFind){
            var returnVal = ICON_VALUE_DATA[i][lookupColumn]; //the lookupColumn corresponds to the int 1 for int value.
            return returnVal;
        }
    }
    return null;
}

function getIntValueForIcon(iconString) {
    /* Returns the integer value for a given icon string
       Note: This should use lookupValue
       iconString (String): icon to look up
    */
    var iconInt = lookupValue(iconString,1);
    return iconInt;
}

function isIconMonster(iconString) {
    /* Return true if the icon is a monster
       Note: This should call lookupValue
       iconString (String): icon to look up
    */
    var isMonster = lookupValue(iconString, 4); //looks at Monster column and returns true or false
    return isMonster;
}

function isIconComputerChip(iconString) {
    /* Return true if the icon is a Computer Chip
       Note: This doesn't need to call lookupValue since there is only one Computer Chip value
       iconString (String): icon to look up
    */
    return iconString == '=IMAGE("http://vignette2.wikia.nocookie.net/chipschallenge/images/6/6f/Chip.png")';
}

function getWorksheetNamed(worksheetName) {
    /* Convenience function that returns the worksheet with the given name
       worksheetName (String): name of worksheet to return
    */
    var ss = SpreadhseetApp.getActiveSpreadsheet();
    return ss.getSheetByName(worksheetName);
}

function getMonsterJSONData(mapData) {
    /* Iterates through the mapData and returns a string with all the monster data formatted as a proper JSON list.
       Returns null if no monsters are found
       Note:
       This function must search for monsters in the map data and add the coordinates of each one to the JSON string
       This is just the array part of the JSON data and the return value would look something like this: "[[1,1], [2,3]]"
       mapData (string[][]): two-dimensional array of map formula data from the range representing the map on the sheet
    */
    var monsterString = "[";
    var monsterCount = 0;
    for (var row = 0; row<mapData.length; row++){                        ;
        for (var column = 0; column<mapData[row].length; column++){
            var iconVal = mapData[row][column];
            if(isIconMonster(iconVal)){
                monsterString += "[" + column + "," + row + "],";
                monsterCount += 1;
            }
        }
    }
    monsterString = monsterString.substring(0, monsterString.length - 1);//removes last comma
    monsterString += "]";

    if(monsterCount ==0){
        return null;
    }
    else {
        return monsterString;
    }
}

function getMapJSONData(mapData) {
    /* Returns a string with the map data formatted as a proper JSON list
       Note: Return value would look something like this: "[0,0,0,0,64,0]"
       mapData (string[][]): two-dimensional array of map formula data from the range representing the map on the sheet
    */
    var mapJSON = "[";
    var tileCount = 0;
    for (var row = 0; row<mapData.length; row++){                        ;
        for (var column = 0; column<mapData[row].length; column++){
            var iconVal = mapData[row][column];
            mapJSON += getIntValueForIcon(iconVal).toString();
            tileCount += 1;
            if (tileCount != 1024){
                mapJSON += ",";
            }
        }
    }
    mapJSON += "]";
    return mapJSON;
}

function getComputerChipCount(mapData) {
    /* Iterates through the mapData and returns a count of all the computer chips in the map.
       Note:
       This function must search for computer chips in the map data
       mapData (string[][]): two-dimensional array of map formula data from the range representing the map on the sheet
    */
    var chipCount = 0;
    for (var row = 0; row<mapData.length; row++){                        ;
        for (var column = 0; column<mapData[row].length; column++){
            var iconVal = mapData[row][column];
            if(isIconComputerChip(iconVal)){
                chipCount += 1;
            }
        }
    }
    return chipCount;
}

function getMapTitle(sheet) {
    /* Returns the title of the map defined by the given sheet
       Note: This can either look up a specific cell value on the sheet or use the name of the sheet

       sheet (Sheet): Sheet defining the map
    */
    var title = sheet.getRange("H35").getValue();
    return title;
}

function getTime(sheet) {
    /* Returns the time value of the map defined by the given sheet
       Note: This should look up a specific cell value on the sheet

       sheet (Sheet): Sheet defining the map
    */
    var timeRange = sheet.getRange("H36");
    var timeValue = timeRange.getValues();
    var timeString = timeValue.toString();
    return timeString;
}

function getMapHint(sheet) {
    /* Returns the hint value of the map defined by the given sheet
       Note: This should look up a specific cell value on the sheet

       sheet (Sheet): Sheet defining the map
    */
    var mapHint = sheet.getRange("H38").getValue();
    return mapHint;
}

function getMapPassword(sheet) {
    /* Returns the password value, encoded as a string, of the map defined by the given sheet
       Note: This should look up specific cell values on the sheet. The values should be stored ints in the sheet.
       An example return value is "[220, 220, 220, 220]"

       sheet (Sheet): Sheet defining the map
    */
    var passwordData = [];//array for passing in values of password from sheet

    var passwordRange = sheet.getRange("H37");
    var passwordValue = passwordRange.getValues();
    passwordData.push(passwordValue);

    passwordRange = sheet.getRange("J37");
    passwordValue = passwordRange.getValues();
    passwordData.push(passwordValue);

    passwordRange = sheet.getRange("L37");
    passwordValue = passwordRange.getValues();
    passwordData.push(passwordValue);

    passwordRange = sheet.getRange("N37");
    passwordValue = passwordRange.getValues();
    passwordData.push(passwordValue);//now an array containing all the password values is generated.

    var passwordString = passwordData.toString();//converts passwordData array to some string like 220, 220, 220, 220
    var password = "[" + passwordString + "]"

    return password;//returns a string like [220, 220, 220, 220]
}


function getJSONLevelToSave(sheet, levelNumber) {
    /* Returns a valid JSON string representing the map defined by the sheet and levelNumber
       Note: This return just a single level, so it's JSON value would look something like this:
       '{"level_number":1, "time":100, "chip_num":2, ...}'
       This string must match your JSON file format
       Be careful when putting quotation marks in strings:
         Use one style '' outside the string and the other style "" inside the string

       sheet (Sheet): Sheet defining the map
       levelNumber (int): Index of the level
    */
    var mapRange = sheet.getRange("A1:AF32");
    var mapData = mapRange.getFormulas();
    var jsonString = '{\n'; //beginning of new level

    jsonString += '"level_number": ' + levelNumber + ',\n';
    jsonString += '"time": ' + getTime(sheet) + ',\n';
    jsonString += '"num_chips": ' + getComputerChipCount(mapData) + ',\n';
    jsonString += '"upper_layer":\n' + getMapJSONData(mapData) + ',\n';

    jsonString += '"lower_layer":\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\n'

    jsonString += '"optional_fields":[ ';//beginning of optional fields array
    jsonString += ' {"type":3, "title":"'+ getMapTitle(sheet) + '" },';
    jsonString += ' {"type":6, "password":' + getMapPassword(sheet) + ' },'; //getMapPassword(sheet) should return something like [220,220,220,220]
    jsonString += ' {"type":7, "hint":"' + getMapHint(sheet) + '" }';

    monsterJSON = getMonsterJSONData(mapData);
    if (monsterJSON != null){
        jsonString += ', {"type":10, "monsters":' + monsterJSON + ' }';//monsterJSON variable is the monster coordinates array ex. [[5, 1],[6,5]]
    }

    jsonString += ' ]\n';//ending of optional fields array
    jsonString += '}';//ending of the level dictionary

    return jsonString;
}

function isLevelWorksheet(sheet) {
    /* Convenience function that returns true if the given sheet
       is not the Template sheet or the Icon Values sheet
       sheet (Sheet): Sheet to check
    */
    return (sheet.getName() != "Template" && sheet.getName() != "Icon Values");
}

function getAllLevelsJSON(){
    /* Returns a valid JSON string representing a level pack containing all the levels in the active spreadsheet.
       Note: This string must match your JSON file format
    */
    var ss = SpreadsheetApp.getActiveSpreadsheet(); //Returns the currently active spreadsheet, or null if there is none.
    var sheets = ss.getSheets(); //gets an array representing all of the sheets in active spreadsheet.

    var jsonString = "[\n";
    var levelCount = 1;//levelCount corresponds to the level number.
    for (var i = 0; i<sheets.length;i++){
        if (isLevelWorksheet(sheets[i])){
            jsonString += getJSONLevelToSave(sheets[i],levelCount);
            jsonString += ",\n";
            levelCount +=1;
        }
    }
    jsonString = jsonString.substring(0, jsonString.length - 2);//removes last comma
    jsonString += "\n]";
    return jsonString;
}

function saveAllLevels() {
    /* Saves all the valid Chip's Challenge levels in the active spreadsheet to a file
    */
    var jsonString = getAllLevelsJSON();
    //logger.log(jsonString);
    DriveApp.createFile("eye_testData.json", jsonString, MimeType.PLAIN_TEXT);
}


function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("Chip's Challenge")
        .addItem("Save all levels", "saveAllLevels")
        .addToUi();
}