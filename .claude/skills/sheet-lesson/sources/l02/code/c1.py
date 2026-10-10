from itertools import product

omega = {"".join(w) for w in product("FP", repeat=3)}   # F = face, P = pile
A = {w for w in omega if w[0] == "F"}                   # first flip is F
B = {w for w in omega if w[1] == "P"}                   # second flip is P

# in Python, | is union, & is intersection
print("A or B :", sorted(A | B))       # union
print("A and B:", sorted(A & B))       # intersection
print("not A  :", sorted(omega - A))   # complement, relative to omega
# De Morgan: "neither A nor B" is the complement of "A or B"
print("De Morgan holds:", omega - (A | B) == (omega - A) & (omega - B))

# equally likely outcomes: P(E) = #E / #omega
for name, E in [("A", A), ("A or B", A | B), ("A and B", A & B)]:
    print(f"P({name}) = {len(E)}/{len(omega)} = {len(E) / len(omega):.3f}")
