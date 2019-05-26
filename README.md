### daud.io HOOK SETTINGS CHANGER

# Requirements
* Python 3.6 (or Higher)
* Requests (pip install requests)
* Flask (pip install Flask)

# About
This simple applications is created to help easily make changes to daud.io hook settings and see the results of your changes. 

# How to use?
1. Click the `Clone or download` > `Download Zip`, once downloaded extract the zip file to any location you prefer.
2. On a windows pc open a directory and navigate to `C:\Users\<your user account>`, and create a new folder called `Daud`. Inside the `Daud` folder create a JSON file called `Server_Config.json`. (Alternatively you can create the JSON folder in any location you prefer, and there after change Line 9 and 10 on `Daud.py` respectively to point to this new location for the JSON field).
3. Request on discord to myself or other devs to obtain details to apply to the `Server_Config.json` file.
4. Launch `app.py`, and once the server starts navigate to the url defined on the command prompt or to `localhost:5000` to access the website to grant you access to change daud.io hook settings.
5. View and modify the existing hook settings 
6. Use the `Submit Hook Changes` option to submit your changes to the live daud.io server.
7. If happy with your changes, then use the `Download Hook Changes` option to download a json file including all your hook changes.

# Notes
This is v1.0, which is currently configured to allow modifying of the `Default` world in the `Daud eu` server.