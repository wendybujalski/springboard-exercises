"""Word Finder: finds random words from a dictionary."""

import random

class WordFinder:
    """Subclass of WordFinder which excludes empty lines and comments from imported files.
    
    >>> obj = SpecialWordFinder("testfile2.txt")
    3 words read

    >>> obj.random() in ["red", "green", "blue"]
    True
    >>> obj.random() in ["red", "green", "blue"]
    True
    >>> obj.random() in ["milk", "cheese", "peanut", "skirt", "dress", "belt"]
    False
    
    """

    def __init__(self, file_path):
        """Reads the given file at file_path and prints the number of words read."""
        self.words = self.fileToList(file_path)
        print(f"{len(self.words)} words read")

    def fileToList(file_path):
        """Returns a list of words for the given file_path."""
        f = open(file_path)
        return [w.strip() for w in f]
    
    def random(self):
        """Returns a random word from the list."""
        return random.choice(self.words)

class SpecialWordFinder(WordFinder):
    """Subclass of WordFinder which excludes empty lines and comments from imported files.
    
    >>> obj = SpecialWordFinder("testfile2.txt")
    6 words read

    >>> obj.random() in ["milk", "cheese", "peanut", "skirt", "dress", "belt"]
    True
    >>> obj.random() in ["milk", "cheese", "peanut", "skirt", "dress", "belt"]
    True
    >>> obj.random() in ["red", "green", "blue"]
    False
    
    """

    def parse(self, file_path):
        """Returns a list of words for the given file_path, ignoring empty lines and lines with comments."""
        f = open(file_path)
        return [w.strip() for w in f if w.strip() and not w.startswith("#")]