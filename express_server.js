const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const randomstring = require("randomstring");
const morgan = require('morgan')
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
let cookieParser = require('cookie-parser')
app.use(cookieParser())


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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const exists = function(obj, val1, val2) {
  for (let key in obj) {
    if (obj[key][val1] === val2) {
      return true;
    }
  }
}

app.get("/register", (req, res) => {
  const templateVars = {
    user: users,
    cookies: req.cookies
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
  users[id] = { id: id, email: req.body.email, password: req.body.password}
  res.cookie('user_id', users[id].email)
  const templateVars = { cookies: req.cookies };
  res.redirect("/urls");
})

app.get("/urls", (req, res) => {
  const templateVars = { user: users, urls: urlDatabase, cookies: req.cookies };
  res.render("urls_index", templateVars);
});

app.post("/login", (req, res) => {
  if (exists(users, 'email', req.body.email) && !exists(users, 'password', req.body.password)) {
    res.status(403).send('Incorrect Password')
  }
  if (!exists(users, 'email', req.body.email)) {
    res.status(403).send('No email found')
  }
  if (exists(users, 'email', req.body.email) && exists(users, 'password', req.body.password)) {
    res.cookie('user_id', req.body.email)
    const templateVars = { cookies: req.cookies, user: users, urls: urlDatabase }
    console.log('the login was successful')
    res.redirect('/urls')
  } else {
    res.redirect('/login');
  }
});

app.get("/login", (req, res) => {
  const templateVars = { user: users, urls: urlDatabase, cookies: req.cookies };
  res.render("urls_login", templateVars);
});

app.post("/logout", (req, res) => {
  console.log(req.cookies.user_id)
  console.log('users', users)
  res.clearCookie("user_id")
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});



app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users,
    cookies: req.cookies,
  };
  res.render("urls_new", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(urlDatabase[req.params.shortURL])
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
})

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls")
})

app.post("/urls", (req, res) => {
  let short = generateRandomString();
  urlDatabase[short] = req.body.longURL
  const templateVars = { shortURL: short, longURL: req.body.longURL, cookies: req.cookies, user: users };
  res.render("urls_show", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: users, shortURL: req.params.shortURL, longURL: req.params.longURL, cookies: req.cookies };
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
  let randomstr = randomstring.generate(6)
  return randomstr;
}

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });