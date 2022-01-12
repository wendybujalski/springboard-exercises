class Question:
    """Question on a questionnaire."""

    def __init__(self, question, choices=None, allow_text=False):
        """Create question (assume Yes/No for choices."""

        if not choices:
            choices = ["Yes", "No"]

        self.question = question
        self.choices = choices
        self.allow_text = allow_text


class Survey:
    """Questionnaire."""

    def __init__(self, title, instructions, questions):
        """Create questionnaire."""

        self.title = title
        self.instructions = instructions
        self.questions = questions


satisfaction_survey = Survey(
    "Customer Satisfaction Survey",
    "Please fill out a survey about your experience with us.",
    [
        Question("Have you shopped here before?"),
        Question("Did someone else shop with you today?"),
        Question("On average, how much do you spend a month on frisbees?",
                 ["Less than $10,000", "$10,000 or more"]),
        Question("Are you likely to shop here again?"),
    ])

personality_quiz = Survey(
    "Rithm Personality Test",
    "Learn more about yourself with our personality quiz!",
    [
        Question("Do you ever dream about code?"),
        Question("Do you ever have nightmares about code?"),
        Question("Do you prefer porcupines or hedgehogs?",
                 ["Porcupines", "Hedgehogs"]),
        Question("Which is the worst function name, and why?",
                 ["do_stuff()", "run_me()", "wtf()"],
                 allow_text=True),
    ]
)

gender_quiz = Survey(
    "Gender Identity Questionnaire",
    "Fill out this questionnaire to contemplate your gender identity.",
    [
        Question("What is the sex you were assigned at birth?",
                 ["Male", "Female", "Intersex"]),
        Question("What gender do you identify as?",
                ["Male", "Female", "Non-Binary", "Agender", "Something Else"]),
        Question("Has the gender identity you identify as publicly changed since you were born?"),
        Question("Have you ever taken steps to change your appearance to more closely align with the expectations from society for your gender?"),
        Question("Do you think your gender plays an important role in your life, or is it just a minor aspect of it?"),
        Question("Imagine a button which, when pressed, permanently changes your body to have the physical characteristics of the opposite sex from the one you were assigned at birth. If you could only push the button once and there were no external consequences to this change in your life, would you press it?"),
    ]
)

surveys = {
    "satisfaction": satisfaction_survey,
    "personality": personality_quiz,
    "identity": gender_quiz
}