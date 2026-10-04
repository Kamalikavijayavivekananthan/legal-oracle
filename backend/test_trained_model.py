from services.contradiction_engine import predict_contradiction


clause1 = (
    "The agreement may not be assigned without prior written consent."
)

clause2 = (
    "The agreement may be assigned without prior written consent."
)


prediction, probability = predict_contradiction(
    clause1,
    clause2
)

print("Clause 1:", clause1)
print("Clause 2:", clause2)
print()
print("Prediction:", prediction)
print("Contradiction probability:", probability)

if prediction == 1:
    print("RESULT: CONTRADICTION")
else:
    print("RESULT: NO CONTRADICTION")