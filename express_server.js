const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const { generateRandomString, exists } = require("./helpers");
const morgan = require('morgan')
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
var cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}))


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", user_id: "user@example.com" },
  i3BoGr: { longURL: "https://www.google.ca", user_id: "user2@example.com" }
};


//
// REGISTER
//

app.get("/register", (req, res) => {
  const templateVars = {
    user: users,
    cookies: req.session
  };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('You cannot enter an empty value');
  }
  if (exists(users, 'email', req.body.email)) {
    res.status(400).send('You cannot enter an empty value');
  };
  const id = generateRandomString(6);
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10)
  users[id] = { id: id, email: req.body.email, password: hashedPassword}
  req.session.user_id = users[id].email;
  console.log(users)
  // const templateVars = { cookies: req.cookies };
  res.redirect("/urls");
})

//
// LOGIN
//

app.post("/login", (req, res) => {
  console.log('users', users)

  if (exists(users, 'email', req.body.email) && !bcrypt.compareSync(req.body.password, exists(users, 'email', req.body.email).password)) {
    res.status(403).send('Incorrect Password')
  }
  if (!exists(users, 'email', req.body.email)) {
    res.status(403).send('No email found')
  }
  console.log('exists', exists(users, 'email', req.body.email))
  console.log('req.body.pwrod', req.body.password)
  console.log('exists pword', exists(users, 'password', req.body.password))

  if (exists(users, 'email', req.body.email) && bcrypt.compareSync(req.body.password, exists(users, 'email', req.body.email).password)) {
    req.session.user_id = req.body.email;

    const templateVars = { cookies: req.session, user: users, urls: urlDatabase }
    res.redirect('/urls')
  } else {
    res.redirect('/login');
  }
});

app.get("/login", (req, res) => {
  const templateVars = { user: users, urls: urlDatabase, cookies: req.session };
  res.render("urls_login", templateVars);
});

//
// LOGOUT
//

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect('/urls');
});



//
// LINK REDIRECT
//


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});

//
// CRUD
//



// Create

app.post("/urls", (req, res) => {
  if (req.session.user_id) {
  let short = generateRandomString();
  urlDatabase[short] = { longURL: req.body.longURL, user_id: req.session.user_id }
  const templateVars = { shortURL: short, longURL: req.body.longURL, cookies: req.session, user: users };
  res.render("urls_show", templateVars);
  } else {
    res.redirect('/login')
  }
});

// Read

app.get("/urls", (req, res) => {
  const templateVars = { user: users, urls: urlDatabase, cookies: req.session };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users,
    cookies: req.session,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: users, shortURL: req.params.shortURL, longURL: req.params.longURL, cookies: req.session };
  res.render("urls_show", templateVars);
});

// Update

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL
  res.redirect("/urls")
})

// Delete

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].user_id) {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
  }
})




//
// Other
//

app.get('*' ,(req, res) => {
  res.redirect("/urls")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });