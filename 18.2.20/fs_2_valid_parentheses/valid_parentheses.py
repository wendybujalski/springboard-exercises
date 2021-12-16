def valid_parentheses(parens):
    """Are the parentheses validly balanced?

        >>> valid_parentheses("()")
        True

        >>> valid_parentheses("()()")
        True

        >>> valid_parentheses("(()())")
        True

        >>> valid_parentheses(")()")
        False

        >>> valid_parentheses("())")
        False

        >>> valid_parentheses("((())")
        False

        >>> valid_parentheses(")()(")
        False
    """

    totalParens = 0

    for char in parens:
        if char == "(":
            totalParens += 1
        elif char == ")":
            totalParens -= 1
        
        if totalParens < 0:
            return False
    
    return totalParens == 0