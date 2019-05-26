import requests
import json
import re
import os


class Daudio():
    """ CLASS OPTIONS TO UPDATE DAUD.io HOOK SETTINGS """
    HOME_DIR = os.path.expanduser("~")
    SERVER_CONFIG_LOC = os.path.join(HOME_DIR, "Daud", "Server_Config.json")

    # print(SERVER_CONFIG_LOC)
    with open(SERVER_CONFIG_LOC, "r") as ds:
        data = ds.read()
        serverOptions = json.loads(data)


    def __init__(self, server="daudio_eu"):
        self.setServer(server)
        self.setWorld("default")


    @property
    def headers(self):
        return {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:27.3) Gecko/20130101 Firefox/27.3',
            'Content-Type': 'application/json',
            'charset': 'utf-8',
            "Authorization": self.token
        }


    def setWorld(self, world):
        self.world = world


    def getHookSettings(self):
        hook = {}
        if os.path.isfile('hook.json'):
            with open('hook.json', "r") as f:
                hook = json.loads(f.read())

        return hook


    def saveHook(self, hook):
        strHook = json.dumps(hook, indent=4)
        with open("savedHook.json", "w") as f:
            f.write(strHook)


    def setServer(self, server):
        if not server in Daudio.serverOptions:
            print(f"Defined Server '{server}' not found\n")
            self.printServerOptions()

        self.server = Daudio.serverOptions[server]
        self.baseUrl = self.server['baseUrl']
        self.token = self.getToken()


    def printServerOptions(self):
        print("\nAVAILABLE SERVER OPTIONS:\n");
        count = 1
        for i in self.serverOptions:
            print(f"{count}) {i}")
            count += 1


    def getToken(self):
        endPoint = self.baseUrl + "user/authenticate"
        headers = {'Content-Type': 'application/json'}
        data = {"Identifier": self.server["Identifier"],
                "password": self.server["password"]}

        token = ""

        r = requests.post(endPoint, headers=headers, data=str(data))
        response = json.loads(r.text)
        if type(response) == dict and 'response' in response:
            actual_response = response['response']
            token = actual_response['token']

        return "Bearer " + token


    def getCurrentHook(self, jsonified=False):
        self.currentHook = self.updateServerHook()
        if jsonified:
            return json.dumps(self.currentHook)
        return self.currentHook


    def updateServerHook(self, manualHook={}, saveHook=False):
        if manualHook:
            print("manualHook Triggered")

            hook = manualHook
        else:
            hook = self.getHookSettings()

        endpoint = f"{self.baseUrl}world/hook?worldName={self.world}"

        r = requests.post(endpoint, json=hook, headers=self.headers)

        returnedHook = json.loads(r.text)

        if returnedHook:
            returnedHook = returnedHook['response']
        else:
            returnedHook = {
                "error": "Response did not return a hook",
                "response": r.text,
                "response_status": r.status_code
            }

        if saveHook:
            self.saveHook(returnedHook)

        return returnedHook


    def __repr__(self):
        return self.server['baseUrl'].replace('api/v1/', '')


if __name__ == "__main__":
    daud = Daudio()
    # daud.setServer("daudio_us")
    daud.setServer("daudio_eu")
    hook = daud.getCurrentHook()

    for k, v in hook.items():
        print(f"{k} ({type(v)}) = {v}")
