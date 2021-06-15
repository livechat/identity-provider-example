-- UP
CREATE TABLE Users (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    lastname TEXT,
    password TEXT
);

CREATE TABLE LiveChatCustomers (
    id TEXT NOT NULL PRIMARY KEY,
    cst TEXT NOT NULL,
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id)
)

-- DOWN
DROP TABLE Users;
DROP TABLE LiveChatCustomers;