"""Utilities related to Boggle game."""

from random import choice, shuffle
import string

# This class is for emulating a six-sided die with letters on the sides
# This is used for generating Boggle boards which are accurate to the real game
class LetterDie():
    def __init__(self, letters):
        """letters is a tuple containing the six letters on the die"""
        self.letters = letters
    
    def roll(self):
        """roll the die and return the result"""
        return choice(self.letters)

    @classmethod
    def generateDice(cls, allLetters):
        """generate and return a list of LetterDie objects in a random order based on a given tuple of letter tuples"""
        dice = []

        for letters in allLetters:
            dice.append(LetterDie(letters))
        
        shuffle(dice)

        return dice

class Boggle():    
    # Boggle Dice Information Collected from http://www.bananagrammer.com/2013/10/the-boggle-cube-redesign-and-its-effect.html

    CLASSIC_BOGGLE_DICE_LETTERS = (
        ("A", "A", "C", "I", "O", "T"),	
        ("A", "B", "I", "L", "T", "Y"),	
        ("A", "B", "J", "M", "O", "Q"),	# Q becomes Qu in the display and in scoring
        ("A", "C", "D", "E", "M", "P"),	
        ("A", "C", "E", "L", "R", "S"),	
        ("A", "D", "E", "N", "V", "Z"),	
        ("A", "H", "M", "O", "R", "S"),	
        ("B", "I", "F", "O", "R", "X"),	
        ("D", "E", "N", "O", "S", "W"),	
        ("D", "K", "N", "O", "T", "U"),	
        ("E", "E", "F", "H", "I", "Y"),	
        ("E", "G", "K", "L", "U", "Y"),	
        ("E", "G", "I", "N", "T", "V"),	
        ("E", "H", "I", "N", "P", "S"),	
        ("E", "L", "P", "S", "T", "U"),
        ("G", "I", "L", "R", "U", "W"),	
    )

    NEW_BOGGLE_DICE_LETTERS = (
        ("A", "A", "E", "E", "G", "N"),
        ("A", "B", "B", "J", "O", "O"),
        ("A", "C", "H", "O", "P", "S"),
        ("A", "F", "F", "K", "P", "S"),
        ("A", "O", "O", "T", "T", "W"),
        ("C", "I", "M", "O", "T", "U"),
        ("D", "E", "I", "L", "R", "X"),
        ("D", "E", "L", "R", "V", "Y"),
        ("D", "I", "S", "T", "T", "Y"),
        ("E", "E", "G", "H", "N", "W"),
        ("E", "E", "I", "N", "S", "U"),
        ("E", "H", "R", "T", "V", "W"),
        ("E", "I", "O", "S", "S", "T"),
        ("E", "L", "R", "T", "T", "Y"),
        ("H", "I", "M", "N", "U", "Q"), # Q becomes Qu in the display and in scoring
        ("H", "L", "N", "N", "R", "Z"),
    )

    RANDOM_DICE_LETTERS = ( list(string.ascii_uppercase), )

    DICE_MODES = {
        "Classic Dice Set": CLASSIC_BOGGLE_DICE_LETTERS,
        "New Dice Set": NEW_BOGGLE_DICE_LETTERS,
        "Fully Random Letters": RANDOM_DICE_LETTERS,
    }

    def __init__(self, board_size = 4, mode="Classic Dice"):
        """
        mode is for setting which dice set to use
        board_size is for setting the size of the board - minimum 4, maximum 10
        """

        self.words = self.read_dict("words.txt")
        self.dice = LetterDie.generateDice(Boggle.DICE_MODES.get(mode))
        self.board_size = board_size

    def read_dict(self, dict_path):
        """Read and return all words in dictionary."""

        dict_file = open(dict_path)
        words = [w.strip() for w in dict_file]
        dict_file.close()
        return words

    def make_board(self):
        """Make and return a random boggle board."""

        board = []
    
        # Old board generation code which just picks random letters
        # for y in range(5):
        #     row = [choice(string.ascii_uppercase) for i in range(5)]
        #     board.append(row)

        # New board generation code which rolls dice just like the original Boggle!
        i = 0
        for y in range(self.board_size):
            row = []
            for x in range(self.board_size):
                if not (i < len(self.dice)): # if there are no dice left, shuffle the dice and start over
                    i = 0
                    shuffle(self.dice)
                roll = self.dice[i].roll()
                i += 1
                row.append(roll)
            board.append(row)

        return board

    def check_valid_word(self, board, word):
        """Check if a word is a valid word in the dictionary and/or the boggle board"""

        word_exists = word in self.words
        valid_word = self.find(board, word.upper())

        if word_exists and valid_word:
            result = "ok"
        elif word_exists and not valid_word:
            result = "not-on-board"
        else:
            result = "not-word"

        return result

    def find_from(self, board, word, y, x, seen):
        """Can we find a word on board, starting at x, y?"""

        if x > self.board_size - 1 or y > self.board_size - 1:
            return

        # This is called recursively to find smaller and smaller words
        # until all tries are exhausted or until success.

        # Used for debugging Qu adjustments - print(word, x, y, board[y][x])

        # Base case: this isn't the letter we're looking for.

        if board[y][x] != word[0]:
            return False

        # Base case: we've used this letter before in this current path

        if (y, x) in seen:
            return False

        # Base case: this is a Q, so is the next letter in the word a U? If so, skip it.
        if board[y][x] == "Q":
            word = word[0] + word[2:]
            #print("Q found, skipping the U after it.", word)

        # Base case: we are down to the last letter --- so we win!

        if len(word) == 1:
            return True

        # Otherwise, this letter is good, so note that we've seen it,
        # and try of all of its neighbors for the first letter of the
        # rest of the word
        # This next line is a bit tricky: we want to note that we've seen the
        # letter at this location. However, we only want the child calls of this
        # to get that, and if we used `seen.add(...)` to add it to our set,
        # *all* calls would get that, since the set is passed around. That would
        # mean that once we try a letter in one call, it could never be tried again,
        # even in a totally different path. Therefore, we want to create a *new*
        # seen set that is equal to this set plus the new letter. Being a new
        # object, rather than a mutated shared object, calls that don't descend
        # from us won't have this `y,x` point in their seen.
        #
        # To do this, we use the | (set-union) operator, read this line as
        # "rebind seen to the union of the current seen and the set of point(y,x))."
        #
        # (this could be written with an augmented operator as "seen |= {(y, x)}",
        # in the same way "x = x + 2" can be written as "x += 2", but that would seem
        # harder to understand).

        seen = seen | {(y, x)}

        # adding diagonals

        if y > 0:
            if self.find_from(board, word[1:], y - 1, x, seen):
                return True

        if y < self.board_size - 1:
            if self.find_from(board, word[1:], y + 1, x, seen):
                return True

        if x > 0:
            if self.find_from(board, word[1:], y, x - 1, seen):
                return True

        if x < self.board_size - 1:
            if self.find_from(board, word[1:], y, x + 1, seen):
                return True

        # diagonals
        if y > 0 and x > 0:
            if self.find_from(board, word[1:], y - 1, x - 1, seen):
                return True

        if y < self.board_size - 1 and x < self.board_size - 1:
            if self.find_from(board, word[1:], y + 1, x + 1, seen):
                return True

        if x > 0 and y < self.board_size - 1:
            if self.find_from(board, word[1:], y + 1, x - 1, seen):
                return True

        if x < self.board_size - 1 and y > 0:
            if self.find_from(board, word[1:], y - 1, x + 1, seen):
                return True
        # Couldn't find the next letter, so this path is dead

        return False

    def find(self, board, word):
        """Can word be found in board?"""

        # Find starting letter --- try every spot on board and,
        # win fast, should we find the word at that place.

        for y in range(0, 5):
            for x in range(0, 5):
                if self.find_from(board, word, y, x, seen=set()):
                    return True

        # We've tried every path from every starting square w/o luck.
        # Sad panda.

        return False
