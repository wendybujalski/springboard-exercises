from flask import Flask, render_template, request
from flask_debugtoolbar import DebugToolbarExtension
from stories import all_stories

app = Flask(__name__)
app.config["SECRET_KEY"] = "mad libs"
debug = DebugToolbarExtension(app)

@app.route('/')
def index():
    return render_template("selection.html", stories = all_stories)

@app.route('/write')
def fill_in():
    template_slug = request.args.get("template")

    return render_template("form.html", story=all_stories[template_slug])

@app.route('/story')
def generate_story():
    template_slug = request.args.get("slug")
    story = all_stories[template_slug]
    output = story.generate(request.args)

    return render_template("story.html", story=story, output=output)