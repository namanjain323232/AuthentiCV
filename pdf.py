import re
import textract
text = textract.process('resume.pdf')
print(re.split('\s{8,}',text.decode("utf-8")))