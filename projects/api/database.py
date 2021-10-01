import sqlite3

# connect to database
conn = sqlite3.connect('test.db')

# create a cursor
c = conn.cursor()

# create a table
# c.execute("""CREATE TABLE memes (
#     name TEXT NOT NULL,
#     caption TEXT NOT NULL,
#     url TEXT NOT NULL UNIQUE
# )""")

# insert one value at a time
# c.execute("INSERT INTO memes VALUES ('Viral Kohli','Another home meme','https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg')")

# insert many customers
# many_customers = [('wes', 'brown', 'wes@brown.com'),
#                   ('steph', 'kuewa', 'steph@codemy.com')]
# c.executemany("INSERT INTO customers VALUES (?,?,?)", many_customers)


c.execute("SELECT rowid,* FROM memes ORDER BY rowid DESC")
# c.fetchone()
# c.fetchmany(3)   ##-> gives a list of tuples
row = c.fetchmany(100)

for i in row:
    print(i)


# update Records
# c.execute("""
#     UPDATE customers SET first_name = 'Bob'
#     WHERE last_name = 'ELDER'
# """)

# commit our command
conn.commit()

# close our connection
conn.close()
