#!usr/bin/python3

option_1 = ''
option_2 = ''
option_3 = ''
option_4 = ''
option_5 = ''
ques = ''
quest = []
count = 1
with open("exam test.txt") as quiz:
    question = quiz.readlines()
    for li in question:
        if li != '.\n':
            quest.append(li)
        else:
            with open('resp.txt', 'a') as f:
                f.write(f'Questions{count} =')
                count += 1
                f.write(f'{{ ')
                line_ques = 0
                for line in quest:

                    line = line[:-1]

                    if not line.startswith(("a)", "b)", "c)", "d)", "e)")):
                        try:
                            ques += line.split(')', 1)[1]
                        except:
                            ques += line
                    if line.startswith(('a)')):
                        option_1 = line.split(')')
                         
                        f.write(f'"options": ["{option_1[1]}"')
                    if line.startswith(('b)')):
                        option_2 = line.split(')')
                        f.write(f',"{option_2[1]}"')
                    if line.startswith(('c)')):
                        option_3 = line.split(')')
                        f.write(f',"{option_3[1]}"')
                    if line.startswith(('d)')):
                        option_4 = line.split(')')
                        f.write(f',"{option_4[1]}"')
                    if line.startswith(('e)')):
                        option_5 = line.split(')')
                        f.write(f',"{option_5[1]}"')
                f.write(']')
                f.write(f' ,"question" :"{ques}"')
                ques=''
                f.write('}\n')

            quest.clear()


