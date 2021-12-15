def print_upper_words(words):
    """Print each word in uppercase on a separate line."""

    for word in words:
        print(word.upper())

def print_upper_words2(words):
    """Print each word that starts with the letter 'e' in uppercase on a separate line."""

    for word in words:
        if(word.lower().startswith('e')):
            print(word.upper())

def print_upper_words3(words, starts_with):
    """Print each word that starts with one of the letters in starts_with in uppercase on a separate line."""

    for word in words:
        for letter in starts_with.lower():
            if(word.lower().startswith(letter)):
                print(word.upper())
                break