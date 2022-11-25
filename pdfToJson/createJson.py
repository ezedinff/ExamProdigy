#!usr/bin/python3

questions = []
with open("resp.txt") as f:
    dictionary = f.readlines()
    for line in dictionary:
        question = line.split('=')
        questions.append(question[1])
with open("qustions.json", 'a') as ans:
    ans.write("{")
    count = 1
    for dict in questions:
        if count == 1:
            ans.write(f'"name" : [ {dict}')
        elif count == len(dictionary):
            ans.write(f'{dict} ]}}')
        else:
            ans.write(f', {dict}')
        count +=1