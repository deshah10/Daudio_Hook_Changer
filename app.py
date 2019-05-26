import json, sys
from flask import Flask, render_template, request, redirect, url_for, jsonify
from Daud import Daudio


app = Flask(__name__)
app.secret_key = 'D@udL1n'

daud = Daudio()
daud.setServer("daudio_eu")


def getHookChanges(original_hook, changed_hook):
    changes = {}
    for k, v in original_hook.items():
        if not k in changed_hook:
            continue

        if str(v) != str(changed_hook[k]):
            changes[k] = f"{changed_hook[k]} ({type(changed_hook[k])}) != {v} ({type(v)})"

    return changes


@app.route('/')
def index():
    hook = daud.getCurrentHook()
    # print("Hook = ", type(hook), file=sys.stdout)
    return render_template('index.html', hook=json.dumps(hook))



@app.route('/update_hook', methods=['POST'])
def update_hook():
    try:
        changedHook = request.get_json()
        response = daud.updateServerHook(changedHook)
        return jsonify({"response" : response})
    
    except Exception as e:
        print("AJAX excepted " + str(e))
        return jsonify({"response": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
