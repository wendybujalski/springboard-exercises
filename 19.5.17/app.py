from flask import Flask, request, render_template, redirect, jsonify, session, flash
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "trans rights"
debug = DebugToolbarExtension(app)
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

boggle_game = Boggle
SESSION_KEY_BOARD = "board"
SESSION_KEY_BOARD_SIZE = "size"
SESSION_KEY_DICE_SET = "dice"
SESSION_KEY_STATISTICS = "stats"

@app.route('/')
def index():
    """Displays either the game currently running or the intro screen if a game has not been started yet."""

    board = session.get(SESSION_KEY_BOARD)
    stats = session.get(SESSION_KEY_STATISTICS, {"plays": 0, "high_score": 0, "games": []})
    session[SESSION_KEY_STATISTICS] = stats

    #print(board)
    #print(stats)

    if(board and boggle_game != Boggle):
        #print("LET'S PLAY")
        return render_template("boggle.html", boggle_game=boggle_game, board=board)
    else:
        #print("GO TO TITLE!")
        return render_template("intro.html", boggle_game=boggle_game, plays=stats["plays"], high_score=stats["high_score"])

@app.route('/start-game', methods=["POST"])
def start_game():
    """Sets up a new game and then redirects back to index() to play it."""

    global boggle_game

    size = session[SESSION_KEY_BOARD_SIZE] = int(request.form["size"])
    dice = session[SESSION_KEY_DICE_SET] = request.form["dice"]

    boggle_game = Boggle(size, dice)

    session[SESSION_KEY_BOARD] = boggle_game.make_board()

    return redirect("/")

@app.route('/submit_guess')
def submit_guess():
    """Receives a guess from the game currently in progress and responds with the result of that guess."""

    global boggle_game

    # If this route was visited without a guess, go back to the index
    guess = request.args.get("guess")
    if(guess == None):
        return redirect("/")

    board = session.get(SESSION_KEY_BOARD)

    result = boggle_game.check_valid_word(board, guess)

    return jsonify({"result": result})

@app.route('/game-over', methods=["POST"])
def game_over():
    """Receives the data at the end of a game about that game and sends back a boolean about whether or not a high score was achieved."""

    global boggle_game

    data = request.get_json()
    stats = session.get(SESSION_KEY_STATISTICS, {"plays": 0, "high_score": 0, "games": []})

    stats["plays"] += 1
    stats["games"].append(data)

    #print(stats)
    #print(data)

    hs = False
    if stats["high_score"] < data["score"]:
        #print("HIGH SCORE!")
        stats["high_score"] = data["score"]
        hs = True
    #else:
        #print("NO HIGH SCORE!");

    session[SESSION_KEY_STATISTICS] = stats

    return jsonify({"highscore": hs})

@app.route('/new-game')
def new_game():
    """Clears out the current game and redirects back to the index to see the intro page."""

    global boggle_game

    boggle_game = Boggle
    session[SESSION_KEY_BOARD] = None
    session[SESSION_KEY_DICE_SET] = None
    session[SESSION_KEY_BOARD_SIZE] = None

    # print("NEW GAME")

    return redirect("/")
