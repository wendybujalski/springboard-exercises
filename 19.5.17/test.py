from unittest import TestCase
from app import app, SESSION_KEY_BOARD, SESSION_KEY_BOARD_SIZE, SESSION_KEY_DICE_SET, SESSION_KEY_STATISTICS
from flask import session
from boggle import Boggle

class FlaskTests(TestCase):
    """The tests for this application/"""


    # Testing data for use in the tests below.
    TEST_GAME_DATA = dict(score=10, num_words=3, words=["dog", "cat", "boat"]) # Sample data for one game.
    TEST_STATISTICS_DATA = dict(plays=1, high_score=10, games=[TEST_GAME_DATA]) # Sample data for the statistics after one game.

    def setUp(self):
        """Code to run before each test."""
        
        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

    def test_index(self):
        """Test to confirm that the index displays properly."""

        with self.client:
            res = self.client.get("/")

            self.assertEqual(res.status_code, 200) # make sure it responds with an ok status code
            self.assertIn(SESSION_KEY_STATISTICS, session) # test that the stats are logged in the session
            self.assertIn(b'<h1>BOGGLE</h1>', res.data) # it should have the Boggle title
            self.assertIn(b'<button>Click Here To Play!</button>', res.data) # it should have the button to play
    
    def test_start_game(self):
        """Test starting a new game."""

        with self.client as client:
            res = client.post("/start-game", data={"size": 4, "dice": "Classic Dice Set"})

            self.assertEqual(res.status_code, 302) # make sure it responds with a redirect status code
            self.assertIn(SESSION_KEY_BOARD_SIZE, session) # test that the size of the board has been added to the session
            self.assertIn(SESSION_KEY_DICE_SET, session) # test that the dice set has been added to the session
            self.assertIn(SESSION_KEY_BOARD, session) # test that the board has been added to the session


    def test_submit_guess(self):
        """Test to check if the word submission and checker are working properly."""

        with self.client as client:
            with client.session_transaction() as session:
                session[SESSION_KEY_BOARD] = [  ["C", "O", "O", "L"],
                                                ["Q", "N", "E", "T"],
                                                ["N", "I", "T", "N"],
                                                ["Q", "L", "O", "R"] ]
        
            res = self.client.get("/submit_guess?guess=cool") # checking a simple word
            self.assertEqual(res.json['result'], 'ok')
            res = self.client.get("/submit_guess?guess=quiet") # checking a word with a Q in it
            self.assertEqual(res.json['result'], 'ok')
            res = self.client.get("/submit_guess?guess=control") # checking a longer word
            self.assertEqual(res.json['result'], 'ok')
            res = self.client.get("/submit_guess?guess=paper") # checking a word which is not on the board
            self.assertEqual(res.json['result'], 'not-on-board')
            res = self.client.get("/submit_guess?guess=cntr") # checking an invalid word
            self.assertEqual(res.json['result'], 'not-word')
    
    def test_game_over(self):
        """Test to check if the game over function is logging the statistics accurately."""
        
        with self.client as client:
            res = client.post("/game-over", json=FlaskTests.TEST_GAME_DATA)

            self.assertEqual(res.status_code, 200) # make sure it responds with an ok status code
            self.assertIn(SESSION_KEY_STATISTICS, session) # test that the stats are logged in the session
            self.assertEqual(session[SESSION_KEY_STATISTICS]["high_score"], 10) # check that it logged the high score
            self.assertEqual(len(session[SESSION_KEY_STATISTICS]["games"]), 1) # check to make sure it has one game logged
            self.assertEqual(session[SESSION_KEY_STATISTICS]["games"][0]["words"][0], "dog") # check to make sure the words logged correctly for this game

            data = res.get_data()
            self.assertEqual(data, b'{\n  "highscore": true\n}\n') # check to make sure the JSON response is as expected
    
    def test_new_game(self):
        """Test to make sure that the "new-game" route is responding properly."""
        with self.client as client:
            with client.session_transaction() as session:
                session[SESSION_KEY_STATISTICS] = FlaskTests.TEST_STATISTICS_DATA
            res = client.get("/new-game")

            self.assertEqual(res.status_code, 302) # make sure it responds with a redirect status code
            self.assertIn(SESSION_KEY_STATISTICS, session) # test that the stats are logged in the session
            self.assertEqual(session[SESSION_KEY_STATISTICS]["plays"], 1) # test that the number of plays is correct

    def test_end_to_end(self):
        """Test the whole app end to end."""
        with self.client as client:
            responses = []
            for i in range(3): # run through the whole thing three times
                responses.append(self.client.get("/")) # get the intro
                responses.append(client.post("/start-game", data={"size": 4, "dice": "Classic Dice Set"})) # start a game
                responses.append(self.client.get("/")) # load the game in progress
                responses.append(client.post("/game-over", json=FlaskTests.TEST_GAME_DATA)) # end the game
                responses.append(client.get("/new-game")) # start a new game
            
            self.assertIn(b'div id="game"', responses[2].data) # Check to see if the game loaded properly the first time
            self.assertEqual(session[SESSION_KEY_STATISTICS]["plays"], 3) # check to make sure the number of plays is 3
            self.assertEqual(len(session[SESSION_KEY_STATISTICS]["games"]), 3) # check to make sure it has 3 games logged
            self.assertEqual(session[SESSION_KEY_BOARD], None) # check to make sure the board data has been cleared out from session
