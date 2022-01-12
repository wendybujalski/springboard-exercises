from surveys import surveys
from flask import Flask, request, render_template, redirect, flash, session
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "trans rights"
debug = DebugToolbarExtension(app)
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

CURRENT_SURVEY_KEY = 'current'
RESPONSE_KEY = "responses"

@app.route('/')
def index():
    return render_template("root.html", surveys=surveys)

@app.route('/', methods=["POST"])
def survey_title():
    current_survey_id = request.form["survey_id"]
    current_survey = surveys[current_survey_id]
    session[CURRENT_SURVEY_KEY] = current_survey_id

    return render_template("title.html", survey=current_survey)

@app.route('/start', methods=["POST"])
def start_survey():
    session[RESPONSE_KEY] = []
    return redirect("/questions/1")

@app.route("/questions/<int:id>")
def question(id):
    responses = session.get(RESPONSE_KEY)
    question_index = id - 1
    current_survey_id = session[CURRENT_SURVEY_KEY]
    current_survey = surveys[current_survey_id]

    if responses == None:
        return redirect("/")
    elif len(responses) == len(current_survey.questions):
        return redirect("/done")
    elif question_index != len(responses):
        flash(f"Wrong question number: {id}")
        return redirect(f"/questions/{len(responses)}")
    else:
        question = current_survey.questions[question_index]
        return render_template("question.html", number=id, question=question, amount=len(current_survey.questions))

@app.route("/answer", methods=["POST"])
def record_answer():
    answer = request.form['answer']
    responses = session.get(RESPONSE_KEY)
    responses.append(answer)
    session[RESPONSE_KEY] = responses
    question_index = len(responses) + 1
    current_survey_id = session[CURRENT_SURVEY_KEY]
    current_survey = surveys[current_survey_id]

    if len(responses) == len(current_survey.questions):
        return redirect("/done")
    else:
        return redirect(f"/questions/{question_index}")

@app.route("/done")
def survey_done():
    current_survey_id = session[CURRENT_SURVEY_KEY]
    current_survey = surveys[current_survey_id]
    responses = session.get(RESPONSE_KEY)
    
    return render_template("complete.html", survey=current_survey, responses=responses)
