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
        self.start = start
        self.next = self.start
    
    def __repr__(self):
        """Display representation"""
        return f"<SerialGenerator start={self.start} next={self.next}>"

    def generate(self):
        """Increment the serial counter and return a serial number."""
        self.next += 1
        return self.next - 1

    def reset(self):
        """Reset the generator back to the origin."""
        self.next = self.start
