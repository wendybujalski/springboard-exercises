"""Python serial number generator."""

class SerialGenerator:
    """Machine to create unique incrementing serial numbers.
    
    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100
    """

    def __init__(self, start=0):
        """Creates a new sequential serial number generator, starting with the number given as start."""
        self.start = self.next = start

    def __repr__(self):
        """Show representation."""
        return f"<SerialGenerator start={self.start} next={self.next}>"

    def generate(self):
        """Generates a new sequential serial number."""
        self.next += 1
        return self.next - 1
    
    def reset(self):
        """Resets the generator back to the starting serial number."""
        self.next = self.start