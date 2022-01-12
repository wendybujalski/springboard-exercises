"""Madlibs Stories."""


class Story:
    """Madlibs story.

    To  make a story, pass a list of prompts, and the text
    of the template.

        >>> s = Story(["noun", "verb"],
        ...     "I love to {verb} a good {noun}.")

    To generate text from a story, pass in a dictionary-like thing
    of {prompt: answer, promp:answer):

        >>> ans = {"verb": "eat", "noun": "mango"}
        >>> s.generate(ans)
        'I love to eat a good mango.'
    """

    def __init__(self, title, slug, words, text):
        """Create story with words and template text."""

        self.title = title
        self.slug = slug
        self.prompts = words
        self.template = text

    def generate(self, answers):
        """Substitute answers into text."""

        text = self.template

        for (key, val) in answers.items():
            text = text.replace("{" + key + "}", val)

        return text


# Here's a story to get you started


simple_story = Story(
    "Once Upon A Time",
    "story",
    ["place", "noun", "verb", "adjective", "plural_noun"],
    """Once upon a time in a long-ago {place}, there lived a
    large {adjective} {noun}. It loved to {verb} {plural_noun}."""
)

monster_story = Story(
    "A MONSTER!",
    "monster",
    ["adjective", "noun", "place", "food", "verb", "number", "name"],
    """The {adjective} {noun} is real! It lives in {place} and eats only {food}.
    At night, you can hear it {verb} if you listen closely. It lives for {number} years
    and is friends with {name}."""
)

all_stories = {story.slug : story for story in [simple_story, monster_story]}