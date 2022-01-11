from flask import Flask, request
from operations import add, sub, mult, div

operations = {
    "add": add,
    "sub": sub,
    "mult": mult,
    "div": div,
}

app = Flask(__name__)

@app.route('/add')
def addition():
    """Do addition of two numbers, a and b."""

    a = int(request.args.get("a"))
    b = int(request.args.get("b"))

    return str(add(a, b))

@app.route('/sub')
def subtration():
    """Do subtration of two numbers, a and b."""

    a = int(request.args.get("a"))
    b = int(request.args.get("b"))

    return str(sub(a, b))

@app.route('/mult')
def multiply():
    """Do multiplication of two numbers, a and b."""

    a = int(request.args.get("a"))
    b = int(request.args.get("b"))

    return str(mult(a, b))

@app.route('/div')
def divide():
    """Do division of two numbers, a and b."""

    a = int(request.args.get("a"))
    b = int(request.args.get("b"))

    return str(div(a, b))

@app.route('/math/<op>')
def do_operation(op):
    """Do the given operation on two numbers, a and b."""

    a = int(request.args.get("a"))
    b = int(request.args.get("b"))
    r = operations[op](a, b)

    return str(r)